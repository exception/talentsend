'use client';

import Container from '@/components/ui/container';
import { useTeam } from '../../layout';
import TeamMembers from './members';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Modal from '@/components/ui/modal';
import InviteMemberForm from './invite-member-form';
import { UserPlus } from 'lucide-react';

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
            <Container
                title="Members"
                renderChild={() => (
                    <Button
                        icon={<UserPlus className="h-4 w-4" />}
                        onClick={() => setIsOpen(true)}
                    >
                        Invite Member
                    </Button>
                )}
            >
                <TeamMembers />
            </Container>
        </>
    );
};

export default TeamMembersPage;
