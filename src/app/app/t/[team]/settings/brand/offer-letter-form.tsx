'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTeam } from '../../layout';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { trpc } from '@/lib/providers/trpc-provider';
import { Button } from '@/components/ui/button';
import { SaveIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const formSchema = z.object({
    introText: z.string().optional(),
});

const OfferLetterForm = () => {
    const { team, refetch } = useTeam();
    const defaultBranding = formSchema.parse(team.brand ?? {});

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultBranding,
    });

    const updateAboutMutation = trpc.organization.update.useMutation({
        async onSuccess() {
            await refetch();
            toast.success('Saved!');
        },
        onError() {
            toast.error('Failed to save!');
        },
    });

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        // updateAboutMutation.mutate({
        //     slug: team.slug,
        //     brand: data,
        // });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="w-full space-y-2 flex-col flex"
            >
                <FormField
                    control={form.control}
                    name="introText"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Introductory Text</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder={`Congratulations! ${team.name} is happy to extend you an offer!`}
                                    {...field}
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
                    size="sm"
                >
                    Save
                </Button>
            </form>
        </Form>
    );
};

export default OfferLetterForm;
