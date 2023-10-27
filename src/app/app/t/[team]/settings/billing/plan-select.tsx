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
import { Loader2 } from 'lucide-react';

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
        };
    }, [selectedPlan, period]);

    return (
        <>
            <Modal open={upgradeModal} setOpen={setUpgradeModal}>
                <div className="flex flex-col">
                    <div className="flex flex-col bg-white p-4 space-y-2">
                        <h2 className="text-xl font-medium">
                            Upgrade to {planData.title}
                        </h2>
                        <div className="flex items-start space-y-2">
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
                <div className="flex flex-row items-center justify-between">
                    <p className="text-sm text-neutral-500">
                        Need higher limits? Upgrade to the Premium or Enterprise
                        plans.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => setUpgradeModal(true)}
                        size="sm"
                    >
                        Upgrade
                    </Button>
                </div>
            </div>
        </>
    );
};

export default PlanSelectRow;
