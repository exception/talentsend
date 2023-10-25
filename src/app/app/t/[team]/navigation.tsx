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
): { href: string; title: string; matches?: string[] }[] => {
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
                href: `/t/${team.slug}/settings`,
                title: 'Settings',
                matches: [
                    `/t/${team.slug}/settings/about`,
                    `/t/${team.slug}/settings/billing`,
                    `/t/${team.slug}/settings/brand`,
                    `/t/${team.slug}/settings/danger`,
                    `/t/${team.slug}/settings/members`,
                    `/t/${team.slug}/settings/benefits`,
                    `/t/${team.slug}/settings/equity`,
                ],
            },
        ];
    }

    // if (team.slug === 'commsor') {
    //     return [
    //         ...base,
    //         {
    //             href: `/t/${team.slug}/meme`,
    //             title: 'Meme',
    //         },
    //     ];
    // }

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
                            item.matches?.includes(pathname ?? '')) &&
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
