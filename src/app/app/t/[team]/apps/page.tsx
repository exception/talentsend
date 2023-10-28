'use client';

import Container from '@/components/ui/container';
import { useTeam } from '../layout';
import { getAllApps } from '@/app/app-store/app-registry';
import { trpc } from '@/lib/providers/trpc-provider';
import { Button, buttonVariants } from '@/components/ui/button';
import { Organization } from '@prisma/client';
import { App } from '@/app/app-store';
import Link from 'next/link';
import { ExternalLink, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { title } from 'radash';
import { Input } from '@/components/ui/input';

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
    const canInstall = app.metadata.requiredPlans.includes(team.plan);
    const [installing, setInstalling] = useState(false);

    const renderButton = useMemo(() => {
        if (loading) {
            return <Skeleton className="w-full h-10" />;
        }

        if (hasInstalled) {
            return (
                <Link
                    href={`/t/${team.slug}/apps/${app.appId}`}
                    className={buttonVariants({ variant: 'default' })}
                >
                    <ExternalLink className="h-4 w-4" />
                    Manage
                </Link>
            );
        }

        if (canInstall) {
            return (
                <Link
                    href={`/api/apps/${app.appId}/install?teamId=${team.id}`}
                    className={buttonVariants({ variant: 'default' })}
                    onClick={() => setInstalling(true)}
                >
                    {installing && <Loader2 className="h-4 w-4 animate-spin" />}
                    Install
                </Link>
            );
        }

        <Button disabled size="sm">
            Install
        </Button>;
    }, [hasInstalled, installing, loading]);

    return (
        <div className="rounded-md flex flex-col bg-white p-4 border border-neutral-200 col-span-2 space-y-2">
            <div className="flex flex-row items-start justify-between">
                <div className="flex flex-col space-y-2">
                    <div className="flex flex-row items-center space-x-2">
                        {app.metadata.isNew && <Badge>NEW</Badge>}
                        <p className="text-lg font-semibold">
                            {app.metadata.name}
                        </p>
                    </div>
                    <p className="text-sm text-neutral-400">
                        {app.metadata.description ??
                            'This app has no description.'}
                    </p>
                    {true && (
                        <p className="text-sm text-neutral-600">
                            Available for{' '}
                            <span className="font-semibold">
                                {app.metadata.requiredPlans
                                    .map((plan) => title(plan.toLowerCase()))
                                    .join(', ')}
                            </span>{' '}
                            plans.
                        </p>
                    )}
                </div>
                <Image
                    src={app.metadata.appLogoUrl}
                    height={64}
                    width={64}
                    className="w-16 h-16"
                    alt={`${app.metadata.name} Logo`}
                />
            </div>
            {renderButton}
        </div>
    );
};

const AppStorePage = () => {
    const { team } = useTeam();
    const availableApps = trpc.apps.availableApps.useQuery();
    const installedApps = trpc.organization.installedApps.useQuery({
        teamId: team.id,
    });

    return (
        <Container
            title="Talentsend App Store"
            renderChild={() => (
                <Input
                    className="max-w-[200px]"
                    placeholder="Search App Store..."
                />
            )}
        >
            {availableApps.isLoading ? (
                <Skeleton className="w-full h-40" />
            ) : (
                <div className="grid grid-flow-col grid-cols-4">
                    {availableApps.data?.map((app) => (
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
            )}
        </Container>
    );
};

export default AppStorePage;
