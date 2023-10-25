'use client';

import { buttonVariants } from '@/components/ui/button';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import { useScroll } from '@/lib/hooks/use-scroll';
import { cn } from '@/lib/utils';
import { Organization, User } from '@prisma/client';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { TeamType, useTeam } from '../layout';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const helper = (
    team: TeamType,
    viewer?: User,
): { href: string; title: string; className?: string }[] => {
    const role = team.members.find((member) => member.userId === viewer?.id)
        ?.role;

    const base = [
        {
            href: `/t/${team.slug}/settings`,
            title: 'About',
        },
        {
            href: `/t/${team.slug}/settings/brand`,
            title: 'Branding',
        },
        {
            href: `/t/${team.slug}/settings/billing`,
            title: 'Billing',
        },
        {
            href: `/t/${team.slug}/settings/benefits`,
            title: 'Benefits',
        },
        {
            href: `/t/${team.slug}/settings/equity`,
            title: 'Equity',
        },
    ];

    if (role != 'MEMBER') {
        return [
            ...base,
            {
                href: `/t/${team.slug}/settings/members`,
                title: 'Members',
            },
        ];
    }

    // if (isOwner) {
    //     return [
    //         ...base,
    //         {
    //             href: `/t/${team.slug}/settings/danger`,
    //             title: 'Danger Zone',
    //             className: 'text-red-500 !shrink-0',
    //         },
    //     ];
    // }

    return base;
};

const Navigation = () => {
    const { team } = useTeam();
    const { data: session } = useSession();
    const pathname = usePathname();

    const tabs = useMemo(() => {
        return helper(team, session?.user);
    }, [team, session]);

    const scrolled = useScroll(80);
    const { isMobile, isDesktop } = useMediaQuery();

    return (
        <nav
            className={cn(
                'sticky top-20 overflow-x-auto scrollbar-hide  flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1 lg:w-64 grow-0 h-auto p-2 bg-white border-b border-neutral-200 lg:bg-transparent lg:border-none lg:py-0 z-10 w-full',
                isMobile &&
                    scrolled &&
                    'bg-white border-b border-t border-neutral-200',
            )}
        >
            {tabs.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        buttonVariants({ variant: 'ghost' }),
                        pathname === item.href
                            ? 'bg-neutral-100 lg:bg-neutral-200'
                            : 'hover:bg-transparent',
                        'justify-between hover:bg-neutral-100 px-2 py-1 grow-0',
                        item.className,
                    )}
                >
                    {item.title}
                    {pathname === item.href && isDesktop && (
                        <ChevronRight className="h-4 w-4" />
                    )}
                </Link>
            ))}
        </nav>
    );
};

export default Navigation;
