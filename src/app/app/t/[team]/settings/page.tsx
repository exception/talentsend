'use client';

import Container from '@/components/ui/container';
import { useTeam } from '../layout';
import TeamAboutForm from './form';
import { z } from 'zod';
import { trpc } from '@/lib/providers/trpc-provider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaveIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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

export type AboutFormSchema = z.infer<typeof formSchema>;

const TeamAboutSettingsPage = () => {
    const { team, refetch } = useTeam();
    const teamAbout = formSchema.parse(team.about ?? {});

    const updateAboutMutation = trpc.organization.update.useMutation({
        async onSuccess() {
            await refetch();
            toast.success('Saved!');
        },
        onError() {
            toast.error('Failed to save');
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
        <Container
            title={`About ${team.name}`}
            renderChild={() => (
                <Button
                    form="about-form"
                    className="self-end"
                    icon={<SaveIcon className="h-4 w-4" />}
                    disabled={
                        !form.formState.isValid || !form.formState.isDirty
                    }
                    loading={updateAboutMutation.isLoading}
                >
                    Save
                </Button>
            )}
        >
            <TeamAboutForm form={form} handleSubmit={handleSubmit} />
        </Container>
    );
};

export default TeamAboutSettingsPage;
