'use client';

import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/lib/providers/trpc-provider';
import { ChevronRight, Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import CreateOrganizationModal from './create-organization-modal';
import { Organization } from '@prisma/client';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Container from '@/components/ui/container';

const NoOrganization = ({ openModal }: { openModal: () => void }) => {
    return (
        <div className="flex items-center justify-center w-full flex-col">
            <h2 className="text-lg font-medium">
                You are not a member of any team.
            </h2>
            <Image
                src="/_static/svgs/working-vacation.svg"
                alt="No Incoming Calls"
                width={300}
                height={300}
                className="pointer-events-none"
            />
            <Button onClick={openModal} icon={<Plus className="h-4 w-4" />}>
                Create a team
            </Button>
        </div>
    );
};

const CardContent = ({
    isLoading,
    data,
    openModal,
}: {
    data: Organization[];
    isLoading: boolean;
    openModal: () => void;
}) => {
    if (isLoading) return <Skeleton className="w-full h-20" />;
    if (!isLoading && data.length === 0)
        return <NoOrganization openModal={openModal} />;

    return (
        <div className="grid grid-flow-row md:grid-flow-col md:grid-cols-3 gap-4">
            {data.map((team) => (
                <Link
                    key={`team-card-${team.id}`}
                    className="bg-white border border-neutral-200 rounded-md p-4 flex items-center justify-between group border-b-4 hover:border-b-2 border-b-neutral-300"
                    href={`/t/${team.slug}`}
                >
                    <div className="inline-flex items-center space-x-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage
                                src={
                                    team.imageUrl ??
                                    `https://api.dicebear.com/7.x/shapes/svg?seed=${team.name}&scale=80`
                                }
                                alt=""
                                className="object-cover"
                            />
                            <AvatarFallback>
                                <Skeleton className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium">{team.name}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-0 transition-all group-hover:opacity-100 text-neutral-400" />
                </Link>
            ))}
        </div>
    );
};

const OrganizationSelector = () => {
    const { status } = useSession();
    const [modalOpen, setModalOpen] = useState(false);
    const { data, isLoading } = trpc.users.organizations.useQuery(undefined, {
        enabled: status === 'authenticated',
    });

    return (
        <>
            <Modal open={modalOpen} setOpen={setModalOpen}>
                <CreateOrganizationModal setOpen={setModalOpen} />
            </Modal>
            <Container
                title="Your Teams"
                renderChild={() => (
                    <Button
                        onClick={() => setModalOpen(true)}
                        size="sm"
                        icon={<Plus className="h-4 w-4" />}
                    >
                        Create a team
                    </Button>
                )}
            >
                <CardContent
                    openModal={() => setModalOpen(true)}
                    data={data ?? []}
                    isLoading={isLoading}
                />
            </Container>
        </>
    );
};

export default OrganizationSelector;
