'use client';

import { type Dispatch, type SetStateAction } from 'react';
import { Drawer } from 'vaul';
import { Dialog, DialogContent } from './dialog';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { ChevronDown } from 'lucide-react';

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

const Modal = ({ open, setOpen, children }: React.PropsWithChildren<Props>) => {
    const { isMobile } = useMediaQuery();

    if (isMobile) {
        return (
            <Drawer.Root open={open} onOpenChange={setOpen}>
                <Drawer.Overlay className="fixed inset-0 z-40 bg-neutral-200 bg-opacity-10 backdrop-blur" />
                <Drawer.Portal>
                    <Drawer.Content className="fixed bottom-0 right-0 left-0 z-50 bg-white border-t border-t-neutral-200 py-3 px-5">
                        <div className="sticky top-0 z-50 flex w-full items-center justify-center">
                            <ChevronDown className="my-2 text-neutral-300 h-5 w-5" />
                        </div>
                        {children}
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        );
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>{children}</DialogContent>
        </Dialog>
    );
};

export default Modal;
