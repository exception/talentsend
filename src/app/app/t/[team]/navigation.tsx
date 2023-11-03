'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { TeamType, useTeam } from './layout';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';

const helper = (
    team: TeamType,
    user?: User,
): { href: string; title: string; matches?: (str: string) => boolean }[] => {
    const base = [
        {
            href: `/t/${team.slug}`,
            title: 'Offers',
        },
    ];

    const isAdmin =
        team.members.find((member) => member.userId === user?.id)?.role !==
        'MEMBER';

    if (isAdmin) {
        return [
            ...base,
            {
                href: `/t/${team.slug}/apps`,
                title: 'Apps',
                matches: (str) => {
                    return str.startsWith(`/t/${team.slug}/apps/`);
                },
            },
            {
                href: `/t/${team.slug}/settings`,
                title: 'Settings',
                matches: (str) => {
                    return str.startsWith(`/t/${team.slug}/settings/`);
                },
            },
        ];
    }

    return base;
};

const TeamNavigationRow = () => {
    const { team } = useTeam();
    const { data: session } = useSession();
    const pathname = usePathname();

    const tabs = useMemo(() => {
        return helper(team, session?.user);
    }, [team, session]);

    return (
        <>
            {tabs.map((item) => (
                <Link
                    key={`item-${item.href}`}
                    className={cn(
                        buttonVariants({ variant: 'ghost' }),
                        (pathname === item.href ||
                            (item.matches && item.matches(pathname ?? ''))) &&
                            'bg-neutral-100',
                    )}
                    href={item.href}
                >
                    {item.title}
                </Link>
            ))}
        </>
    );
};

export default TeamNavigationRow;
