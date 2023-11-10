'use client';

import { TooltipProvider } from '@/components/ui/tooltip';
import { TrpcProvider } from '@/lib/providers/trpc-provider';
import { SessionProvider } from 'next-auth/react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';

const Providers = ({ children }: React.PropsWithChildren<unknown>) => {
    return (
        <SessionProvider>
            <TrpcProvider>
                <TooltipProvider>{children}</TooltipProvider>
            </TrpcProvider>
            <Toaster
                richColors
                loadingIcon={<Loader2 className="h-4 w-4 animate-spin" />}
            />
            <Analytics />
        </SessionProvider>
    );
};

export default Providers;
