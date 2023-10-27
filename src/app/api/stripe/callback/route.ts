import { prisma } from '@/db';
import { authOptions } from '@/lib/auth/options';
import { APP_URL } from '@/lib/constants';
import { getCustomerAndCheckoutSession } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const queryParams = z.object({
    checkoutId: z.string()
});

export const GET = async (req: Request) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return new Response(null, { status: 403 });
        }

        const url = new URL(req.url);
        const { checkoutId } = queryParams.parse(
            Object.fromEntries(url.searchParams),
        );

        const { stripeCustomer, checkoutSession } =
            await getCustomerAndCheckoutSession(checkoutId);

        if (!stripeCustomer) {
            return Response.redirect(
                `${APP_URL}/settings/billing?error=Stripe customer deleted or not found`,
            );
        }

        let team = await prisma.organization.findFirst({
            where: {
                stripeCustomerId: stripeCustomer.id,
            },
        });

        if (!team) {
            return Response.redirect(`${APP_URL}?error=Team not found`);
        }

        const offerId = checkoutSession.metadata?.offerId;

        if (checkoutSession.payment_status === 'paid') {
            if (!team) {
                return Response.redirect(
                    `${APP_URL}/settings/billing?error=User not found`,
                );
            }

            await prisma.offer.update({
                where: {
                    id: offerId,
                },
                data: {
                    status: 'DRAFT',
                },
            });
        }

        return Response.redirect(
            `${APP_URL}/t/${team.slug}/offer/${offerId}?payment_status=${checkoutSession.payment_status}`,
        );
    } catch (err) {
        console.error('Failed stripe checkout', err);
        return Response.redirect(`${APP_URL}?error=Stripe checkout failed`);
    }
};
