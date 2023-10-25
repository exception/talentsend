import TalentSendLogoFull from '@/components/ui/icons/talentsend-logo-full';
import Link from 'next/link';

export const runtime = 'edge';

const AuthLayout = ({ children }: React.PropsWithChildren<unknown>) => {
    return (
        <div className="flex flex-col min-h-screen justify-center bg-neutral-50 py-12">
            <Link
                href="/"
                className="mb-auto mx-auto active:scale-95 hover:cursor-pointer transition-all"
            >
                <TalentSendLogoFull />
            </Link>
            {children}
        </div>
    );
};

export default AuthLayout;
