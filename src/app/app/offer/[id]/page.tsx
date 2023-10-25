import PublicOfferView from '@/components/views/public-offer';
import { prisma } from '@/db';
import { notFound } from 'next/navigation';

interface OfferPageProps {
    params: {
        id: string;
    };
}

const getOffer = async (offerId: string) => {
    return prisma.offer.findUnique({
        where: {
            id: offerId,
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
};

export type PublicOfferType = NonNullable<Awaited<ReturnType<typeof getOffer>>>;

const OfferPage = async ({ params }: OfferPageProps) => {
    const offer = await getOffer(params.id);

    if (!offer) {
        return notFound();
    }

    return <PublicOfferView offer={offer} />;
};

export default OfferPage;
