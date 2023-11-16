'use client';

import MaxWidthContainer from '@/components/app/max-width-container';
import AppLayout from '@/components/app/app-layout';
import TeamNavigationRow from './navigation';
import { useSession } from 'next-auth/react';
import { trpc } from '@/lib/providers/trpc-provider';
import { Skeleton } from '@/components/ui/skeleton';
import React, { useContext, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { inferProcedureOutput } from '@trpc/server';
import { AppRouter } from '@/server/root';
import { Crisp } from 'crisp-sdk-web';
import { useAutoAnimate } from '@formkit/auto-animate/react';

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
    const [parentDivRef] = useAutoAnimate();

    const _refetch = async () => {
        await refetch();
    };

    useEffect(() => {
        if (data?.plan) {
            Crisp.session.setData({
                teamId: data.id,
                teamName: data.name,
                slug: data.slug,
                plan: data.plan,
                ...(data.stripeCustomerId && {
                    stripeId: data.stripeCustomerId,
                }),
            });
        }
    }, [data]);

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
                    <div ref={parentDivRef} className="flex w-full">
                        {children}
                    </div>
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
