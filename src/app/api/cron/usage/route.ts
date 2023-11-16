import { NextResponse } from 'next/server';
import { updateUsage } from './utils';
import { log } from '@/lib/utils';

export async function GET(req: Request) {
    if (process.env.VERCEL === '1') {
        const authHeader = req.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response('Unauthorized', {
                status: 401,
            });
        }
    }

    try {
        const results = await updateUsage();
        return NextResponse.json(results);
    } catch (error: unknown) {
        await log({
            // @ts-expect-error
            message: 'Usage Cron failed. Error: ' + error.message,
            mention: true,
        });
        // @ts-expect-error
        return NextResponse.json({ error: error.messsage });
    }
}
