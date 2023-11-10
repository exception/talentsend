'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTeam } from '../../layout';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import ColorPicker from '@/components/ui/color-picker';
import { trpc } from '@/lib/providers/trpc-provider';
import { Button } from '@/components/ui/button';
import { SaveIcon } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
    primary: z.string().optional(),
    secondary: z.string().optional(),
});

const BrandColorsForm = () => {
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
        updateAboutMutation.mutate({
            slug: team.slug,
            brand: data,
        });
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col"
            >
                <div className="flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-4">
                    <FormField
                        control={form.control}
                        name="primary"
                        render={({ field }) => (
                            <FormItem className="flex flex-col w-full">
                                <FormLabel>Primary Color</FormLabel>
                                <ColorPicker
                                    className="w-full h-10"
                                    onColorChange={field.onChange}
                                    defaultColor={field.value}
                                />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="secondary"
                        render={({ field }) => (
                            <FormItem className="flex flex-col w-full">
                                <FormLabel>Secondary Color</FormLabel>
                                <ColorPicker
                                    onColorChange={field.onChange}
                                    defaultColor={field.value}
                                    className="w-full h-10"
                                />
                            </FormItem>
                        )}
                    />
                </div>
                <Button
                    className="self-end mt-2"
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

export default BrandColorsForm;
