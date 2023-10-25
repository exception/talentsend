import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().url(),
        NODE_ENV: z.enum(['development', 'test', 'production']),

        GOOGLE_CLIENT_ID: z.string().min(1),
        GOOGLE_CLIENT_SECRET: z.string().min(1),

        NEXTAUTH_SECRET:
            process.env.NODE_ENV === 'production'
                ? z.string().min(1)
                : z.string().min(1).optional(),

        CLOUDINARY_URL: z.string().min(1),

        QSTASH_CURRENT_SIGNING_KEY: z.string().min(1),
        QSTASH_NEXT_SIGNING_KEY: z.string().min(1),
        QSTASH_CLIENT_TOKEN: z.string().min(1),
        UPSTASH_REDIS_URL: z.string().optional(),
        UPSTASH_REDIS_TOKEN: z.string().optional(),

        RESEND_API_KEY: z.string().min(1),

        NGROK_URL: z.string().optional(),

        STRIPE_SECRET_KEY: z.string().min(1),
        STRIPE_ONE_TIME_PAYMENT_ID: z.string().min(1),
    },
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

        CLOUDINARY_URL: process.env.CLOUDINARY_URL,

        QSTASH_CURRENT_SIGNING_KEY: process.env.QSTASH_CURRENT_SIGNING_KEY,
        QSTASH_NEXT_SIGNING_KEY: process.env.QSTASH_NEXT_SIGNING_KEY,
        QSTASH_CLIENT_TOKEN: process.env.QSTASH_CLIENT_TOKEN,
        NGROK_URL: process.env.NGROK_URL,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        STRIPE_ONE_TIME_PAYMENT_ID: process.env.STRIPE_ONE_TIME_PAYMENT_ID,
        UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL,
        UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_TOKEN,
    },
});
