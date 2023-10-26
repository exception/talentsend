type VestingOption = {
    id: string;
    name: string;
    cliff?: {
        amount: number;
        kind: 'year';
    };
    schedule: 'YEARLY' | 'MONTHLY' | 'QUARTERLY';
    values: number[];
};

const standardVesting: VestingOption = {
    id: 'standard',
    name: 'Standard',
    values: [25, 25, 25, 25],
    cliff: {
        amount: 1,
        kind: 'year',
    },
    schedule: 'MONTHLY',
};

export const vestingOptions: VestingOption[] = [
    standardVesting,
    {
        id: 'standard_no_cliff',
        name: 'Standard, no cliff',
        values: [25, 25, 25, 25],
        schedule: 'MONTHLY',
    },
    {
        id: 'standard_quarterly',
        name: 'Standard, quarterly',
        values: [25, 25, 25, 25],
        cliff: {
            amount: 1,
            kind: 'year',
        },
        schedule: 'QUARTERLY',
    },
];

type VestingCalculationInput = {
    equityValue: number;
    vestingOptionId: string;
    options: number;
};

export const calculateAdjustedEquityValue = ({
    equityValue,
    vestingOptionId,
    options,
}: VestingCalculationInput) => {
    const vestingOption =
        vestingOptions.find((option) => option.id === vestingOptionId) ??
        standardVesting;

    const { values, schedule } = vestingOption;


    const adjustedValue = equityValue / values.length;
    let adjustedOptions = options;

    if (schedule === "MONTHLY") {
        adjustedOptions /= 12;
    } else if (schedule === "QUARTERLY") {
        adjustedOptions /= 4;
    }

    return {
        adjustedValue,
        adjustedOptions,
    };
};
