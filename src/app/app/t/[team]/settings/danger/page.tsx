'use client';

import Container from '@/components/ui/container';
import { useSession } from 'next-auth/react';
import { useTeam } from '../../layout';
import { redirect } from 'next/navigation';

const DangerPage = () => {
    const { data: session } = useSession();
    const { team } = useTeam();

    const isOwner =
        team.members.find((member) => member.userId === session?.user.id)
            ?.role === 'OWNER';

    if (team && !isOwner) {
        return redirect(`/t/${team.slug}/settings`);
    }

    return <Container title="Danger Zone"></Container>;
};

export default DangerPage;
