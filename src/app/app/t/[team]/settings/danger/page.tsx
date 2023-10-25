'use client';

import SettingsContainer from '@/app/app/settings/settings-container';
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

    return <SettingsContainer title="Danger Zone"></SettingsContainer>;
};

export default DangerPage;
