import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { OfferSchema } from '@/lib/offer';
import { pick } from 'radash';
import { sendEmail } from '@/lib/loops';
import { APP_URL } from '@/lib/constants';
import { OfferStatus, Organization } from '@prisma/client';
import { FREE_PLAN, plans } from '@/lib/plans';
import { handleAppsOfferAccept } from '@/app/app-store/lib';

const getOfferStateFromTeam = (team: Organization): OfferStatus => {
    const pricingPlan =
        plans.find((plan) => plan.type === team.plan) ?? FREE_PLAN;

    const isInfinite = pricingPlan.maxCuota === -1;

    if (!isInfinite && team.offerCuota + 1 > pricingPlan.maxCuota) {
        return 'PENDING'; // will need to pay
    }

    return 'DRAFT';
};

export const offerRoutes = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                orgId: z.string(),
                offer: OfferSchema,
            }),
        )
        .mutation(async ({ ctx: { session, prisma }, input }) => {
            const organization = await prisma.organization.findFirst({
                where: {
                    id: input.orgId,
                    members: {
                        some: {
                            userId: session.user.id,
                        },
                    },
                },
            });

            if (!organization) {
                throw new Error('Unauthorized');
            }

            return prisma.offer.create({
                data: {
                    targetEmail: input.offer.candidate?.email,
                    targetFirstName: input.offer.candidate?.firstName,
                    targetLastName: input.offer.candidate?.lastName,
                    expiresAt: input.offer.expiryDate,
                    ...(input.offer.compensation.benefit
                        ? {
                              benefitPackage: {
                                  connect: {
                                      id: input.offer.compensation.benefit,
                                  },
                              },
                          }
                        : undefined),
                    body: pick(input.offer, [
                        'compensation',
                        'introduction',
                        'manager',
                        'role',
                        'startDate',
                    ]),
                    status: getOfferStateFromTeam(organization), // draft = publishable, pending = needs payment
                    createdBy: {
                        connect: {
                            id: session.user.id,
                        },
                    },
                    organization: {
                        connect: {
                            id: organization.id,
                        },
                    },
                },
            });
        }),
    edit: protectedProcedure
        .input(
            z.object({
                orgId: z.string(),
                offerId: z.string(),
                offer: OfferSchema.partial(),
            }),
        )
        .mutation(({ ctx: { session, prisma }, input }) => {
            return prisma.offer.update({
                where: {
                    id: input.offerId,
                    organization: {
                        id: input.orgId,
                        members: {
                            some: {
                                userId: session.user.id,
                            },
                        },
                    },
                },
                data: {
                    targetEmail: input.offer.candidate?.email,
                    targetFirstName: input.offer.candidate?.firstName,
                    targetLastName: input.offer.candidate?.lastName,
                    expiresAt: input.offer.expiryDate,
                    ...(input.offer.compensation?.benefit
                        ? {
                              benefitPackage: {
                                  connect: {
                                      id: input.offer.compensation.benefit,
                                  },
                              },
                          }
                        : undefined),
                    body: pick(input.offer, [
                        'compensation',
                        'introduction',
                        'manager',
                        'role',
                        'startDate',
                        'introVideo',
                    ]),
                },
            });
        }),
    get: protectedProcedure
        .input(
            z.object({
                orgId: z.string(),
                offerId: z.string(),
            }),
        )
        .query(({ ctx: { session, prisma }, input }) => {
            return prisma.offer.findFirst({
                where: {
                    organization: {
                        id: input.orgId,
                        members: {
                            some: {
                                userId: session.user.id,
                            },
                        },
                    },
                    id: input.offerId,
                },
                include: {
                    organization: true,
                    benefitPackage: true,
                },
            });
        }),
    changeStatus: protectedProcedure
        .input(
            z.object({
                offerId: z.string(),
                status: z.enum(['PUBLISHED', 'CANCELLED']),
            }),
        )
        .mutation(async ({ ctx: { prisma }, input }) => {
            const _offer = await prisma.offer.findUnique({
                where: {
                    id: input.offerId,
                },
            });

            if (input.status === 'PUBLISHED') {
                // only allow incrementing once, in case offer gets cancelled and re-published
                if (_offer && !_offer?.published) {
                    await prisma.$transaction([
                        prisma.offer.update({
                            where: { id: _offer.id },
                            data: {
                                published: true,
                                status: 'PUBLISHED',
                                publishedAt: new Date(),
                            },
                        }),
                        prisma.organization.update({
                            where: { id: _offer.organizationId },
                            data: { offerCuota: { increment: 1 } },
                        }),
                    ]);

                    return { ..._offer, status: "PUBLISHED" } // fake to avoid another prisma query
                }
            }

            return prisma.offer.update({
                where: {
                    id: input.offerId,
                },
                data: {
                    status: input.status,
                },
            });
        }),
    acceptOffer: publicProcedure
        .input(
            z.object({
                offerId: z.string(),
            }),
        )
        .mutation(async ({ ctx: { prisma }, input }) => {
            const offerWithTeam = await prisma.offer.findUnique({
                where: {
                    id: input.offerId,
                },
                include: {
                    organization: {
                        select: {
                            name: true,
                        },
                    },
                    createdBy: {
                        select: {
                            email: true,
                            name: true,
                        },
                    },
                },
            });

            if (!offerWithTeam) throw new Error('Invalid offer');

            if (offerWithTeam?.createdBy?.email) {
                void sendEmail({
                    type: 'OFFER_ACCEPTED',
                    target: offerWithTeam?.createdBy?.email,
                    body: {
                        candidateName: offerWithTeam.targetFirstName,
                        offerLink: `${APP_URL}/offer/${offerWithTeam.id}`,
                    },
                });
            }

            void handleAppsOfferAccept(offerWithTeam, offerWithTeam.organizationId);

            void sendEmail({
                type: 'OFFER_ACCEPTED_CANDIDATE',
                target: offerWithTeam.targetEmail,
                body: {
                    companyName: offerWithTeam.organization.name,
                },
            });

            return prisma.offer.update({
                where: {
                    id: input.offerId,
                },
                data: {
                    status: 'ACCEPTED',
                },
            });
        }),
});
