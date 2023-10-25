'use client';

import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { title } from 'radash';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { EquitySchema } from '@/lib/offer';

interface EquityFormProps {
    form: UseFormReturn<EquitySchema>;
    handleSubmit: SubmitHandler<EquitySchema>;
}

const EquityForm = ({ form, handleSubmit }: EquityFormProps) => {
    const preferredPrice = form.watch('preferred.issue_price');
    const preferredShares = form.watch('preferred.shares');

    useEffect(() => {
        form.setValue('valuation', preferredPrice * preferredShares);
    }, [preferredPrice, preferredShares]);

    const [hasFmv, setHasFmv] = useState(
        !!form.getValues('fair_market_value') ?? false,
    );

    const toggleFmv = (state: boolean) => {
        if (!state) {
            form.setValue('fair_market_value', undefined, {
                shouldDirty: true,
            });
            setHasFmv(false);
        } else {
            setHasFmv(true);
        }
    };

    return (
        <Form {...form}>
            <form
                id="equity-form"
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-2"
            >
                <FormField
                    control={form.control}
                    name="stage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Stage</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Funding Stage" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="max-h-96 overflow-y-scroll">
                                    {[
                                        'PRIVATE',
                                        'PRE_SEED',
                                        'SEED',
                                        'SERIES_A',
                                        'SERIES_B',
                                        'SERIES_C',
                                    ].map((tz) => (
                                        <SelectItem key={tz} value={tz}>
                                            {title(tz.toLowerCase())}
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
                    name="totalFunding"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Total Funding Amount</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={`0`}
                                    addOn="$"
                                    type="number"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="valuation"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Company Valuation</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={`0`}
                                    addOn="$"
                                    type="number"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="fair_market_value"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <div className="flex flex-row justify-between">
                                <FormLabel>Fair Market Value</FormLabel>
                                <Switch
                                    checked={hasFmv}
                                    onCheckedChange={toggleFmv}
                                />
                            </div>

                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={`0`}
                                    addOn="$"
                                    type="number"
                                    disabled={!hasFmv}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Separator />
                <h3 className="text-base font-medium">Preferred Price</h3>
                <FormField
                    control={form.control}
                    name="preferred.issue_price"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Preferred Issue Price</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={`0`}
                                    addOn="$"
                                    type="number"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="preferred.shares"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Number of Shares</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={`0`}
                                    type="number"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};

export default EquityForm;
