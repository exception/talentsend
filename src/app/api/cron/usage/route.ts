import { NextResponse } from "next/server";
import { updateUsage } from "./utils";
import { log } from "@/lib/utils";

export async function POST(req: Request) {
    const body = await req.json();
    if (process.env.VERCEL === "1") {
        // validate upstash
    }

    try {
        const results = await updateUsage();
        return NextResponse.json(results);
    } catch (error: unknown) {
        await log({
            // @ts-expect-error
            message: "Usage Cron failed. Error: " + error.message,
            mention: true
        })
        // @ts-expect-error
        return NextResponse.json({ error: error.messsage });
    }
}