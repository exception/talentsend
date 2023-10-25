'use client';

import SettingsContainer from '@/app/app/settings/settings-container';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTeam } from '../../layout';
import { Button } from '@/components/ui/button';
import EquityForm from './form';
import { trpc } from '@/lib/providers/trpc-provider';
import { useToast } from '@/components/ui/use-toast';

export const EquitySchema = z.object({
    stage: z.enum([
        'PRIVATE',
        'PRE_SEED',
        'SEED',
        'SERIES_A',
        'SERIES_B',
        'SERIES_C',
    ]),
    totalFunding: z.coerce.number(),
    valuation: z.coerce.number(),
    fair_market_value: z.coerce.number().optional(),
    preferred: z.object({
        issue_price: z.coerce.number(),
        shares: z.coerce.number(),
    }),
});

export type EquitySchema = z.infer<typeof EquitySchema>;

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
        <SettingsContainer
            title="Equity"
            renderChild={() => (
                <Button
                    form="equity-form"
                    disabled={
                        !form.formState.isValid || !form.formState.isDirty
                    }
                    loading={updateMutation.isLoading}
                >
                    Save
                </Button>
            )}
        >
            <EquityForm form={form} handleSubmit={handleSubmit} />
        </SettingsContainer>
    );
};

export default EquityPage;
