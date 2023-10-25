'use client';

import { redirect } from 'next/navigation';
import { useTeam } from '../../../layout';
import { trpc } from '@/lib/providers/trpc-provider';
import { Skeleton } from '@/components/ui/skeleton';
import OfferView from '../../view';

interface EditOfferProps {
    params: {
        id: string;
    };
}

const EditPackagePage = ({ params }: EditOfferProps) => {
    const { team } = useTeam();
    const { data, isLoading } = trpc.offers.get.useQuery({
        offerId: params.id,
        orgId: team.id,
    });

    if (isLoading) {
        return <Skeleton className="w-full h-40" />;
    }

    if (!data) {
        return redirect(`/t/${team.slug}`);
    }

    return <OfferView offer={data} />;
};

export default EditPackagePage;
