'use client';

import MaxWidthContainer from '@/components/app/max-width-container';
import AppLayout from '@/components/app/app-layout';
import TeamNavigationRow from './navigation';
import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/providers/trpc-provider';
import { Skeleton } from '@/components/ui/skeleton';
import React, { useContext } from 'react';
import { redirect } from 'next/navigation';
import { inferProcedureOutput } from '@trpc/server';
import { AppRouter } from '@/server/root';

export type TeamType = NonNullable<
    inferProcedureOutput<AppRouter['_def']['procedures']['organization']['get']>
>;

interface TeamPageProps {
    params: {
        team: string;
    };
}

const TeamLayoutContext = React.createContext<{
    team: TeamType;
    refetch: () => Promise<void>;
} | null>(null);

const TeamPageLayout = ({
    params,
    children,
}: React.PropsWithChildren<TeamPageProps>) => {
    const { status } = useSession();
    const { data, isLoading, refetch } = trpc.organization.get.useQuery(
        {
            slug: params.team,
        },
        {
            enabled: status === 'authenticated',
        },
    );

    const _refetch = async () => {
        await refetch();
    };

    if (isLoading) {
        return (
            <AppLayout>
                <MaxWidthContainer>
                    <div className="mt-5">
                        <Skeleton className="w-full h-40" />
                    </div>
                </MaxWidthContainer>
            </AppLayout>
        );
    }

    if (!data) {
        return redirect('/');
    }

    return (
        <TeamLayoutContext.Provider
            value={{
                team: data,
                refetch: _refetch,
            }}
        >
            <AppLayout>
                <div className="h-14 bg-white border-b border-neutral-200">
                    <MaxWidthContainer className="flex overflow-x-auto scrollbar-hide justify-start space-x-2 items-center py-2">
                        <TeamNavigationRow />
                    </MaxWidthContainer>
                </div>
                <MaxWidthContainer className="!px-0">
                    {children}
                </MaxWidthContainer>
            </AppLayout>
        </TeamLayoutContext.Provider>
    );
};

export const useTeam = () => {
    const ctx = useContext(TeamLayoutContext);
    if (!ctx) {
        throw new Error();
    }

    return ctx;
};

export default TeamPageLayout;
