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

        NGROK_URL: z.string().optional(),

        STRIPE_SECRET_KEY: z.string().min(1),
        STRIPE_ONE_TIME_PAYMENT_ID: z.string().min(1),

        LOOPS_API_KEY: z.string().min(1),
    },
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

        CLOUDINARY_URL: process.env.CLOUDINARY_URL,

        NGROK_URL: process.env.NGROK_URL,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        STRIPE_ONE_TIME_PAYMENT_ID: process.env.STRIPE_ONE_TIME_PAYMENT_ID,

        LOOPS_API_KEY: process.env.LOOPS_API_KEY,
    },
});
