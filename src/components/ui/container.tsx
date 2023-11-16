import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
    title: string;
    className?: string;
    renderChild?: () => ReactNode;
    backUrl?: string;
}

const Container = ({
    title,
    children,
    className,
    renderChild,
    backUrl,
}: React.PropsWithChildren<Props>) => {
    return (
        <div className={cn('flex flex-col w-full', className)}>
            <div className="w-full rounded-t-md border border-neutral-300 bg-gradient-to-b from-neutral-100 via-neutral-50 to-white p-4 flex justify-between items-center">
                <div className="flex flex-row space-x-1 items-center">
                    {backUrl && (
                        <Link
                            href={backUrl}
                            className={buttonVariants({ variant: 'ghost' })}
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    )}
                    <h2 className="font-semibold text-base lg:text-lg">
                        {title}
                    </h2>
                </div>
                {renderChild && renderChild()}
            </div>
            <div className="w-full rounded-b-md border border-neutral-300 bg-neutral-50 border-t-0 border-dashed p-4">
                {children}
            </div>
        </div>
    );
};

export default Container;
