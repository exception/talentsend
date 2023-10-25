'use client';

import { BenefitPackage, Organization } from '@prisma/client';
import { PartialOffer } from './public-offer';
import { PackageType } from '@/app/app/t/[team]/settings/benefits/benefit-editor';
import { Separator } from '../ui/separator';
import { EquitySchema } from '@/app/app/t/[team]/settings/equity/page';

interface CompensationRow {
    comp: PartialOffer['compensation'];
    branding: {
        primary: string;
    };
    benefit?: BenefitPackage;
    orgEquity: Organization['equity'];
}

const CompCard = ({
    title,
    value,
    color,
    description,
}: {
    title: string;
    value: number;
    color: string;
    description: string;
}) => {
    return (
        <div className="w-full rounded-xl bg-white border border-neutral-200 flex flex-col overflow-hidden">
            <div className="flex items-center justify-center flex-col p-9">
                <h3 className="text-4xl font-semibold">
                    {value.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                    })}
                </h3>
                <p className="text-base">{title}</p>
            </div>
            <div
                className="self-end p-4 w-full text-center text-white text-xs font-mono"
                style={{
                    backgroundColor: color,
                }}
            >
                {description}
            </div>
        </div>
    );
};

const BreakdownCard = ({ title, value }: CardType) => {
    return (
        <div className="flex w-full flex-col items-center">
            <h3 className="text-2xl font-semibold">
                {value.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                })}
            </h3>
            <p className="text-sm font-light">{title}</p>
        </div>
    );
};

type CardType = {
    title: string;
    value: number;
    description?: string;
};

const calculateAnnualComp = (
    comp: PartialOffer['compensation'],
    benefit?: BenefitPackage,
    orgEquity?: unknown,
) => {
    let base = comp?.value ?? 0;
    const cards: CardType[] = [];
    const breakdown: CardType[] = [];

    if (comp?.targetComission) {
        cards.push({
            title: 'On Target Earnings',
            value: comp.targetComission + base,
            description: 'Paid Annually',
        });

        breakdown.push({
            title: 'Base Salary',
            value: base,
        });

        breakdown.push({
            title: 'Target Comission',
            value: comp.targetComission,
        });

        base += comp.targetComission;
    } else {
        cards.push({
            title: 'Base Salary',
            value: base,
            description: 'Paid Annually',
        });
    }

    if (benefit) {
        const _benefit = benefit as unknown as PackageType;
        const benefitValue = _benefit.benefits.reduce(
            (acc, val) => acc + val.value,
            0,
        );

        cards.push({
            title: 'Benefits',
            value: benefitValue,
            description: "Company's Annual Contribution",
        });
    }

    if (comp?.signOnBonus) {
        breakdown.push({
            title: 'Sign On Bonus',
            value: comp.signOnBonus,
        });
    }

    if (comp?.targetBonus) {
        breakdown.push({
            title: 'Target Bonus',
            value: comp.targetBonus,
        });
    }

    if (comp?.equity && orgEquity) {
        const _orgEquity = EquitySchema.pick({ preferred: true }).parse(
            orgEquity,
        );
        const equityTotal =
            comp.equity.quantity * _orgEquity.preferred.issue_price;

        cards.push({
            title: 'Equity',
            value: equityTotal,
            description: `${comp.equity.quantity} Options Vested`,
        });
    }

    return {
        value: base,
        cards,
        breakdown,
        hasOte: !!comp?.targetComission,
    };
};

const CompensationRow = ({
    comp,
    branding,
    benefit,
    orgEquity,
}: CompensationRow) => {
    const { hasOte, cards, breakdown, value } = calculateAnnualComp(
        comp,
        benefit,
        orgEquity,
    );

    return (
        <div className="p-4 lg:p-8 bg-white rounded-xl shadow-md flex flex-col w-full space-y-4 lg:space-y-8">
            <div className="flex flex-row justify-between items-center w-full">
                <h1 className="text-lg lg:text-2xl font-semibold">Overview</h1>
                <div className="flex flex-col-reverse lg:flex-row lg:space-x-2 items-end lg:items-center">
                    <p className="font-mono text-sm">
                        {hasOte
                            ? 'Total Annual Comp w/ OTE'
                            : 'Total Annual Comp'}
                    </p>
                    <h3 className="text-lg lg:text-4xl font-semibold">
                        {value.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                        })}
                    </h3>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 items-center justify-between">
                {cards.map((card, idx) => (
                    <CompCard
                        key={`card-${idx}`}
                        title={card.title}
                        value={card.value}
                        color={branding.primary}
                        description={card.description ?? ''}
                    />
                ))}
            </div>
            {breakdown.length > 0 && (
                <div className="flex flex-col">
                    <Separator className="mb-8" />
                    <h1 className="text-base lg:text-lg font-semibold mb-5">
                        Cash Breakdown
                    </h1>
                    <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 items-start justify-between">
                        {breakdown.map((brk, idx) => (
                            <BreakdownCard
                                key={`brk-${idx}`}
                                title={brk.title}
                                value={brk.value}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompensationRow;
