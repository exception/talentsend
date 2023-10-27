import { OfferSchema } from '@/lib/offer';
import { z } from 'zod';
import MaxWidthContainer from '../app/max-width-container';
import Image from 'next/image';
import Link from 'next/link';
import { format, isPast } from 'date-fns';
import CompensationRow from './compensation-row';
import { PublicOfferType } from '@/app/app/offer/[id]/page';
import BenefitRow from './benefit-row';
import EquityRow from './equity-row';
import CompanyRow from './company-row';
import { useState } from 'react';
import Modal from '../ui/modal';
import { Button } from '../ui/button';
import { trpc } from '@/lib/providers/trpc-provider';
import { useToast } from '../ui/use-toast';

interface PublicOfferViewProps {
    offer: PublicOfferType;
    showAcceptOffer?: boolean;
}

const BrandSchema = z.object({
    primary: z.string().optional().default('#000000'),
    secondary: z.string().optional().default('#000000'),
});

const PartialOffer = OfferSchema.pick({
    compensation: true,
    introduction: true,
    role: true,
    manager: true,
    startDate: true,
    introVideo: true,
}).partial();

export type PartialOffer = z.infer<typeof PartialOffer>;

const sanitizeEmbed = (url: string) => {
    if (url.includes('youtube.com/embed')) {
        if (url.includes('?')) {
            return `${url}&controls=0`;
        }

        return `${url}?controls=0`;
    }

    return url;
};

