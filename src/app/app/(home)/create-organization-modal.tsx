'use client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import slugify from '@sindresorhus/slugify';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/providers/trpc-provider';
import va from '@vercel/analytics';

const formSchema = z.object({
    name: z.string().max(40),
    slug: z.string(),
});

interface CreateOrganizationModalProps {
    setOpen: (open: boolean) => void;
}

const CreateOrganizationModal = ({ setOpen }: CreateOrganizationModalProps) => {
    const utils = trpc.useUtils();

    const createTeamMutation = trpc.organization.create.useMutation({
        async onSuccess() {
            await utils.users.organizations.refetch();
            setOpen(false);
            va.track('Created Team');
        },
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const name = form.watch('name');

    useEffect(() => {
        form.setValue('slug', slugify(name ?? ''));
    }, [name]);

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        createTeamMutation.mutate(data);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex items-center justify-center bg-white p-4">
                <h2 className="text-xl font-medium">Create a Team</h2>
            </div>
            <Separator />
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full mt-4 space-y-2"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Team Name</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Cal.com" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Team Slug</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="cal-com"
                                        addOn="talentsend.com/t/"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Separator />
                    <Button
                        disabled={!form.formState.isValid}
                        className="w-full"
                        loading={createTeamMutation.isLoading}
                    >
                        Create
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default CreateOrganizationModal;
