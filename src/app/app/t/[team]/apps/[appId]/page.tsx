'use client';

import { getAppById } from '@/app/app-store/app-registry';
import { redirect, useSearchParams } from 'next/navigation';
import { useTeam } from '../../layout';
import Container from '@/components/ui/container';
import { trpc } from '@/lib/providers/trpc-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import Modal from '@/components/ui/modal';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { renderAppChild } from './app-data-registry';

interface Props {
    params: {
        appId: string;
    };
}

const SpecificAppPage = ({ params }: Props) => {
    const app = getAppById(params.appId);
    const [isRemoving, setIsRemoving] = useState(false);
    const { team } = useTeam();
    const { isLoading, data } = trpc.organization.appData.useQuery({
        appId: params.appId,
        teamId: team.id,
    });
    const router = useRouter();

    const uninstallMutation = trpc.organization.deleteApp.useMutation({
        onSuccess() {
            toast.success(
                `You have uninstalled the ${app?.metadata.name} app.`,
            );
            router.push(`/t/${team.slug}/apps`);
        },
    });

    const searchParams = useSearchParams();
    const error = searchParams?.get('error');
    const installed = searchParams?.get('installed');

    if (!app) {
        return redirect(`/t/${team.slug}/apps`);
    }

    useEffect(() => {
        if (installed) {
            toast.success(
                `You have successfully installed the ${app.metadata.name} app! You can manage and configure it from this screen.`,
            );
        }
    }, [installed]);

    return (
        <>
            <Modal open={isRemoving} setOpen={setIsRemoving}>
                <div className="flex flex-col">
                    <div className="flex flex-col bg-white p-4 space-y-4">
                        <h2 className="text-xl font-medium">
                            Remove {app.metadata.name} App
                        </h2>
                        <p className="text-sm flex items-center">
                            By removing the {app.metadata.name} App you will{' '}
                            {app.metadata.removalText}.
                        </p>
                        <Separator />
                        <div className="flex flex-row items-center space-x-2 w-full justify-between">
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => setIsRemoving(false)}
                                disabled={uninstallMutation.isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                loading={uninstallMutation.isLoading}
                                onClick={() =>
                                    uninstallMutation.mutate({
                                        appId: params.appId,
                                        teamId: team.id,
                                    })
                                }
                                className="w-full"
                            >
                                Confirm
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>
            <Container
                backUrl={`/t/${team.slug}/apps`}
                title={`${app.metadata.name} App`}
                renderChild={() => (
                    <Button
                        size="sm"
                        variant="outline"
                        icon={<TrashIcon className="h-4 w-4" />}
                        onClick={() => setIsRemoving(true)}
                    ></Button>
                )}
            >
                {error && (
                    <div className="bg-red-50 p-4 border border-red-300 rounded-md">
                        <div className="space-y-2">
                            <h3 className="text-base text-red-500 font-medium">
                                App Error
                            </h3>
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    </div>
                )}
                {isLoading && <Skeleton className="w-full h-40" />}
                {!isLoading && data && renderAppChild(app.appId, data.appData)}
            </Container>
        </>
    );
};

export default SpecificAppPage;
