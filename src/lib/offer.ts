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
            vesting: z.string().optional(),
            exerciseWindow: z.enum(["6_MONTHS", "1_YEAR", "2_YEARS"]).optional(),
            early: z.boolean().optional(),
            showPerformanceScenarios: z.boolean().optional()
        }).optional(),
        benefit: z.string().optional(),
        signOnBonus: z.coerce.number().optional(),
        targetBonus: z.coerce.number().optional(),
        targetComission: z.coerce.number().optional()
    })

export const OfferSchema = z.object({
    candidate: z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email()
    }),
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

export const EquitySchema = z.object({
    stage: z.enum([
        'PRIVATE',
        'PRE_SEED',
        'SEED',
        'SERIES_A',
        'SERIES_B',
        'SERIES_C',
    ]),
    totalFunding: z.coerce.number(),
    valuation: z.coerce.number(),
    fair_market_value: z.coerce.number().optional(),
    preferred: z.object({
        issue_price: z.coerce.number(),
        shares: z.coerce.number(),
    }),
});

export type EquitySchema = z.infer<typeof EquitySchema>;

export type OfferSchema = z.infer<typeof OfferSchema>;