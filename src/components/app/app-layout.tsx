import { cn } from '@/lib/utils';
import Link from 'next/link';
import UserDropdown from './user-dropdown';
import TalentSendLogoFull from '../ui/icons/talentsend-logo-full';
import OrgSelector from './org-selector';
import MaxWidthContainer from './max-width-container';

interface Props {
    className?: string;
}

const AppLayout = ({ className, children }: React.PropsWithChildren<Props>) => {
    return (
        <div className={cn('min-h-screen w-full bg-neutral-50', className)}>
            <div className="sticky left-0 right-0 top-0 z-20 border-b border-neutral-200 bg-white">
                <MaxWidthContainer>
                    <div className="flex justify-between items-center h-16">
                        <div className="flex flex-row space-x-2 items-center">
                            <Link href={'/'}>
                                <TalentSendLogoFull className="active:scale-95 transition-all" />
                            </Link>
                            <OrgSelector />
                        </div>
                        <UserDropdown />
                    </div>
                </MaxWidthContainer>
            </div>
            {children}
        </div>
    );
};

export default AppLayout;
