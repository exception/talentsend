'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/lib/providers/trpc-provider';
import {
    Check,
    Clipboard,
    Cog,
    ExternalLink,
    Filter,
    ListRestart,
    Plus,
    SendHorizonal,
} from 'lucide-react';
import Image from 'next/image';
import { Offer, OfferStatus, Organization } from '@prisma/client';
import { useTeam } from './layout';
import Link from 'next/link';
import { OfferSchema } from '@/lib/offer';
import { format, isPast } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Dispatch, SetStateAction, useState } from 'react';
import { inferProcedureInput, inferProcedureOutput } from '@trpc/server';
import { AppRouter } from '@/server/root';
import Container from '../../../../components/ui/container';
import MaxWidthContainer from '@/components/app/max-width-container';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { title } from 'radash';
import { cn } from '@/lib/utils';
import { APP_URL } from '@/lib/constants';
import { toast } from 'sonner';
import OnboardingChecks from './onboarding-steps';

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
                Create an offer
            </Link>
        </div>
    );
};

const canEdit = (status: OfferStatus) => {
    return status === 'DRAFT' || status === 'CANCELLED';
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

                    const expired = offer.expiresAt && isPast(offer.expiresAt);

                    return (
                        <tr key={offer.id}>
                            <td className="whitespace-nowrap py-5 px-3 text-sm sm:pl-0">
                                <p className="font-medium text-gray-900">
                                    {offer.targetFirstName}{' '}
                                    {offer.targetLastName}
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
                                <Badge>
                                    {expired ? 'EXPIRED' : offer.status}
                                </Badge>
                            </td>
                            <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                                <p className="font-medium text-gray-900">
                                    {format(offer.createdAt, 'dd MMM, yyyy')}
                                </p>
                            </td>
                            <td className="relative whitespace-nowrap flex space-x-2 py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                <Button
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(
                                            `${APP_URL}/offer/${offer.id}`,
                                        );
                                        toast.info('Copied link to clipboard');
                                    }}
                                    variant="outline"
                                    icon={<Clipboard className="h-4 w-4" />}
                                ></Button>
                                <Link
                                    href={`/t/${team.slug}/offer/${offer.id}`}
                                    className={buttonVariants({
                                        variant: 'outline',
                                    })}
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </Link>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

type FilterType = inferProcedureInput<
    AppRouter['_def']['procedures']['organization']['offers']
>['filter'];

type StatusType = NonNullable<FilterType>['status'];

const statusValues: StatusType[] = [
    'PENDING',
    'DRAFT',
    'PUBLISHED',
    'ACCEPTED',
    'CANCELLED',
];

const FilterDropdown = ({
    filter,
    setFilter,
}: {
    filter: FilterType;
    setFilter: Dispatch<SetStateAction<FilterType>>;
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    icon={<Filter className="h-4 w-4" />}
                    variant="outline"
                    size="sm"
                ></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <Cog className="mr-2 h-4 w-4" />
                        <span>Status</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            {statusValues.map((status) => {
                                const isActive = status === filter?.status;

                                return (
                                    <DropdownMenuItem
                                        className={cn(
                                            isActive && 'bg-neutral-100',
                                            'flex flex-row justify-between cursor-pointer',
                                        )}
                                        onClick={() =>
                                            setFilter((prev) => ({
                                                ...prev,
                                                status: isActive
                                                    ? undefined
                                                    : status,
                                            }))
                                        }
                                    >
                                        <span>
                                            {title(status?.toLowerCase())}
                                        </span>
                                        {isActive && (
                                            <Check className="h-4 w-4" />
                                        )}
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const TeamPage = () => {
    const { team } = useTeam();
    const [filter, setFilter] = useState<FilterType>();
    const { data, isLoading } = trpc.organization.offers.useQuery({
        slug: team.slug,
        filter,
    });

    return (
        <MaxWidthContainer className="mt-5">
            <OnboardingChecks />
            <Container
                title={`${team.name}'s Offers`}
                renderChild={() => (
                    <div className="flex flex-row items-center space-x-2">
                        {filter && filter.status && (
                            <Button
                                variant="outline"
                                icon={<ListRestart className="h-4 w-4" />}
                                onClick={() => setFilter(undefined)}
                                size="sm"
                            ></Button>
                        )}
                        <FilterDropdown filter={filter} setFilter={setFilter} />
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
                )}
            >
                <div className="overflow-x-auto scrollbar-hide">
                    <CardContent
                        data={data ?? []}
                        isLoading={isLoading}
                        team={team}
                    />
                </div>
            </Container>
        </MaxWidthContainer>
    );
};

export default TeamPage;
