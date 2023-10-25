'use client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { Button } from '@/components/ui/button';
import { SaveIcon } from 'lucide-react';
import { trpc } from '@/lib/providers/trpc-provider';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
    mission: z.string().optional(),
    about: z.string().optional(),
    size: z
        .enum(['1-10', '10-49', '49-99', '99-199', '200-499', '500+'])
        .optional(),
    location: z.string().optional(),
    funding: z.number().optional(),
    website: z.string().url().optional(),
});

const TeamAboutForm = () => {
    const { team, refetch } = useTeam();
    const teamAbout = formSchema.parse(team.about ?? {});
    const { toast } = useToast();

    const updateAboutMutation = trpc.organization.update.useMutation({
        async onSuccess() {
            await refetch();
            toast({
                title: 'Saved!',
            });
        },
        onError() {
            toast({
                title: 'Failed to save',
                variant: 'destructive',
            });
        },
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: teamAbout,
    });

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        updateAboutMutation.mutate({
            slug: team.slug,
            about: data,
        });
    };

    return (
        <Form {...form}>
            <form
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
                <Button
                    className="self-end"
                    icon={<SaveIcon className="h-4 w-4" />}
                    disabled={
                        !form.formState.isValid || !form.formState.isDirty
                    }
                    loading={updateAboutMutation.isLoading}
                >
                    Save
                </Button>
            </form>
        </Form>
    );
};

export default TeamAboutForm;
