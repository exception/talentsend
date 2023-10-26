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
            priceId: '',
        },
        stripePlans: {
            MONTHLY: {
                price: 199,
                priceId: '',
            },
            YEARLY: {
                price: 2000,
                priceId: '',
            },
        },
    },
    {
        name: 'Enterprise',
        maxCuota: -1,
        type: 'ENTERPRISE',
        stripePlans: {
            MONTHLY: {
                price: 199,
                priceId: '',
            },
            YEARLY: {
                price: 2000,
                priceId: '',
            },
        },
    },
];
