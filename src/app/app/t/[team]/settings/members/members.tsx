'use client';

import { OrgMember, User } from '@prisma/client';
import { useTeam } from '../../layout';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MemberRow = ({ member }: { member: OrgMember & { user: User } }) => {
    const { data: session } = useSession();
    const isSelf = session?.user.id === member.userId;

    return (
        <div
            key={`member-id-${member.id}`}
            className="bg-white rounded-md border border-neutral-200 p-2 flex items-center justify-between"
        >
            <div className="inline-flex items-center space-x-2">
                <Avatar className="h-12 w-12">
                    <AvatarImage
                        src={
                            member.user.image ??
                            `https://api.dicebear.com/7.x/shapes/svg?seed=${member.user.email}&scale=80`
                        }
                        alt=""
                        className="object-cover"
                    />
                    <AvatarFallback>
                        <Skeleton className="h-5 w-5" />
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="text-sm font-medium">{member.user.name}</p>
                    <p className="text-xs font-normal text-neutral-500">
                        {member.user.email}
                    </p>
                </div>
            </div>
            {!isSelf && <MoreVertical className="h-4 w-4 text-neutral-400" />}
            {isSelf && <Badge variant="outline">You!</Badge>}
        </div>
    );
};

const TeamMembers = () => {
    const { team } = useTeam();

    return (
        <div className="fle flex-col space-y-2">
            {team.members.map((member) => (
                <MemberRow key={`member-id-${member.id}`} member={member} />
            ))}
        </div>
    );
};

export default TeamMembers;
