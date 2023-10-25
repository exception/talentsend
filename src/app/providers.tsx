'use client';

import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TrpcProvider } from '@/lib/providers/trpc-provider';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';

const Providers = ({ children }: React.PropsWithChildren<unknown>) => {
    return (
        <SessionProvider>
            <TrpcProvider>
                <TooltipProvider>{children}</TooltipProvider>
            </TrpcProvider>
            <Toaster />
            <Analytics />
        </SessionProvider>
    );
};

export default Providers;
