import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { OfferSchema } from '@/lib/offer';
import { UseFormReturn } from 'react-hook-form';

interface VariableCompForm {
    form: UseFormReturn<OfferSchema>;
}

const VariableCompForm = ({ form }: VariableCompForm) => {
    return (
        <div className="flex flex-col lg:flex-row lg:space-x-2 lg:space-y-0 space-y-2 mb-2">
            <FormField
                control={form.control}
                name="compensation.signOnBonus"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>
                            Sign On Bonus{' '}
                            <span className="text-sm font-normal text-neutral-400">
                                (optional)
                            </span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="number"
                                placeholder={'0'}
                                addOn="$"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="compensation.targetBonus"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>
                            Target Bonus{' '}
                            <span className="text-sm font-normal text-neutral-400">
                                (optional)
                            </span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="number"
                                placeholder={'0'}
                                addOn="$"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="compensation.targetComission"
                render={({ field }) => (
                    <FormItem className="w-full">
                        <FormLabel>
                            Target Comission{' '}
                            <span className="text-sm font-normal text-neutral-400">
                                (optional)
                            </span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="number"
                                placeholder={'0'}
                                addOn="$"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};

export default VariableCompForm;
