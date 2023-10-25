'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Dispatch, ReactNode, SetStateAction } from 'react';
import { Drawer } from 'vaul';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { cn } from '@/lib/utils';

interface ComponentProps
    extends React.PropsWithChildren<
        React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
    > {
    render: () => ReactNode;
}

const Popover = React.forwardRef<
    React.ElementRef<typeof PopoverPrimitive.Content>,
    ComponentProps
>(
    (
        {
            className,
            align = 'center',
            sideOffset = 4,
            children,
            render,
            ...props
        },
        ref,
    ) => {
        const { isMobile } = useMediaQuery();
        const [openPopover, setOpenPopover] = React.useState(false);

        if (isMobile) {
            return (
                <Drawer.Root open={openPopover} onOpenChange={setOpenPopover}>
                    <div
                        className="sm:hidden"
                        onClick={() => setOpenPopover(true)}
                    >
                        {children}
                    </div>
                    <Drawer.Overlay className="fixed inset-0 z-40 bg-gray-100 bg-opacity-10 backdrop-blur" />
                    <Drawer.Portal>
                        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 mt-24 rounded-t-[10px] border-t border-gray-200 bg-white">
                            <div className="sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] bg-inherit">
                                <div className="my-3 h-1 w-12 rounded-full bg-gray-300" />
                            </div>
                            <div className="flex min-h-[150px] w-full items-center justify-center overflow-hidden bg-white pb-8 align-middle shadow-xl">
                                {render()}
                            </div>
                        </Drawer.Content>
                        <Drawer.Overlay />
                    </Drawer.Portal>
                </Drawer.Root>
            );
        }

        return (
            <PopoverPrimitive.Root
                open={openPopover}
                onOpenChange={setOpenPopover}
            >
                <PopoverPrimitive.Trigger className="sm:inline-flex" asChild>
                    {children}
                </PopoverPrimitive.Trigger>
                <PopoverPrimitive.Portal>
                    <PopoverPrimitive.Content
                        ref={ref}
                        align={align}
                        sideOffset={sideOffset}
                        className={cn(
                            'z-50 w-auto rounded-md border border-neutral-200 bg-white p-4 text-neutral-950 shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
                            className,
                        )}
                        {...props}
                    >
                        {render()}
                    </PopoverPrimitive.Content>
                </PopoverPrimitive.Portal>
            </PopoverPrimitive.Root>
        );
    },
);

export default Popover;
