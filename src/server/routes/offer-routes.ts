import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';
import { OfferSchema } from '@/lib/offer';
import { pick } from 'radash';

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
                    targetEmail: input.offer.candidateEmail,
                    targetName: input.offer.candidateName,
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
                    targetEmail: input.offer.candidateEmail,
                    targetName: input.offer.candidateName,
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
        .mutation(({ ctx: { session, prisma }, input }) => {
            return prisma.offer.update({
                where: {
                    id: input.offerId,
                },
                data: {
                    status: input.status,
                },
            });
        }),
});
