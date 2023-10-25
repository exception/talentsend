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
import { Separator } from '@/components/ui/separator';
import { trpc } from '@/lib/providers/trpc-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    email: z.string().email(),
});

interface InviteMemberFormProps {
    orgId: string;
    close: () => void;
}

const InviteMemberForm = ({ orgId, close }: InviteMemberFormProps) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    const inviteMember = trpc.organization.createInvite.useMutation({
        onSuccess() {
            close();
        },
    });

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        inviteMember.mutate({
            orgId,
            email: data.email,
        });
    };

    return (
        <Form {...form}>
            <form
                className="w-full space-y-2"
                onSubmit={form.handleSubmit(handleSubmit)}
            >
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="john@example.com"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Separator />
                <Button
                    className="w-full"
                    disabled={!form.formState.isValid}
                    icon={<Mail className="h-4 w-4" />}
                    loading={inviteMember.isLoading}
                >
                    Invite
                </Button>
            </form>
        </Form>
    );
};

export default InviteMemberForm;
