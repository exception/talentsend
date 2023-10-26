import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Toggle } from '@/components/ui/toggle';
import { OfferSchema } from '@/lib/offer';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useTeam } from '../layout';
import { z } from 'zod';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { vestingOptions } from '@/lib/vesting';
import { title } from 'radash';

interface EquityForm {
    form: UseFormReturn<OfferSchema>;
}

const equitySchema = z.object({
    preferred: z
        .object({
            issue_price: z.number().optional(),
        })
        .optional(),
});

const EquityForm = ({ form }: EquityForm) => {
    const { team } = useTeam();
    const showEquityDefault =
        form.getValues('compensation.equity.early') ||
        form.getValues('compensation.equity.showPerformanceScenarios') ||
        !!form.getValues('compensation.equity.vesting') ||
        !!form.getValues('compensation.equity.exerciseWindow');

    const equity = equitySchema.parse(team.equity ?? {});
    const equityAmount = form.watch('compensation.equity.quantity');

    const [equityDetails, setEquityDetails] = useState(
        showEquityDefault ?? false,
    );

    return (
        <div className="flex flex-col mb-2">
            <FormField
                control={form.control}
                name="compensation.equity.quantity"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>Equity Quantity</FormLabel>
                        <FormControl>
                            <Input {...field} type="number" placeholder={'0'} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="flex items-center justify-between my-2">
                <p className="text-sm font-medium">Equity Details</p>
                <Toggle
                    pressed={equityDetails}
                    onPressedChange={setEquityDetails}
                >
                    {equityDetails ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="w-4 h-4" />
                    )}
                </Toggle>
            </div>
            {equityDetails && (
                <div className="flex flex-col space-y-2 p-4 rounded-md bg-neutral-100 mb-2">
                    <FormField
                        control={form.control}
                        name="compensation.equity.early"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between w-full">
                                <FormLabel>Early Exerciseable?</FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value ?? false}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="compensation.equity.showPerformanceScenarios"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between w-full">
                                <FormLabel>
                                    Show equity performance scenarios?
                                </FormLabel>
                                <FormControl>
                                    <Switch
                                        checked={field.value ?? false}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="compensation.equity.vesting"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vesting</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value ?? 'standard'}
                                >
                                    <FormControl>
                                        <SelectTrigger className="!py-6">
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="max-h-96 overflow-y-scroll">
                                        {vestingOptions.map((option) => (
                                            <SelectItem
                                                key={option.id}
                                                value={option.id}
                                            >
                                                <div className="flex flex-col items-start">
                                                    <p>{option.name}</p>
                                                    <p className="text-xs text-neutral-400">
                                                        {option.values.join(
                                                            '/',
                                                        )}
                                                        {option.cliff &&
                                                            `, ${option.cliff.amount} ${option.cliff.kind} cliff`}
                                                        ,{' '}
                                                        {option.schedule.toLowerCase()}
                                                    </p>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="compensation.equity.exerciseWindow"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Exercise Window</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value ?? '1_YEAR'}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="max-h-96 overflow-y-scroll">
                                        {['6_MONTHS', '1_YEAR', '2_YEARS'].map(
                                            (option) => (
                                                <SelectItem
                                                    key={option}
                                                    value={option}
                                                >
                                                    <div className="flex flex-col items-start">
                                                        <p>
                                                            {title(
                                                                option.toLowerCase(),
                                                            )}
                                                        </p>
                                                    </div>
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            )}
            {equity.preferred?.issue_price && equityAmount > 0 && (
                <div className="flex items-center justify-between flex-row">
                    <p className="text-sm font-medium">Equity Value</p>
                    <p className="text-sm font-normal text-neutral-400">
                        {(
                            equityAmount * equity.preferred.issue_price
                        ).toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                        })}
                    </p>
                </div>
            )}
        </div>
    );
};

export default EquityForm;
