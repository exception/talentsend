'use client';

import { useTeam } from '../layout';
import { Button, buttonVariants } from '@/components/ui/button';
import { ArrowLeft, SaveIcon, SendHorizonal } from 'lucide-react';
import NewOfferForm from './form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { OfferSchema } from '@/lib/offer';
import { trpc } from '@/lib/providers/trpc-provider';
import { Offer } from '@prisma/client';
import { useRouter } from 'next/navigation';
import va from '@vercel/analytics';
import Container from '@/components/ui/container';
import MaxWidthContainer from '@/components/app/max-width-container';

interface OfferPageProps {
    offer?: Offer;
}

const OfferView = ({ offer }: OfferPageProps) => {
    const { team } = useTeam();
    const router = useRouter();

    const _offer = OfferSchema.pick({
        compensation: true,
        introduction: true,
        role: true,
        manager: true,
        startDate: true,
        introVideo: true,
    })
        .partial()
        .parse(offer?.body ?? {});

    const utils = trpc.useUtils();

    const form = useForm<OfferSchema>({
        resolver: zodResolver(OfferSchema),
        defaultValues: {
            candidate: {
                email: offer?.targetEmail,
                firstName: offer?.targetFirstName,
                lastName: offer?.targetLastName,
            },
            compensation: _offer.compensation,
            expiryDate: offer?.expiresAt ?? undefined,
            introduction: _offer.introduction,
            manager: _offer.manager,
            role: _offer.role,
            startDate: _offer.startDate,
            introVideo: _offer.introVideo,
        },
    });

    const createOfferMutation = trpc.offers.create.useMutation({
        async onSuccess({ id }) {
            va.track('Created Offer');
            router.push(`/t/${team.slug}/offer/${id}`);
        },
    });
    const editOfferMutation = trpc.offers.edit.useMutation({
        async onSuccess({ id }) {
            await utils.offers.get.invalidate({ orgId: team.id, offerId: id });
            router.push(`/t/${team.slug}/offer/${id}`);
        },
    });

    const handleSubmit = (data: OfferSchema) => {
        if (offer) {
            editOfferMutation.mutate({
                orgId: team.id,
                offerId: offer.id,
                offer: data,
            });
        } else {
            createOfferMutation.mutate({
                orgId: team.id,
                offer: data,
            });
        }
    };

    return (
        <MaxWidthContainer className="mt-5">
            <Container
                backUrl={
                    offer
                        ? `/t/${team.slug}/offer/${offer.id}`
                        : `/t/${team.slug}`
                }
                title={offer ? 'Edit Offer' : 'Create an Offer Letter'}
                renderChild={() => (
                    <Button
                        form="new-offer-form"
                        icon={
                            offer ? (
                                <SaveIcon className="h-4 w-4" />
                            ) : (
                                <SendHorizonal className="h-4 w-4" />
                            )
                        }
                        // disabled={
                        //     !form.formState.isValid || !form.formState.isDirty
                        // }
                        loading={
                            createOfferMutation.isLoading ||
                            editOfferMutation.isLoading
                        }
                    >
                        {offer ? 'Edit' : 'Create'}
                    </Button>
                )}
            >
                <NewOfferForm form={form} handleSubmit={handleSubmit} />
            </Container>
        </MaxWidthContainer>
    );
};

export default OfferView;
