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
import { Loader2, LogOut, MessageCircle, Settings } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useEffect, useState } from 'react';
import { Crisp } from 'crisp-sdk-web';
import va from '@vercel/analytics';

const UserDropdown = () => {
    const { data: session, status } = useSession();
    const [openingSupport, setOpeningSupport] = useState(false);

    useEffect(() => {
        Crisp.configure('348b8f6b-7a8b-457f-95c7-c579d3f59a32', {
            autoload: false,
        });
    }, []);

    useEffect(() => {
        if (session?.user?.email) {
            Crisp.user.setEmail(session.user.email);
            Crisp.user.setNickname(session.user.name || session.user.email);
        }
    }, [session]);

    useEffect(() => {
        Crisp.chat.onChatOpened(() => {
            va.track('Open support chat');
            setOpeningSupport(false);
        });
        Crisp.chat.onChatClosed(() => {
            Crisp.chat.hide();
        });
    }, []);

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
                <DropdownMenuItem
                    onClick={() => {
                        setOpeningSupport(true);
                        Crisp.chat.open();
                        Crisp.chat.show();
                    }}
                    className="hover:cursor-pointer"
                >
                    {openingSupport ? (
                        <Loader2 className="h-4 w-4 mr-2" />
                    ) : (
                        <MessageCircle className="mr-2 h-4 w-4" />
                    )}
                    Chat with Support
                </DropdownMenuItem>
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
