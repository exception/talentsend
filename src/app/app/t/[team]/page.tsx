'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/lib/providers/trpc-provider';
import { ChevronRight, Pencil, Plus, SendHorizonal } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Offer, Organization } from '@prisma/client';
import { useTeam } from './layout';
import Link from 'next/link';
import { OfferSchema } from '@/lib/offer';
import { format } from 'date-fns';

const NoOrganization = () => {
    const { team } = useTeam();
    return (
        <div className="flex items-center justify-center w-full flex-col">
            <h2 className="text-base lg:text-lg font-medium">
                No offers have been sent so far.
            </h2>
            <Image
                src="/_static/svgs/working-vacation.svg"
                alt="No Incoming Calls"
                width={300}
                height={300}
                className="pointer-events-none"
            />
            <Link
                href={`/t/${team.slug}/offer/new`}
                className={buttonVariants({ variant: 'default', size: 'sm' })}
            >
                <SendHorizonal className="h-4 w-4" />
                Send an offer
            </Link>
        </div>
    );
};

const CardContent = ({
    isLoading,
    data,
    team,
}: {
    data: Offer[];
    isLoading: boolean;
    team: Organization;
}) => {
    if (isLoading) return <Skeleton className="w-full h-20" />;
    if (!isLoading && data.length === 0) return <NoOrganization />;

    return (
        <table className="min-w-full divide-y divide-gray-300">
            <thead>
                <tr>
                    <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                        Name
                    </th>
                    <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                        Email
                    </th>
                    <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                        Title
                    </th>
                    <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                        Status
                    </th>
                    <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    >
                        Created At
                    </th>
                    <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                    >
                        <span className="sr-only">Edit</span>
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 ">
                {data.map((offer) => {
                    const _offer = OfferSchema.pick({
                        role: true,
                        startDate: true,
                    })
                        .partial()
                        .parse(offer?.body ?? {});

                    return (
                        <tr key={offer.id}>
                            <td className="whitespace-nowrap py-5 px-3 text-sm sm:pl-0">
                                <p className="font-medium text-gray-900">
                                    {offer.targetName}
                                </p>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                <p className="text-gray-500">
                                    {offer.targetEmail}
                                </p>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                <p className="text-gray-900">{_offer.role}</p>
                            </td>
                            <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                                <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                    {offer.status}
                                </span>
                            </td>
                            <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                <p className="font-medium text-gray-900">
                                    {format(offer.createdAt, 'dd MMM, yyyy')}
                                </p>
                            </td>
                            <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                <Link
                                    href={`/t/${team.slug}/offer/${offer.id}`}
                                    className={buttonVariants({
                                        variant: 'outline',
                                    })}
                                >
                                    <Pencil className="h-4 w-4" />
                                </Link>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
        // <div className="flex flex-col">
        //     {data.map((offer) => (
        // <Link
        //     href={`/t/${team.slug}/offer/${offer.id}`}
        //     className="p-4 bg-white rounded-md border border-neutral-200 flex items-center justify-between group"
        // >
        //     <div className="flex flex-col">
        //         <p className="text-base font-medium">
        //             Offer for {offer.targetName}
        //         </p>
        //         <p className="text-sm text-neutral-400">
        //             {offer.targetEmail}
        //         </p>
        //     </div>
        //     <ChevronRight className="h-6 w-6 text-neutral-400 opacity-0 group-hover:opacity-100 transition-all" />
        // </Link>
        //     ))}
        // </div>
    );
};

const TeamPage = () => {
    const { team } = useTeam();
    const { data, isLoading } = trpc.organization.offers.useQuery({
        slug: team.slug,
    });

    return (
        <>
            <div className="flex flex-col px-2.5 lg:px-20 mt-5">
                <div className="w-full rounded-t-md border border-neutral-300 bg-white p-4 flex justify-between items-center sticky top-20">
                    <h2 className="font-semibold text-base lg:text-lg">
                        {team.name}&apos;s Offers
                    </h2>
                    <Link
                        href={`/t/${team.slug}/offer/new`}
                        className={buttonVariants({
                            variant: 'default',
                            size: 'sm',
                        })}
                    >
                        <Plus className="h-4 w-4" />
                        Create Offer
                    </Link>
                </div>
                <div className="w-full rounded-b-md border border-neutral-300 bg-neutral-50 border-t-0 border-dashed p-4 overflow-x-auto scrollbar-hide">
                    <CardContent
                        data={data ?? []}
                        isLoading={isLoading}
                        team={team}
                    />
                </div>
                {/* <Button className="self-end mt-2" variant="outline">
                    1
                </Button> */}
            </div>
        </>
    );
};

export default TeamPage;
