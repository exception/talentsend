'use client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { SubmitHandler, UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { OfferSchema } from '@/lib/offer';
import { Separator } from '@/components/ui/separator';
import Popover from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTeam } from '../layout';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import VariableCompForm from './variable-comp-form';
import EquityForm from './equity-form';
import { title } from 'radash';

interface FormProps {
    form: UseFormReturn<OfferSchema>;
    handleSubmit: SubmitHandler<OfferSchema>;
}

const OfferForm = ({ form, handleSubmit }: FormProps) => {
    const { team } = useTeam();
    const showVcDefault =
        !!form.getValues('compensation.signOnBonus') ||
        !!form.getValues('compensation.targetBonus') ||
        !!form.getValues('compensation.targetComission');
    const [includeVC, setIncludeVC] = useState(showVcDefault ?? false);

    return (
        <>
            <Form {...form}>
                <form
                    id="new-offer-form"
                    className="w-full flex-col flex"
                    onSubmit={form.handleSubmit(handleSubmit)}
                >
                    <h3 className="text-base lg:text-lg font-semibold">
                        Offer Details
                    </h3>
                    <Separator className="my-2" />
                    <div className="flex flex-col lg:flex-row lg:gap-x-2">
                        <FormField
                            control={form.control}
                            name="candidateName"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Candidate Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={`John Doe`}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="candidateEmail"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Candidate Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={`john@example.com`}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder={`Software Engineer`}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col lg:flex-row lg:gap-x-2 mt-2">
                        <FormField
                            control={form.control}
                            name="expiryDate"
                            render={({ field }) => (
                                <FormItem className="flex w-full flex-col mb-2">
                                    <FormLabel>
                                        Offer Expiry Date{' '}
                                        <span className="text-sm font-normal text-neutral-400">
                                            (optional)
                                        </span>
                                    </FormLabel>
                                    <Popover
                                        render={() => (
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date <= new Date() ||
                                                    date <=
                                                        new Date('1900-01-01')
                                                }
                                            />
                                        )}
                                    >
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value &&
                                                        'text-muted-foreground',
                                                )}
                                            >
                                                {field.value ? (
                                                    format(
                                                        field.value,
                                                        'MMM dd, yyyy',
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem className="flex w-full flex-col">
                                    <FormLabel>
                                        Start Date{' '}
                                        <span className="text-sm font-normal text-neutral-400">
                                            (optional)
                                        </span>
                                    </FormLabel>
                                    <Popover
                                        render={() => (
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date <= new Date() ||
                                                    date <=
                                                        new Date('1900-01-01')
                                                }
                                            />
                                        )}
                                    >
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value &&
                                                        'text-muted-foreground',
                                                )}
                                            >
                                                {field.value ? (
                                                    format(
                                                        field.value,
                                                        'MMM dd, yyyy',
                                                    )
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="introduction"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Offer Introduction</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder={'Test'} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col lg:flex-row lg:gap-x-2">
                        <FormField
                            control={form.control}
                            name="manager.name"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Manager Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={'John Doe'}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="manager.email"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Manager Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder={'john@example.com'}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <h3 className="text-base font-medium mt-2">Compensation</h3>
                    <Separator className="my-2" />
                    <FormLabel>Base Salary</FormLabel>
                    <div className="flex flex-row items-center space-x-2 justify-between mt-2">
                        <FormField
                            control={form.control}
                            name="compensation.value"
                            render={({ field }) => (
                                <FormItem className="w-full">
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
                            name="compensation.rate"
                            render={({ field }) => (
                                <FormItem>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value ?? 'YEARLY'}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-96 overflow-y-scroll">
                                            {[
                                                'YEARLY',
                                                'MONTHLY',
                                                'HOURLY',
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
                    </div>
                    <div className="flex items-center justify-between my-2">
                        <p className="text-sm font-medium">
                            Include Variable Comp & Bonuses?
                        </p>
                        <Switch
                            checked={includeVC}
                            onCheckedChange={setIncludeVC}
                        />
                    </div>
                    {includeVC && <VariableCompForm form={form} />}
                    {team.equity && <EquityForm form={form} />}
                    {team.benefitPackages.length > 0 && (
                        <FormField
                            control={form.control}
                            name="compensation.benefit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Benefit Package{' '}
                                        <span className="text-sm font-normal text-neutral-400">
                                            (optional)
                                        </span>
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a Benefit Package" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-96 overflow-y-scroll">
                                            {team.benefitPackages.map((tz) => (
                                                <SelectItem
                                                    key={tz.id}
                                                    value={tz.id}
                                                >
                                                    {tz.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </form>
            </Form>
        </>
    );
};

export default OfferForm;
