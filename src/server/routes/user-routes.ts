import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import cloudinary from 'cloudinary';

export const userRoutes = createTRPCRouter({
    update: protectedProcedure
        .input(
            z.object({
                fullName: z.string().optional(),
            }),
        )
        .mutation(async ({ ctx: { session, prisma }, input }) => {
            return prisma.user.update({
                where: {
                    id: session.user.id,
                },
                data: {
                    name: input.fullName,
                },
            });
        }),
    updateAvatar: protectedProcedure
        .input(
            z.object({
                image: z.string().optional(),
            }),
        )
        .mutation(async ({ ctx: { session, prisma }, input }) => {
            const image = input.image;
            if (!image) {
                return prisma.user.update({
                    where: {
                        id: session.user.id,
                    },
                    data: {
                        image: null,
                    },
                });
            }

            const { secure_url } = await cloudinary.v2.uploader.upload(image, {
                folder: 'user_pictures',
                public_id: session.user.id,
                overwrite: true,
                invalidate: true,
            });

            return prisma.user.update({
                where: {
                    id: session.user.id,
                },
                data: {
                    image: secure_url,
                },
            });
        }),
    organizations: protectedProcedure.query(({ ctx: { session, prisma } }) => {
        return prisma.organization.findMany({
            where: {
                members: {
                    some: {
                        userId: session.user.id,
                    },
                },
            },
        });
    }),
    invites: protectedProcedure.query(({ ctx: { session, prisma } }) => {
        return prisma.memberInvite.findMany({
            where: {
                target: session.user.email,
            },
            include: {
                organization: {
                    select: {
                        name: true,
                        imageUrl: true,
                    },
                },
            },
        });
    }),
    updateInvite: protectedProcedure
        .input(
            z.object({
                inviteId: z.string(),
                state: z.enum(['accept', 'reject']),
            }),
        )
        .mutation(async ({ ctx: { session, prisma }, input }) => {
            if (input.state === 'reject') {
                await prisma.memberInvite.delete({
                    where: {
                        id: input.inviteId,
                        target: session.user.email.toLowerCase(),
                    },
                });

                return { status: "dismissed" }
            }

            const invite = await prisma.memberInvite.findFirst({
                where: {
                    id: input.inviteId,
                    target: session.user.email.toLowerCase(),
                },
            });

            if (!invite) throw new Error('Unknown invite');

            await prisma.$transaction([
                prisma.organization.update({
                    where: {
                        id: invite.organizationId,
                    },
                    data: {
                        members: {
                            create: {
                                userId: session.user.id,
                            },
                        },
                    },
                }),
                prisma.memberInvite.delete({
                    where: {
                        id: invite.id,
                    },
                }),
            ]);

            return { status: "accepted" };
        }),
});
