'use client';

import SettingsContainer from '@/app/app/settings/settings-container';
import { useTeam } from '../layout';
import TeamAboutForm from './form';

const TeamAboutSettingsPage = () => {
    const { team } = useTeam();

    return (
        <SettingsContainer title={`About ${team.name}`}>
            <TeamAboutForm />
        </SettingsContainer>
    );
};

export default TeamAboutSettingsPage;
