'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/lib/providers/trpc-provider';
import { AppRouter } from '@/server/root';
import { inferProcedureOutput } from '@trpc/server';
import { ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ElementType<T extends readonly any[]> = T extends readonly (infer U)[]
    ? U
    : never;

type InviteType = NonNullable<
    ElementType<
        inferProcedureOutput<
            AppRouter['_def']['procedures']['users']['invites']
        >
    >
>;

const InviteCard = ({ invite }: { invite: InviteType }) => {
    const utils = trpc.useUtils();
    const router = useRouter();
    const mutateInvite = trpc.users.updateInvite.useMutation({
        async onSuccess({ status }) {
            if (status === 'dismissed') {
                await utils.users.invites.refetch();
            } else {
                await utils.users.organizations.invalidate();
                router.push('/');
            }
        },
    });

    return (
        <div
            key={invite.id}
            className="bg-white border border-neutral-200 rounded-md p-4 hover:shadow-sm flex flex-col lg:col-span-1 row-span-2"
        >
            <div className="flex items-center space-x-2">
                <Avatar className="h-10 w-10">
                    <AvatarImage
                        src={
                            invite.organization.imageUrl ??
                            `https://api.dicebear.com/7.x/shapes/svg?seed=${invite.organization.name}&scale=80`
                        }
                        alt=""
                        className="object-cover"
                    />
                    <AvatarFallback>
                        <Skeleton className="h-5 w-5" />
                    </AvatarFallback>
                </Avatar>
                <p className="text-base font-medium">
                    {invite.organization.name}
                </p>
            </div>
            <Separator className="my-3" />
            <div className="flex lg:flex-row lg:space-x-2">
                <Button
                    disabled={mutateInvite.isLoading}
                    loading={mutateInvite.isLoading}
                    onClick={() =>
                        mutateInvite.mutate({
                            inviteId: invite.id,
                            state: 'reject',
                        })
                    }
                    size="sm"
                    variant="secondary"
                    className="w-full"
                >
                    Dismiss Invite
                </Button>
                <Button
                    onClick={() =>
                        mutateInvite.mutate({
                            inviteId: invite.id,
                            state: 'accept',
                        })
                    }
                    disabled={mutateInvite.isLoading}
                    loading={mutateInvite.isLoading}
                    size="sm"
                    className="w-full"
                >
                    Accept Invite
                </Button>
            </div>
        </div>
    );
};

const InvitesPage = () => {
    const { status } = useSession();
    const { data, isLoading } = trpc.users.invites.useQuery(undefined, {
        enabled: status === 'authenticated',
    });

    if (isLoading) return <Skeleton className="h-20 w-full mt-4" />;

    if (!data || data?.length <= 0) {
        return (
            <div className="bg-white rounded-md p-4 border border-neutral-200 mt-4 flex flex-col space-y-2 lg:space-y-0 lg:flex-row items-center justify-between">
                <p className="text-base font-medium">
                    You have no pending invites.
                </p>
                <Link
                    href="/"
                    className={buttonVariants({
                        variant: 'default',
                        className: 'w-full lg:w-auto',
                    })}
                >
                    <ArrowLeft className="inline-flex h-4 w-4 mr-1" />
                    Go Back
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col mt-4">
            <h1 className="text-xl font-medium">Your Pending Invites</h1>
            <Separator className="my-3" />
            <div className="grid grid-flow-row md:grid-flow-col md:grid-cols-2 gap-4">
                {data.map((invite) => (
                    <InviteCard invite={invite} key={invite.id} />
                ))}
            </div>
        </div>
    );
};

export default InvitesPage;
