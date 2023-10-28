'use client';

import { Separator } from '@/components/ui/separator';
import { useTeam } from '../../layout';
import Usage from './usage';
import { Button, buttonVariants } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import Modal from '@/components/ui/modal';
import { TeamPlan } from '@prisma/client';
import { title } from 'radash';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Dot, Loader2 } from 'lucide-react';
import { addMonths, addYears, format, set } from 'date-fns';

const planPrice = (
    plan: TeamPlan,
    yearly: boolean,
): { price: number; overage?: number } => {
    if (plan === 'PREMIUM') {
        return { price: yearly ? 2000 : 199, overage: 19 };
    }

    return { price: yearly ? 4000 : 499 };
};

const PlanSelectRow = () => {
    const { team } = useTeam();
    const [upgradeModal, setUpgradeModal] = useState(false);

    const [selectedPlan, setSelectedPlan] = useState<TeamPlan>('PREMIUM');
    const [period, setPeriod] = useState<'MONTH' | 'YEAR'>('MONTH');
    const [clicked, setClicked] = useState(false);

    const planData = useMemo(() => {
        return {
            title: `${title(selectedPlan.toLowerCase())}`,
            price: planPrice(selectedPlan, period === 'YEAR'),
            period: period.toLowerCase(),
            toggle: () => setPeriod(period === 'MONTH' ? 'YEAR' : 'MONTH'),
            reverse:
                period === 'MONTH' ? 'Change to Yearly' : 'Change to Monthly',
            features:
                selectedPlan === 'PREMIUM'
                    ? [
                          '10 offers / month ($19 per additional)',
                          'Deel Integration',
                          'Remote Integration',
                          'Unlimited Team Seats',
                          'Webhook Notifications',
                      ]
                    : [
                          'Send Unlimited Offers',
                          'ATS/HRIS Integrations',
                          'Custom Domains',
                          'Remove Talentsend Branding',
                          'SAML/SSO Login',
                          'Approvals and permissions',
                      ],
        };
    }, [selectedPlan, period]);

    const billingCycle = useMemo(() => {
        if (
            team.yearlyPlan &&
            team.billingCycleMonthStart &&
            team.billingCycleStart
        ) {
            const start = set(new Date(), {
                month: team.billingCycleMonthStart,
                date: team.billingCycleStart,
            });
            const end = addYears(start, 1);

            return { start, end };
        } else if (team.billingCycleStart) {
            const start = set(new Date(), { date: team.billingCycleStart });
            const end = addMonths(start, 1);

            return { start, end };
        }

        return undefined;
    }, [team.billingCycleStart, team.yearlyPlan, team.billingCycleMonthStart]);

    return (
        <>
            <Modal open={upgradeModal} setOpen={setUpgradeModal}>
                <div className="flex flex-col">
                    <div className="flex flex-col bg-white p-4 space-y-4">
                        <h2 className="text-xl font-medium">
                            Upgrade to {planData.title}
                        </h2>
                        <div className="flex flex-col items-start space-y-2">
                            <div className="flex w-full flex-row items-center justify-between">
                                <div className="flex flex-row space-x-2">
                                    <p className="text-base">
                                        {planData.title} {planData.period}ly
                                    </p>
                                    <Badge>
                                        ${planData.price.price} /{' '}
                                        {planData.period}
                                    </Badge>
                                </div>
                                <Button
                                    variant="link"
                                    onClick={() => planData.toggle()}
                                >
                                    {planData.reverse}
                                </Button>
                            </div>
                            {planData.features.map((feature, idx) => (
                                <p
                                    id={`feature-${idx}`}
                                    className="text-sm flex items-center"
                                >
                                    <Dot className="h-4 w-4 mr-1" />
                                    {feature}
                                </p>
                            ))}
                        </div>
                        <Link
                            href={`/api/stripe/upgrade?teamId=${
                                team.id
                            }&plan=${selectedPlan}${
                                period === 'YEAR' ? '&yearly=true' : ''
                            }`}
                            className={buttonVariants({ variant: 'default' })}
                            onClick={() => setClicked(true)}
                        >
                            {clicked && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}
                            Upgrade to {planData.title} {title(planData.period)}
                            ly
                        </Link>
                        <Button
                            variant="link"
                            className="!text-sm !text-neutral-400"
                            onClick={() =>
                                setSelectedPlan((old) =>
                                    old === 'ENTERPRISE'
                                        ? 'PREMIUM'
                                        : 'ENTERPRISE',
                                )
                            }
                        >
                            View{' '}
                            {selectedPlan === 'PREMIUM'
                                ? 'Enterprise'
                                : 'Premium'}{' '}
                            Plan
                        </Button>
                    </div>
                </div>
            </Modal>

            <div className="space-y-2">
                <div className="flex flex-row items-center justify-between">
                    <h3 className="text-lg font-medium">Your Plan</h3>
                    <Badge>{team.plan}</Badge>
                </div>
                <Usage />
                {team.plan != 'FREE' &&
                    billingCycle?.start &&
                    billingCycle?.end && (
                        <div className="w-full p-4 rounded-md border border-neutral-200 bg-white flex flex-row justify-between items-center mt-5">
                            <h3 className="text-base font-medium">
                                Billing Cycle
                            </h3>
                            <div className="flex flex-row items-center space-x-2">
                                <Badge>
                                    {format(billingCycle.start, 'dd MMM, yyyy')}
                                </Badge>

                                <p className="font-medium">-</p>
                                <Badge>
                                    {format(billingCycle.end, 'dd MMM, yyyy')}
                                </Badge>
                            </div>
                        </div>
                    )}
                <div className="flex flex-row items-center justify-between">
                    {team.plan === 'FREE' && (
                        <p className="text-sm text-neutral-500">
                            Need higher limits? Upgrade to the{' '}
                            <span className="font-semibold">Premium</span> or{' '}
                            <span className="font-semibold">Enterprise</span>{' '}
                            plans.
                        </p>
                    )}
                    {team.plan === 'PREMIUM' && (
                        <p className="text-sm text-neutral-500">
                            Need to send unlimited offers? Upgrade to the{' '}
                            <span className="font-semibold">Enterprise</span>{' '}
                            plan.
                        </p>
                    )}
                    {team.plan !== 'ENTERPRISE' && (
                        <Button
                            variant="outline"
                            onClick={() => setUpgradeModal(true)}
                            size="sm"
                        >
                            Upgrade
                        </Button>
                    )}
                </div>
            </div>
        </>
    );
};

export default PlanSelectRow;
