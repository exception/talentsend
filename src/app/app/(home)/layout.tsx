'use client';

import MaxWidthContainer from '@/components/app/max-width-container';
import AppLayout from '@/components/app/app-layout';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';

const HomeLayout = ({ children }: React.PropsWithChildren<unknown>) => {
    const { status } = useSession();

    return (
        <AppLayout>
            <MaxWidthContainer>
                {status === 'loading' ? (
                    <Skeleton className="mt-10 h-40 w-full rounded-md" />
                ) : (
                    children
                )}
            </MaxWidthContainer>
        </AppLayout>
    );
};

export default HomeLayout;
