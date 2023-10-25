import { prisma } from '@/db';
import { notFound } from 'next/navigation';
import ConfirmEmailOfferPage from './confirm-email';
import { Metadata } from 'next';
import { cache } from 'react';

interface OfferPageProps {
    params: {
        id: string;
    };
}

const getOffer = cache(async (offerId: string) => {
    return prisma.offer.findUnique({
        where: {
            id: offerId,
            status: 'PUBLISHED',
            OR: [
                {
                    expiresAt: null,
                },
                {
                    expiresAt: {
                        gt: new Date(),
                    },
                },
            ],
        },
        include: {
            organization: {
                select: {
                    brand: true,
                    name: true,
                    imageUrl: true,
                    about: true,
                    equity: true,
                },
            },
            benefitPackage: true,
        },
    });
});

export type PublicOfferType = NonNullable<Awaited<ReturnType<typeof getOffer>>>;

export const generateMetadata = async ({
    params,
}: OfferPageProps): Promise<Metadata> => {
    const offer = await getOffer(params.id);
    if (!offer) {
        notFound();
    }

    return {
        title: `${offer.organization.name} x Talentsend`,
    };
};

const OfferPage = async ({ params }: OfferPageProps) => {
    const offer = await getOffer(params.id);

    if (!offer) {
        return notFound();
    }

    return <ConfirmEmailOfferPage offer={offer} />;
};

export default OfferPage;
