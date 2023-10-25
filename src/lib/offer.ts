import { z } from "zod";

export const CompensationSchema = z.object({
        value: z.coerce.number({
            required_error: "Base salary value is required."
        }),
        rate: z.enum(["HOURLY", "MONTHLY", "YEARLY"]).default("YEARLY"),
        equity: z.object({
            quantity: z.coerce.number({
                required_error: "Equity Quantity value is required."
            }),
            type: z.enum(["ISO"]).default("ISO"),
            vesting: z.object({
                cliff: z.enum(["1_YEAR"]).default("1_YEAR"),
                total_period: z.coerce.number(),
                milestones: z.enum(["WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"]).default("MONTHLY")
            }).optional(),
            exerciseWindow: z.enum([""]).optional(),
            early: z.boolean().optional(),
            showPerformanceScenarios: z.boolean().optional()
        }).optional(),
        benefit: z.string().optional(),
        signOnBonus: z.coerce.number().optional(),
        targetBonus: z.coerce.number().optional(),
        targetComission: z.coerce.number().optional()
    })

export const OfferSchema = z.object({
    candidateName: z.string(),
    candidateEmail: z.string().email(),
    role: z.string(),
    introduction: z.string().optional(),
    startDate: z.coerce.date().optional(),
    expiryDate: z.coerce.date().optional(),
    manager: z.object({
        name: z.string(),
        email: z.string().email()
    }).optional(),
    compensation: CompensationSchema
});

export type OfferSchema = z.infer<typeof OfferSchema>;