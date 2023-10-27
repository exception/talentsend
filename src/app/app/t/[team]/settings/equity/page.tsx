'use client';

import Container from '@/components/ui/container';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTeam } from '../../layout';
import { Button } from '@/components/ui/button';
import EquityForm from './form';
import { trpc } from '@/lib/providers/trpc-provider';
import { useToast } from '@/components/ui/use-toast';
import { EquitySchema } from '@/lib/offer';
import { Save } from 'lucide-react';

const EquityPage = () => {
    const { team, refetch } = useTeam();
    const { toast } = useToast();
    const equity = EquitySchema.partial().parse(team.equity ?? {});

    const form = useForm<z.infer<typeof EquitySchema>>({
        resolver: zodResolver(EquitySchema),
        defaultValues: equity,
    });

    const updateMutation = trpc.organization.update.useMutation({
        async onSuccess() {
            toast({
                title: 'Saved Equity settings',
            });
            await refetch();
        },
    });

    const handleSubmit = (data: EquitySchema) => {
        updateMutation.mutate({
            slug: team.slug,
            equity: data,
        });
    };

    return (
        <Container
            title="Equity"
            renderChild={() => (
                <Button
                    form="equity-form"
                    disabled={
                        !form.formState.isValid || !form.formState.isDirty
                    }
                    loading={updateMutation.isLoading}
                    icon={<Save className="h-4 w-4" />}
                >
                    Save
                </Button>
            )}
        >
            <EquityForm form={form} handleSubmit={handleSubmit} />
        </Container>
    );
};

export default EquityPage;
