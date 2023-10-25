import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface Props {
    title: string;
    className?: string;
    renderChild?: () => ReactNode;
}

const SettingsContainer = ({
    title,
    children,
    className,
    renderChild,
}: React.PropsWithChildren<Props>) => {
    return (
        <div className={cn('flex flex-col w-full', className)}>
            <div className="w-full rounded-t-md border border-neutral-300 bg-white p-4 flex justify-between items-center">
                <h2 className="font-semibold text-base lg:text-lg">{title}</h2>
                {renderChild && renderChild()}
            </div>
            <div className="w-full rounded-b-md border border-neutral-300 bg-neutral-50 border-t-0 border-dashed p-4">
                {children}
            </div>
        </div>
    );
};

export default SettingsContainer;
