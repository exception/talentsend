import { env } from '@/env.mjs';
import { TeamPlan } from '@prisma/client';

type BillingCycle = 'MONTHLY' | 'YEARLY';

type PricingPlan = {
    price: number;
    priceId: string;
};

type PremiumPlan = {
    name: string;
    maxCuota: number; // -1 = unlimited
    type: TeamPlan;
    exceededCuotaPricing?: PricingPlan;
    stripePlans?: Record<BillingCycle, PricingPlan>;
};

export const FREE_PLAN: PremiumPlan = {
    name: "Free",
    maxCuota: 0,
    type: "FREE",
    exceededCuotaPricing: {
        price: 39,
        priceId: ''
    },
};

export const plans: PremiumPlan[] = [
    FREE_PLAN,
    {
        name: 'Team',
        maxCuota: 10,
        type: 'PREMIUM',
        exceededCuotaPricing: {
            price: 19,
            priceId: env.TEAM_PREMIUM_OVERAGE_PRICE_ID,
        },
        stripePlans: {
            MONTHLY: {
                price: 199,
                priceId: env.TEAM_PREMIUM_MONTHLY,
            },
            YEARLY: {
                price: 2000,
                priceId: env.TEAM_PREMIUM_YEARLY,
            },
        },
    },
    {
        name: 'Enterprise',
        maxCuota: -1,
        type: 'ENTERPRISE',
        stripePlans: {
            MONTHLY: {
                price: 499,
                priceId: env.ENTERPRISE_MONTHLY,
            },
            YEARLY: {
                price: 4000,
                priceId: env.ENTERPRISE_YEARLY,
            },
        },
    },
];

export const getPlanFromPriceId = (priceId?: string): { plan: TeamPlan; isYearly: boolean } | null => {
    for (const plan of plans) {      
        if (plan.stripePlans) {
            for (const [cycle, pricing] of Object.entries(plan.stripePlans)) {
                if (pricing.priceId === priceId) {
                    return { plan: plan.type, isYearly: cycle === 'YEARLY' };
                }
            }
        }
    }

    return null;
}