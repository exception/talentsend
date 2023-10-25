'use client';

import { buttonVariants } from '@/components/ui/button';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { useScroll } from '@/lib/hooks/use-scroll';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavItem {
    href: string;
    title: string;
}

interface Props {
    items: NavItem[];
}

const Navigation = ({ items }: Props) => {
    const path = usePathname();
    const scrolled = useScroll(80);
    const { isMobile, isDesktop } = useMediaQuery();

    return (
        <nav
            className={cn(
                'sticky top-20 flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 md:w-64 grow-0 h-auto transition-all py-2 lg:py-0 z-50 w-full',
                isMobile &&
                    scrolled &&
                    'bg-white border-b border-t border-neutral-200',
            )}
        >
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        buttonVariants({ variant: 'ghost' }),
                        path === item.href
                            ? 'bg-neutral-200'
                            : 'hover:bg-transparent',
                        'justify-between hover:bg-neutral-100 px-2 py-1 grow-0',
                    )}
                >
                    {item.title}
                    {path === item.href && isDesktop && (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </Link>
            ))}
        </nav>
    );
};

export default Navigation;
