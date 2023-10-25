'use client';

import { buttonVariants } from '@/components/ui/button';
import { trpc } from '@/lib/providers/trpc-provider';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const PendingInvites = () => {
    const { status } = useSession();
    const { data, isLoading } = trpc.users.invites.useQuery(undefined, {
        enabled: status === 'authenticated',
    });

    if (isLoading || !data || data.length <= 0) return <></>;

    return (
        <div className="bg-white rounded-md p-4 border border-neutral-200 flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold">
                You have {data?.length} pending Team invites.
            </h3>
            <Link
                className={buttonVariants({ variant: 'default' })}
                href="/invites"
            >
                View Invites
            </Link>
        </div>
    );
};

export default PendingInvites;
