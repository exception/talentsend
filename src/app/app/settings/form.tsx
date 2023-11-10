'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/lib/providers/trpc-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
    fullName: z.string().min(1).max(60),
});

const AccountSettingsForm = () => {
    const { data: session, update, status } = useSession();

    const updateUser = trpc.users.update.useMutation({
        async onSuccess() {
            await update();
            toast.success('Account Settings Saved');
        },
        onError() {
            toast.error('Something went wrong', {
                description:
                    'Something went wrong while saving your account settings.',
            });
        },
    });

    const form = useForm<z.infer<typeof formSchema>>({
        mode: 'onChange',
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: session?.user.name ?? '',
        },
    });

    const handleSubmit = (form: z.infer<typeof formSchema>) => {
        updateUser.mutate(form);
    };

    useEffect(() => {
        if (!form.getValues().fullName && session?.user.name) {
            form.setValue('fullName', session.user.name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session?.user.name]);

    if (status === 'loading') {
        return (
            <div className="flex flex-col w-full space-y-2">
                <Skeleton className="w-1/2 h-6 rounded-md" />
                <Skeleton className="w-full h-6 rounded-md" />
            </div>
        );
    }

    return (
        <Form {...form}>
            <form
                className="space-y-2 flex flex-col"
                onSubmit={form.handleSubmit(handleSubmit)}
            >
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Full Name" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    disabled={
                        !form.formState.isDirty || !form.formState.isValid
                    }
                    size="sm"
                    className="self-end"
                    icon={<SaveIcon className="w-4 h-4" />}
                    loading={updateUser.isLoading}
                >
                    Save
                </Button>
            </form>
        </Form>
    );
};

export default AccountSettingsForm;
