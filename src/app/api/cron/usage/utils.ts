import { prisma } from '@/db';
import { plans } from '@/lib/plans';
import { getAdjustedBillingCycleStart } from '@/lib/utils';

export const updateUsage = async () => {
    const teams = await prisma.organization.findMany({
        where: {
            offers: { some: {} },
            plan: 'PREMIUM',
        },
        select: {
            id: true,
            offerCuota: true,
            billingCycleStart: true,
        },
    });

    const premiumPlan = plans.find((p) => p.type === 'PREMIUM')!;
    const billingReset = teams.filter(
        ({ offerCuota, billingCycleStart }) =>
            offerCuota > premiumPlan?.maxCuota &&
            getAdjustedBillingCycleStart(billingCycleStart as number) ===
                new Date().getDate(),
    );

    const resetBillingResponse = await Promise.allSettled(
        billingReset.map(async (team) => {
            return await prisma.organization.update({
                where: {
                    id: team.id
                },
                data: {
                    offerCuota: 0
                }
            })
        })
    );

    return {
        resetBillingResponse
    }
};
