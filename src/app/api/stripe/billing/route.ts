import { prisma } from '@/db';
import { APP_URL } from '@/lib/constants';
import stripe, { getStripeCustomerId } from '@/lib/stripe';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const queryParams = z.object({
    teamId: z.string(),
});

export const GET = async (req: Request) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return new Response(null, { status: 403 });
    }

    const url = new URL(req.url);
    const { teamId } = queryParams.parse(Object.fromEntries(url.searchParams));
    if (!teamId) {
        return new Response('Team ID must be present', { status: 400 });
    }

    const team = await prisma.organization.findUnique({
        where: {
            id: teamId,
            members: {
              some: {
                userId: session.user.id
              }
            }
        },
    });

    if (!team) {
        throw new Response('Team ID is not valid', { status: 400 });
    }

    const customerId = await getStripeCustomerId(team);
    if (!customerId) {
        return Response.redirect(
            `${APP_URL}/t/${team.slug}/settings/billing?error=Stripe customer id not found`,
        );
    }

    const stripeSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${APP_URL}/t/${team.slug}/settings/billing`,
    });

    return Response.redirect(stripeSession.url);
};
