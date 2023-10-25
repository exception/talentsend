'use client';

import { signOut, useSession } from 'next-auth/react';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, Settings } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const UserDropdown = () => {
    const { data: session, status } = useSession();

    if (status === 'unauthenticated') {
        return <></>;
    }

    if (status === 'loading') {
        return <Skeleton className="h-8 w-8 rounded-full" />;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-8 w-8 rounded-full relative"
                >
                    <Avatar className="h-10 w-10">
                        <AvatarImage
                            src={
                                session?.user?.image ??
                                `https://api.dicebear.com/7.x/lorelei/svg?seed=${session?.user.name}&scale=80&backgroundColor=ec4899`
                            }
                            alt=""
                            className="object-cover"
                        />
                        <AvatarFallback>
                            <Skeleton className="h-8 w-8" />
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-2 w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {session?.user?.name}
                        </p>
                        <p className="text-muted-foreground text-xs leading-none">
                            {session?.user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <Link href={`/settings`}>
                    <DropdownMenuItem className="flex w-full hover:cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() =>
                        signOut({
                            redirect: true,
                        })
                    }
                    className="hover:cursor-pointer"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserDropdown;
