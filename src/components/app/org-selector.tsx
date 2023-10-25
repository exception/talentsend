'use client';

import { trpc } from '@/lib/providers/trpc-provider';
import { useSession } from 'next-auth/react';
import Popover from '../ui/popover';
import { Organization } from '@prisma/client';
import { ChevronRight, ChevronsUpDown, Slash } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarImage } from '../ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { Skeleton } from '../ui/skeleton';
import { Separator } from '../ui/separator';

const OrgSelector = () => {
    const { status } = useSession();
    const { data, isLoading } = trpc.users.organizations.useQuery(undefined, {
        enabled: status === 'authenticated',
    });
    const pathName = usePathname();
    const orgName = pathName?.replace('/t/', '').split('/')[0];
    const selected = data?.find((org) => org.slug === orgName);

    if (isLoading || data?.length === 0) return <></>;

    return (
        <>
            <Slash className="h-4 w-4 text-neutral-300" />
            <Popover side="bottom" render={() => <OrgList orgs={data ?? []} />}>
                <div className="rounded-md cursor-pointer hover:bg-neutral-100 px-2 py-4 justify-between flex items-center">
                    {selected && (
                        <div className="flex items-center space-x-2">
                            <Avatar className="h-5 w-5">
                                <AvatarImage
                                    src={
                                        selected.imageUrl ??
                                        `https://api.dicebear.com/7.x/shapes/svg?seed=${selected.name}&scale=80`
                                    }
                                    alt=""
                                    className="object-cover"
                                />
                                <AvatarFallback>
                                    <Skeleton className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                            <p className="text-sm font-medium text-neutral-700">
                                {selected.name}
                            </p>
                        </div>
                    )}
                    {!selected && (
                        <p className="text-sm font-normal text-neutral-500">
                            Select a team
                        </p>
                    )}
                    <ChevronsUpDown className="ml-2 h-3 w-3 text-neutral-400" />
                </div>
            </Popover>
        </>
    );
};

const OrgList = ({ orgs }: { orgs: Organization[] }) => {
    return (
        <div className="flex flex-col w-full p-4 lg:p-0 lg:min-w-[200px]">
            <p className="text-xs uppercase text-neutral-400 font-medium">
                Your Teams
            </p>
            <Separator className="my-2" />
            {orgs.map((org) => (
                <Link
                    className={buttonVariants({
                        variant: 'ghost',
                        className:
                            'items-center !justify-start !py-6 !px-2 lg:!py-1 lg:!px-2 group',
                    })}
                    href={`/t/${org.slug}`}
                    key={`org-${org.id}`}
                >
                    <div className="flex flex-row justify-between w-full items-center">
                        <div className="flex flex-row items-center space-x-2">
                            <Avatar className="h-10 w-10 lg:h-5 lg:w-5">
                                <AvatarImage
                                    src={
                                        org.imageUrl ??
                                        `https://api.dicebear.com/7.x/shapes/svg?seed=${org.name}&scale=80`
                                    }
                                    alt=""
                                    className="object-cover"
                                />
                                <AvatarFallback>
                                    <Skeleton className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                            <p className="text-base lg:text-sm font-medium text-neutral-700">
                                {org.name}
                            </p>
                        </div>
                        <ChevronRight className="opacity-0 group-hover:opacity-100 transition-all h-4 w-4 text-neutral-300" />
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default OrgSelector;
