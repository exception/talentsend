// app/layout.tsx
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

import Providers from './providers';
import { inter, calSans } from '@/lib/fonts';
import { cn, makeMetadata } from '@/lib/utils';

export const metadata = makeMetadata();

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn(inter.variable, calSans.variable)}>
                <NextTopLoader color="#F1BB2F" showSpinner={false} />
                <Providers>{children}</Providers>
            </body>
        </html>
    );
};

export default RootLayout;
