'use client';

import { getAppById } from '@/app/app-store/app-registry';
import { redirect } from 'next/navigation';
import { useTeam } from '../../layout';
import Container from '@/components/ui/container';
import { trpc } from '@/lib/providers/trpc-provider';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
    params: {
        appId: string;
    };
}

const SpecificAppPage = ({ params }: Props) => {
    const app = getAppById(params.appId);
    const { team } = useTeam();
    const { isLoading, data } = trpc.organization.appData.useQuery({
        appId: params.appId,
        teamId: team.id,
    });

    if (!app) {
        return redirect(`/t/${team.slug}/apps`);
    }

    return (
        <Container
            backUrl={`/t/${team.slug}/apps`}
            title={`${app.metadata.name} App`}
        >
            {isLoading && <Skeleton className="w-full h-40" />}
        </Container>
    );
};

export default SpecificAppPage;