const PublicOfferView = ({
    offer,
    showAcceptOffer = true,
}: PublicOfferViewProps) => {
    const branding = BrandSchema.parse(offer.organization.brand ?? {});
    const [accept, setAccept] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const { toast } = useToast();
    const isOfferExpired = offer.expiresAt && isPast(offer.expiresAt);

    const mutateOffer = trpc.offers.acceptOffer.useMutation({
        onSuccess() {
            setAccept(false);
            toast({
                title: 'Offer accepted!',
                description: `We have let the team at ${offer.organization.name} know!`,
            });
            setAccepted(true);
        },
    });

    const _offer = PartialOffer.parse(offer?.body ?? {});

    return (
        <>
            <Modal open={accept} setOpen={setAccept}>
                <h1 className="text-xl font-semibold">Verbally Accept Offer</h1>
                <p className="text-neutral-400">
                    Note, accepting this offer via TalentSend is not legally
                    binding. This will indicate to your hiring manager that
                    you&apos;ve accepted the offer and are ready for the legal
                    offer letter.
                </p>
                <div className="mt-4 flex items-center flex-row justify-between space-x-2">
                    <Button
                        disabled={mutateOffer.isLoading}
                        variant="outline"
                        className="w-full"
                        onClick={() => setAccept(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="w-full"
                        loading={mutateOffer.isLoading}
                        onClick={() =>
                            mutateOffer.mutate({
                                offerId: offer.id,
                            })
                        }
                    >
                        Accept
                    </Button>
                </div>
            </Modal>
            <div className="flex flex-col bg-neutral-100 min-h-screen relative items-center pt-10 pb-24 scroll-smooth">
                <div
                    className="h-[384px] w-full absolute top-0"
                    style={{
                        backgroundColor: branding.primary,
                    }}
                ></div>
                <MaxWidthContainer className="z-10 flex items-center flex-col space-y-4">
                    <Image
                        height={60}
                        width={60}
                        className="h-16 w-16"
                        src={offer.organization.imageUrl!}
                        alt={offer.organization.name}
                    />
                    <div className="rounded-xl bg-white shadow-md lg:p-8 p-4 flex flex-col w-full">
                        <h1 className="text-lg lg:text-3xl font-semibold">
                            Welcome to the team, {offer.targetFirstName}!
                        </h1>
                        <div className="flex flex-col lg:flex-row lg:justify-between space-y-2 lg:space-y-0 lg:space-x-2">
                            <div className="flex flex-col my-2 justify-between">
                                <p className="text-sm text-neutral-500">
                                    {_offer.introduction ??
                                        'We’re excited for you to join the team. Please don’t hesitate to reach out if you have any questions about the offer, the role, or the company!'}
                                </p>
                                <div className="space-y-1 my-2">
                                    <p className="text-sm">
                                        <span className="font-semibold">
                                            Role:{' '}
                                        </span>
                                        {_offer.role}
                                    </p>
                                    {_offer.startDate && (
                                        <p className="text-sm">
                                            <span className="font-semibold">
                                                Start Date:{' '}
                                            </span>
                                            {format(
                                                _offer.startDate,
                                                'MMM dd, yyyy',
                                            )}
                                        </p>
                                    )}
                                    {offer.expiresAt && (
                                        <p className="text-sm">
                                            <span className="font-semibold">
                                                Offer Expires:{' '}
                                            </span>
                                            {format(
                                                offer.expiresAt,
                                                'MMM dd, yyyy',
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {_offer.introVideo && (
                                <div className="flex w-full lg:max-w-[500px] h-[500px] lg:h-[300px]">
                                    <iframe
                                        className="h-full w-full"
                                        src={sanitizeEmbed(_offer.introVideo)}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {/* <div className="flex flex-row items-center justify-center space-x-2 w-full overflow-x-auto scrollbar-hide">
                        <Link
                            href={'#overview'}
                            className={buttonVariants({
                                variant: 'ghost',
                            })}
                        >
                            <ScrollText className="h-4 w-4" /> Overview
                        </Link>
                        {_offer.compensation?.equity &&
                            offer.organization.equity && (
                                <Link
                                    href={'#equity'}
                                    className={buttonVariants({
                                        variant: 'ghost',
                                    })}
                                >
                                    <Puzzle className="h-4 w-4" /> Equity
                                </Link>
                            )}
                        <Link
                            href={'#benefits'}
                            className={buttonVariants({ variant: 'ghost' })}
                        >
                            <ShieldPlus className="h-4 w-4" /> Benefits
                        </Link>
                        <Link
                            href={'#about'}
                            className={buttonVariants({ variant: 'ghost' })}
                        >
                            <Info className="h-4 w-4" /> About{' '}
                            {offer.organization.name}
                        </Link>
                    </div> */}
                    <CompensationRow
                        comp={_offer.compensation}
                        branding={branding}
                        benefit={offer.benefitPackage ?? undefined}
                        orgEquity={offer.organization.equity}
                    />
                    {_offer.compensation?.equity &&
                        offer.organization.equity && (
                            <EquityRow
                                equity={_offer.compensation.equity}
                                orgEquity={offer.organization.equity}
                                branding={branding}
                            />
                        )}
                    {offer.benefitPackage && (
                        <BenefitRow benefit={offer.benefitPackage} />
                    )}
                    <CompanyRow organization={offer.organization} />
                    <div
                        className="mt-5 rounded-xl p-4 w-full text-white"
                        style={{
                            background: branding.primary,
                        }}
                    >
                        <p className="text-xs">
                            <span className="font-semibold">Disclaimer - </span>
                            All information provided should not be considered as
                            financial, legal, or tax advice. These numbers may
                            not accurately reflect exact amounts or future
                            performance information. Talentsend cannot guarantee
                            the accuracy of the information provided and will
                            not be liable for any actions taken based upon them.
                            All information is as provided by the hiring
                            company, and should be considered private and
                            confidential.
                        </p>
                    </div>
                </MaxWidthContainer>
                {showAcceptOffer && _offer.manager && (
                    <div className="fixed inset-x-0 bottom-0 flex h-20 flex-row justify-between bg-white border-t border-t-neutral-200 p-4 z-50">
                        <div className="flex justify-between flex-col">
                            <p className="text-sm font-medium">
                                Questions about this offer?
                            </p>
                            <Link
                                className="text-sm"
                                style={{
                                    color: branding.secondary,
                                }}
                                href={`mailto:${_offer.manager.email}`}
                            >
                                Email {_offer.manager.name}
                            </Link>
                        </div>
                        <button
                            className="rounded-xl py-4 w-44 md:w-60 lg:w-[353px] items-center justify-center flex text-sm font-semibold shadow-sm text-white"
                            style={{
                                backgroundColor: branding.primary,
                            }}
                            disabled={
                                offer.canSkipEmailConfirmation ||
                                offer.status === 'ACCEPTED' ||
                                accepted
                            }
                            onClick={() => setAccept(true)}
                        >
                            {offer.status === 'ACCEPTED' || accepted
                                ? 'Offer Accepted'
                                : 'Verbally Accept Offer'}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default PublicOfferView;
