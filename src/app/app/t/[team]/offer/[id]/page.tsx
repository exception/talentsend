'use client';

import { redirect } from 'next/navigation';
import { trpc } from '@/lib/providers/trpc-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useTeam } from '../../layout';
import SettingsContainer from '@/app/app/settings/settings-container';
import MaxWidthContainer from '@/components/app/max-width-container';
import { Button, buttonVariants } from '@/components/ui/button';
import { Pencil, SendHorizonal, SparkleIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import PublicOfferView from '@/components/views/public-offer';
import { OfferStatus } from '@prisma/client';

interface OfferPageProps {
    params: {
        id: string;
    };
}

const canCancel = (status: OfferStatus) => {
    return status === 'PUBLISHED' || status === 'ACCEPTED';
};

const canPublish = (status: OfferStatus) => {
    return status === 'CANCELLED' || status === 'DRAFT';
};

const OfferPage = ({ params }: OfferPageProps) => {
    const { team } = useTeam();
    const { data, isLoading, refetch } = trpc.offers.get.useQuery({
        offerId: params.id,
        orgId: team.id,
    });

    const publishMutation = trpc.offers.changeStatus.useMutation({
        async onSuccess() {
            await refetch();
        },
    });

    if (isLoading) {
        return <Skeleton className="w-full h-40" />;
    }

    if (!data) {
        return redirect(`/t/${team.slug}`);
    }

    return (
        <MaxWidthContainer className="py-5">
            <SettingsContainer
                title={`Offer for ${data.targetName}`}
                renderChild={() => (
                    <div className="flex flex-row space-x-2">
                        <Link
                            className={buttonVariants({ variant: 'outline' })}
                            href={`/t/${team.slug}/offer/${data.id}/edit`}
                        >
                            <Pencil className="h-4 w-4" />
                        </Link>
                        {data.status === 'PENDING' && (
                            <Link
                                className={buttonVariants({
                                    variant: 'default',
                                })}
                                href={`/api/stripe/publish?orgId=${team.id}&offerId=${data.id}`}
                            >
                                <SparkleIcon className="h-4 w-4" />
                                <p>Pay & Draft</p>
                            </Link>
                        )}
                        {canPublish(data.status) && (
                            <Button
                                onClick={() =>
                                    publishMutation.mutate({
                                        offerId: data.id,
                                        status: 'PUBLISHED',
                                    })
                                }
                                loading={publishMutation.isLoading}
                                icon={<SendHorizonal className="h-4 w-4" />}
                            >
                                Publish
                            </Button>
                        )}
                        {canCancel(data.status) && (
                            <Button
                                onClick={() =>
                                    publishMutation.mutate({
                                        offerId: data.id,
                                        status: 'CANCELLED',
                                    })
                                }
                                loading={publishMutation.isLoading}
                                icon={<XIcon className="h-4 w-4" />}
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                )}
            >
                <PublicOfferView offer={data} showAcceptOffer={false} />
            </SettingsContainer>
        </MaxWidthContainer>
    );
};

export default OfferPage;
