import { PackageType } from '@/app/app/t/[team]/settings/benefits/benefit-editor';
import { BenefitPackage } from '@prisma/client';

interface BenefitRow {
    benefit?: BenefitPackage;
}

const BenefitRow = ({ benefit }: BenefitRow) => {
    const _benefit = benefit as unknown as PackageType;
    const totalBenefit = _benefit.benefits.reduce(
        (acc, val) => acc + val.value,
        0,
    );

    return (
        <div
            id="benefits"
            className="p-4 lg:p-8 bg-white rounded-xl shadow-md flex flex-col w-full space-y-4"
        >
            <div className="flex flex-row justify-between items-center w-full mb-4">
                <h1 className="text-lg lg:text-2xl font-semibold">Benefits</h1>
                <div className="flex flex-col-reverse lg:flex-row lg:space-x-2 items-end lg:items-center">
                    <p className="font-mono text-sm">
                        Estimated Annual Contribution
                    </p>
                    <h3 className="text-lg lg:text-4xl font-semibold">
                        {totalBenefit.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                        })}
                    </h3>
                </div>
            </div>
            {_benefit.benefits.map((bf, idx) => (
                <div
                    key={`benefit-${idx}`}
                    className="rounded-xl bg-white p-4 border border-neutral-200 flex flex-col"
                >
                    <div className="flex flex-row justify-between items-center w-full">
                        <h3 className="text-xl font-semibold">{bf.name}</h3>
                        {bf.value > 0 && (
                            <div className="inline-flex space-x-2 items-center">
                                <p className="text-sm font-mono">
                                    Estimated Value:
                                </p>
                                <p className="text-lg font-semibold">
                                    {bf.value.toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                        minimumFractionDigits: 0,
                                    })}
                                </p>
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-neutral-400">{bf.description}</p>
                </div>
            ))}
        </div>
    );
};

export default BenefitRow;
