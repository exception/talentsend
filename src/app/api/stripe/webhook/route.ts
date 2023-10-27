import { prisma } from '@/db';
import { env } from '@/env.mjs';
import { getPlanFromPriceId, plans } from '@/lib/plans';
import stripe from '@/lib/stripe';
import { log } from '@/lib/utils';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const relevantEvents = new Set([
    'customer.subscription.updated',
    'checkout.session.completed',
    'customer.subscription.deleted',
]);

export const POST = async (req: Request) => {
    const buf = await req.text();
    const sig = req.headers.get('Stripe-Signature') as string;
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;
    try {
        if (!sig || !webhookSecret) return NextResponse.json({ received: true });;
        event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
        // @ts-expect-error
        console.log('Stripe Error Message: ', err.message);
        // @ts-expect-error
        return new Response(`Webhook Error: ${err.message}`, {
            status: 400,
        });
    }

    if (relevantEvents.has(event.type)) {
        try {
            if (event.type === 'checkout.session.completed') {
                const checkoutSession = event.data
                    .object as Stripe.Checkout.Session;
                if (checkoutSession.mode === 'payment') return NextResponse.json({ received: true });; // we don't care about one time payments

                if (
                    checkoutSession.client_reference_id === null ||
                    checkoutSession.customer === null
                ) {
                    await log({
                        message: 'Missing items in Stripe webhook Callback',
                        mention: true,
                    });
                    return NextResponse.json({ received: true });;
                }

                await prisma.organization.update({
                    where: {
                        id: checkoutSession.client_reference_id,
                    },
                    data: {
                        billingCycleStart: new Date().getDate(),
                        billingCycleMonthStart: new Date().getMonth()
                    },
                });
            } else if (event.type === 'customer.subscription.updated') {
                const subscriptionUpdated = event.data
                    .object as Stripe.Subscription;
                const priceId = subscriptionUpdated.items.data[0]?.price.id;

                const plan = getPlanFromPriceId(priceId);
                if (!plan) {
                    console.log('Unknown Stripe Plan', priceId);
                    return new Response(`Unknown Stripe Plan ${priceId}`);
                }

                const stripeCustomerId =
                    subscriptionUpdated.customer.toString();

                const data = await prisma.organization.update({
                    where: {
                        stripeCustomerId,
                    },
                    data: {
                        plan: plan.plan,
                        yearlyPlan: plan.isYearly,
                        offerCuota: 0 // reset in case 
                    },
                });

                if (!data) {
                    await log({
                        message: `Team not found in Stripe webhook \`customer.subscription.updated\` callback (${stripeCustomerId})`,
                    });
                }
            } else if (event.type === 'customer.subscription.deleted') {
                const subscriptionDeleted = event.data
                    .object as Stripe.Subscription;
                const stripeCustomerId =
                    subscriptionDeleted.customer.toString();

                const team = await prisma.organization.findUnique({
                    where: {
                        stripeCustomerId,
                    },
                    select: {
                        name: true,
                    },
                });

                if (!team) {
                    await log({
                        message: `Team not found in Stripe webhook \`customer.subscription.deleted\` callback (${stripeCustomerId})`,
                        mention: true,
                    });
                    return NextResponse.json({ received: true });;
                }

                await Promise.all([
                    prisma.organization.update({
                        where: {
                            stripeCustomerId,
                        },
                        data: {
                            plan: 'FREE',
                            yearlyPlan: false,
                            billingCycleStart: null,
                        },
                    }),
                    log({
                        message: `Team *${team.name}* has cancelled their subscription.`,
                        mention: true,
                    }),
                ]);
            }
        } catch (err) {
            await log({
                message: `Stripe webhook failed. Error ${err}`,
                mention: true,
            });

            return new Response('Webhook error. View logs.', { status: 400 });
        }
    } else {
        return new Response(`Unhandled event type: ${event.type}`, {
            status: 400,
        });
    }

    return NextResponse.json({ received: true });
};
