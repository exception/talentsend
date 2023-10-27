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
import { useTeam } from '../layout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { AboutFormSchema } from './page';

interface AboutFormProps {
    form: UseFormReturn<AboutFormSchema>;
    handleSubmit: SubmitHandler<AboutFormSchema>;
}

const TeamAboutForm = ({ form, handleSubmit }: AboutFormProps) => {
    const { team } = useTeam();

    return (
        <Form {...form}>
            <form
                id="about-form"
                className="w-full space-y-2 flex-col flex"
                onSubmit={form.handleSubmit(handleSubmit)}
            >
                <FormField
                    control={form.control}
                    name="mission"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mission Statement</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={`${team.name}'s mission statement`}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="about"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>About</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    placeholder={`Some information on ${team.name} that candidates can read about.`}
                                    rows={8}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex flex-col lg:flex-row lg:space-x-2 space-y-2 lg:space-y-0 w-full">
                    <FormField
                        control={form.control}
                        name="size"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Company Size</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Company Size" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="max-h-96 overflow-y-scroll">
                                        {[
                                            '1-10',
                                            '10-49',
                                            '49-99',
                                            '99-199',
                                            '200-499',
                                            '500+',
                                        ].map((tz) => (
                                            <SelectItem key={tz} value={tz}>
                                                {tz}
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
                        name="location"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Remote" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem className="w-full">
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="https://talentsend.com"
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

export default TeamAboutForm;
