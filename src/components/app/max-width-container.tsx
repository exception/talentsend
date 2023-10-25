import { cn } from '@/lib/utils';

interface Props {
    className?: string;
}

const MaxWidthContainer = ({
    className,
    children,
}: React.PropsWithChildren<Props>) => {
    return (
        <div
            className={cn(
                'mx-auto w-full max-w-[1150px] px-2.5 lg:px-20 h-auto',
                className,
            )}
        >
            {children}
        </div>
    );
};

export default MaxWidthContainer;
