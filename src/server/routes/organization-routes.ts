import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import cloudinary from 'cloudinary';
import stripe from '@/lib/stripe';

export const organizationRoutes = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                slug: z.string(),
            }),
        )
        .mutation(async ({ ctx: { session, prisma }, input }) => {
            const stripeCustomer = await stripe.customers.create();

            return prisma.organization.create({
                data: {
                    name: input.name,
                    slug: input.slug.toLowerCase(),
                    imageUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${input.name}&scale=80`,
                    stripeCustomerId: stripeCustomer.id,
                    members: {
                        create: {
                            user: {
                                connect: {
                                    id: session.user.id,
                                },
                            },
                            role: 'OWNER',
                        },
                    },
                },
            });
        }),
    get: protectedProcedure
        .input(z.object({ slug: z.string() }))
        .query(async ({ ctx: { session, prisma }, input }) => {
            return prisma.organization.findFirst({
                where: {
                    slug: input.slug.toLowerCase(),
                    members: {
                        some: {
                            userId: session.user.id,
                        },
                    },
                },
                include: {
                    members: {
                        include: {
                            user: true,
                        },
                    },
                    benefitPackages: true,
                },
            });
        }),
    uploadImage: protectedProcedure
        .input(
            z.object({
                slug: z.string(),
                image: z.string().optional(),
            }),
        )
        .mutation(async ({ ctx: { session, prisma }, input }) => {
            const team = await prisma.organization.findFirst({
                where: {
                    slug: input.slug,
                    members: {
                        some: {
                            userId: session.user.id,
                        },
                    },
                },
            });

            if (!team) {
                throw new Error('Unauthorized.');
            }

            const image = input.image;
            if (!image) {
                return prisma.organization.update({
                    where: {
                        id: team.id,
                    },
                    data: {
                        imageUrl: null,
                    },
                });
            }

            const { secure_url } = await cloudinary.v2.uploader.upload(image, {
                folder: 'team_avatar_images',
                public_id: session.user.id,
                overwrite: true,
                invalidate: true,
            });

            return prisma.organization.update({
                where: {
                    id: team.id,
                },
                data: {
                    imageUrl: secure_url,
                },
            });
        }),
    offers: protectedProcedure
        .input(
            z.object({
                slug: z.string(),
            }),
        )
        .query(({ ctx: { session, prisma }, input }) => {
            return prisma.offer.findMany({
                where: {
                    organization: {
                        slug: input.slug,
                        members: {
                            some: {
                                userId: session.user.id,
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        }),
    update: protectedProcedure
        .input(
            z.object({
                slug: z.string(),
                about: z
                    .object({
                        mission: z.string().optional(),
                        about: z.string().optional(),
                        size: z
                            .enum([
                                '1-10',
                                '10-49',
                                '49-99',
                                '99-199',
                                '200-499',
                                '500+',
                            ])
                            .optional(),
                        location: z.string().optional(),
                        funding: z.number().optional(),
                        website: z.string().url().optional(),
                    })
                    .optional(),
                brand: z
                    .object({
                        primary: z.string().optional(),
                        secondary: z.string().optional(),
                    })
                    .optional(),
                equity: z
                    .object({
                        stage: z.enum([
                            'PRIVATE',
                            'PRE_SEED',
                            'SEED',
                            'SERIES_A',
                            'SERIES_B',
                            'SERIES_C',
                        ]),
                        totalFunding: z.number(),
                        valuation: z.number(),
                        fair_market_value: z.number().optional(),
                        preferred: z.object({
                            issue_price: z.number(),
                            shares: z.number(),
                        }),
                    })
                    .optional(),
            }),
        )
        .mutation(async ({ ctx: { session, prisma }, input }) => {
            return prisma.organization.update({
                where: {
                    slug: input.slug,
                    members: {
                        some: {
                            userId: session.user.id,
                        },
                    },
                },
                data: {
                    about: input.about,
                    brand: input.brand,
                    equity: input.equity,
                },
            });
        }),
    addBenefitPackage: protectedProcedure
        .input(
            z.object({
                slug: z.string(),
                name: z.string(),
                benefits: z.array(
                    z.object({
                        name: z.string(),
                        value: z.number(),
                        description: z.string(),
                    }),
                ),
            }),
        )
        .mutation(({ ctx: { session, prisma }, input }) => {
            return prisma.organization.update({
                where: {
                    slug: input.slug,
                    members: {
                        some: {
                            userId: session.user.id,
                        },
                    },
                },
                data: {
                    benefitPackages: {
                        create: {
                            name: input.name,
                            benefits: input.benefits,
                        },
                    },
                },
            });
        }),
    updateBenefitPackage: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                packageId: z.string(),
                benefits: z.array(
                    z.object({
                        name: z.string(),
                        value: z.number(),
                        description: z.string(),
                    }),
                ),
            }),
        )
        .mutation(({ ctx: { session, prisma }, input }) => {
            return prisma.benefitPackage.update({
                where: {
                    id: input.packageId,
                    organization: {
                        members: {
                            some: {
                                userId: session.user.id,
                            },
                        },
                    },
                },
                data: {
                    benefits: input.benefits,
                    name: input.name,
                },
            });
        }),
    createInvite: protectedProcedure
        .input(
            z.object({
                orgId: z.string(),
                email: z.string().email(),
            }),
        )
        .mutation(({ ctx: { prisma }, input }) => {
            return prisma.memberInvite.create({
                data: {
                    target: input.email.toLowerCase(),
                    organization: {
                        connect: {
                            id: input.orgId,
                        },
                    },
                },
            });
        }),
});
