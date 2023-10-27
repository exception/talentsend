'use client';

import SettingsContainer from '@/app/app/settings/settings-container';
import { trpc } from '@/lib/providers/trpc-provider';
import { useTeam } from '../layout';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const AppsPage = () => {
    const { team } = useTeam();
    const installedApps = trpc.organization.installedApps.useQuery({
        teamId: team.id,
    });

    if (installedApps.isLoading) {
        <SettingsContainer title="Apps">
            <Skeleton className="w-full h-40" />
        </SettingsContainer>;
    }

    return (
        <SettingsContainer
            title="Apps"
            renderChild={() => (
                <Button disabled icon={<Search className="h-4 w-4" />}>
                    Browse App Store
                </Button>
                // <Link
                //     className={buttonVariants({ variant: 'default' })}
                //     href={`/t/${team.slug}/app-store`}
                // >
                //     <Search className="h-4 w-4" />
                //     Browse App Store
                // </Link>
            )}
        >
            {installedApps.data && installedApps.data.length === 0 && (
                <div className="flex items-center justify-center">
                    <h1 className="font-medium text-lg">
                        Your team has no apps installed yet.
                    </h1>
                </div>
            )}
        </SettingsContainer>
    );
};

export default AppsPage;
