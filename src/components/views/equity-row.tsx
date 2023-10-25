'use client';

import { EquitySchema } from '@/app/app/t/[team]/settings/equity/page';
import { OfferSchema } from '@/lib/offer';
import { Organization } from '@prisma/client';
import { Separator } from '../ui/separator';
import { useState } from 'react';
import { first } from 'radash';
import { cn, nFormatter } from '@/lib/utils';

interface EquityRow {
    equity: NonNullable<OfferSchema['compensation']['equity']>;
    orgEquity: Organization['equity'];
    branding: { secondary: string; primary: string };
}

const EquityCard = ({
    title,
    value,
    decimals,
}: {
    title: string;
    value?: number | string;
    decimals?: boolean;
}) => {
    return (
        <div className="flex w-full flex-col items-center">
            <h3 className="text-2xl font-semibold">
                {typeof value === 'undefined'
                    ? 'Pending'
                    : typeof value === 'string'
                    ? value
                    : value.toLocaleString('en-US', {
                          style: 'currency',
                          currency: 'USD',
                          minimumFractionDigits: decimals ? 2 : 0,
                      })}
            </h3>
            <p className="text-sm font-light">{title}</p>
        </div>
    );
};

type EquityExitScenario = {
    title: string;
    multiplier: number;
};

const exitScenarios: EquityExitScenario[] = [
    {
        title: 'Current',
        multiplier: 1,
    },
    {
        title: 'Good',
        multiplier: 5,
    },
    {
        title: 'Great',
        multiplier: 10,
    },
    {
        title: 'Home Run',
        multiplier: 50,
    },
];

const EquityRow = ({ branding, equity, orgEquity }: EquityRow) => {
    const _orgEquity = EquitySchema.pick({
        preferred: true,
        valuation: true,
    }).parse(orgEquity);

    const totalEquityValue = _orgEquity.preferred.issue_price * equity.quantity;
    const [exitScenario, setExitScenario] = useState<EquityExitScenario>(
        exitScenarios[0]!,
    );

    return (
        <div className="p-4 lg:p-8 bg-white rounded-xl shadow-md flex flex-col w-full space-y-4">
            <div className="flex flex-row justify-between items-center w-full mb-4">
                <h1 className="text-lg lg:text-2xl font-semibold">Equity</h1>
                <div className="flex flex-col-reverse lg:flex-row lg:space-x-2 items-end lg:items-center">
                    <p className="font-mono text-sm">
                        {equity.quantity} Incentive Stock Options
                    </p>
                    <h3 className="text-lg lg:text-4xl font-semibold">
                        {totalEquityValue.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                        })}
                    </h3>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 items-start justify-between">
                    <EquityCard title="Equity Type" value={equity.type} />
                    <EquityCard title="Excercise Window" value={'1 Year'} />
                    <EquityCard title="Strike Price" />
                    <EquityCard
                        title="Preferred Price"
                        value={_orgEquity.preferred.issue_price}
                        decimals
                    />
                </div>
            </div>
            {equity.showPerformanceScenarios && (
                <div className="mt-4 flex flex-col space-y-4">
                    <Separator />
                    <h1 className="text-xl font-semibold">Equity Scenarios</h1>
                    <div className="flex flex-row space-x-4 w-full justify-between items-center">
                        {exitScenarios.map((scenario) => (
                            <button
                                onClick={() => setExitScenario(scenario)}
                                key={`exit-scenario-${scenario.title}`}
                                className={cn(
                                    'rounded-xl p-1 w-full text-sm lg:text-lg',
                                )}
                                style={{
                                    backgroundColor:
                                        scenario.title === exitScenario.title
                                            ? branding.secondary
                                            : 'white',
                                    color:
                                        scenario.title === exitScenario.title
                                            ? 'white'
                                            : 'black',
                                }}
                            >
                                <span className="font-semibold">
                                    {scenario.multiplier}x
                                </span>{' '}
                                {scenario.title}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-col lg:flex-row lg:space-x-4 space-y-4 lg:space-y-0 w-full justify-between">
                        <p className="text-base text-neutral-400 w-full grow-0">
                            The value of your equity if we were to exit at our
                            current valuation. Think of this as a baseline for
                            what your equity could be worth one day.
                        </p>
                        <div
                            className="w-full h-[182px] p-4 flex items-center justify-center text-white flex-col space-y-4"
                            style={{
                                backgroundColor: branding.primary,
                            }}
                        >
                            <h3 className="text-white text-4xl font-semibold">
                                {(
                                    totalEquityValue * exitScenario.multiplier
                                ).toLocaleString('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                    minimumFractionDigits: 0,
                                })}
                            </h3>
                            <p className="text-lg">Projected Equity Value</p>
                            <p className="text-lg">
                                At{' '}
                                <span className="font-semibold">
                                    ${nFormatter(_orgEquity.valuation)} company
                                    valuation
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EquityRow;
