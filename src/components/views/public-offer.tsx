import { OfferSchema } from '@/lib/offer';
import { z } from 'zod';
import MaxWidthContainer from '../app/max-width-container';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import CompensationRow from './compensation-row';
import { PublicOfferType } from '@/app/app/offer/[id]/page';
import BenefitRow from './benefit-row';
import EquityRow from './equity-row';
import CompanyRow from './company-row';

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
}).partial();

export type PartialOffer = z.infer<typeof PartialOffer>;

const PublicOfferView = ({
    offer,
    showAcceptOffer = true,
}: PublicOfferViewProps) => {
    const branding = BrandSchema.parse(offer.organization.brand ?? {});

    const _offer = PartialOffer.parse(offer?.body ?? {});

    return (
        <div className="flex flex-col bg-neutral-100 min-h-screen relative items-center pt-10 pb-24">
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
                        {/* <div className="flex w-full lg:w-[800px] h-[300px] bg-black"></div> */}
                    </div>
                </div>
                <CompensationRow
                    comp={_offer.compensation}
                    branding={branding}
                    benefit={offer.benefitPackage ?? undefined}
                    orgEquity={offer.organization.equity}
                />
                {_offer.compensation?.equity && offer.organization.equity && (
                    <EquityRow
                        equity={_offer.compensation.equity}
                        orgEquity={offer.organization.equity}
                        branding={branding}
                    />
                )}
                <BenefitRow benefit={offer.benefitPackage ?? undefined} />
                <CompanyRow organization={offer.organization} />
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
                    >
                        Verbally Accept Offer
                    </button>
                </div>
            )}
        </div>
    );
};

export default PublicOfferView;
