'use client';

import Container from '@/components/ui/container';
import { useTeam } from '../../layout';
import { getAllApps } from '@/app/app-store/app-registry';
import { trpc } from '@/lib/providers/trpc-provider';
import { Button, buttonVariants } from '@/components/ui/button';
import { Organization } from '@prisma/client';
import { App } from '@/app/app-store';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

const AppCard = ({
    team,
    loading,
    hasInstalled,
    app,
}: {
    team: Organization;
    loading: boolean;
    hasInstalled: boolean;
    app: App;
}) => {
    const canInstall = app.requiredPlans.includes(team.plan);

    return (
        <div className="rounded-md flex flex-col bg-white p-4 border border-neutral-200 col-span-2 space-y-2">
            <div className="flex flex-row items-start justify-between">
                <div className="flex flex-col space-y-2">
                    <p className="text-lg font-semibold">{app.name}</p>
                    <p className="text-sm text-neutral-400">
                        This app has no description.
                    </p>
                </div>
                <Image
                    src={app.appLogoUrl}
                    height={64}
                    width={64}
                    className="w-16 h-16"
                    alt={`${app.name} Logo`}
                />
            </div>
            {hasInstalled ? (
                <Link
                    href={`/t/${team.slug}/apps/${app.appId}`}
                    className={buttonVariants({ variant: 'default' })}
                >
                    <ExternalLink className="h-4 w-4" />
                    Manage
                </Link>
            ) : !canInstall ? (
                <Button loading={loading} disabled size="sm">
                    Install
                </Button>
            ) : (
                <Link
                    href={`/api/apps/${app.appId}/install?teamId=${team.id}`}
                    className={buttonVariants({ variant: 'default' })}
                >
                    Install
                </Link>
            )}
        </div>
    );
};

const AppStorePage = () => {
    const { team } = useTeam();
    const allApps = getAllApps();

    const installedApps = trpc.organization.installedApps.useQuery({
        teamId: team.id,
    });

    return (
        <Container title="Talentsend App Store">
            <div className="grid grid-flow-col grid-cols-4">
                {allApps.map((app) => (
                    <AppCard
                        key={app.appId}
                        app={app}
                        hasInstalled={
                            !!installedApps.data &&
                            !!installedApps.data.find(
                                (a) => a.appId === app.appId,
                            )
                        }
                        loading={installedApps.isLoading}
                        team={team}
                    />
                ))}
            </div>
        </Container>
    );
};

export default AppStorePage;