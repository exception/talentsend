'use client';

import SettingsContainer from '@/app/app/settings/settings-container';
import { useTeam } from '../../layout';
import TeamMembers from './members';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Modal from '@/components/ui/modal';
import InviteMemberForm from './invite-member-form';

const TeamMembersPage = () => {
    const { team } = useTeam();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Modal open={isOpen} setOpen={setIsOpen}>
                <InviteMemberForm
                    orgId={team.id}
                    close={() => setIsOpen(false)}
                />
            </Modal>
            <SettingsContainer
                title="Members"
                renderChild={() => (
                    <Button onClick={() => setIsOpen(true)}>
                        Invite Member
                    </Button>
                )}
            >
                <TeamMembers />
            </SettingsContainer>
        </>
    );
};

export default TeamMembersPage;
