import { type DefaultSession, type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { env } from '@/env.mjs';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db';
import { type User } from '@prisma/client';
import { defaultCookies } from '@/lib/constants/cookies';
import { IS_ON_VERCEL } from '@/lib/constants';
import { DateTime } from 'luxon';
import { sendEmail } from '@/lib/loops';

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: User;
    }
}

export const authOptions: NextAuthOptions = {
    // debug: true,
    providers: [
        GoogleProvider({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        // GitHubProvider({
        //   clientId: env.GITHUB_CLIENT_ID,
        //   clientSecret: env.GITHUB_CLIENT_SECRET,
        //   allowDangerousEmailAccountLinking: true,
        // }),
    ],
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    pages: {
        error: '/signin',
    },
    cookies: defaultCookies(IS_ON_VERCEL),
    callbacks: {
        signIn: async ({ user, profile }) => {
            if (!user.email) {
                return false;
            }

            const existing = await prisma.user.findUnique({
                where: { email: user.email },
                select: { name: true },
            });

            if (existing && !existing.name) {
                await prisma.user.update({
                    where: { email: user.email },
                    data: {
                        name: profile?.name,
                    },
                });
            }

            return true;
        },
        jwt: async ({ token, user, trigger }) => {
            if (!token.email) {
                return {};
            }
            if (user) {
                token.user = user;
            }
            if (trigger === 'update') {
                const refreshedUser = await prisma.user.findUnique({
                    where: { id: token.sub },
                });

                if (refreshedUser) {
                    token.user = refreshedUser;
                } else {
                    return {};
                }
            }

            return token;
        },
        session: ({ session, token }) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            session.user = {
                id: token.sub,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                ...(token || session).user,
            };
            return session;
        },
    },
    events: {
        signIn: async (message) => {
            if (message.isNewUser) {
                // isNewUser is triggered by dangerous account linking too
                const email = message.user.email!;
                const user = await prisma.user.findUnique({
                    where: { email },
                    select: { name: true, joinedAt: true },
                });

                if (user?.joinedAt) {
                    const start = DateTime.fromJSDate(user.joinedAt);
                    const difference = DateTime.now().diff(start, 'seconds');

                    if (difference.seconds <= 10) {
                        void sendEmail({
                            target: email,
                            type: 'WELCOME',
                            body: {
                                firstname: user.name,
                            },
                        });
                    }
                }
            }
        },
    },
};
