import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getAppById } from "@/app/app-store/app-registry";
import { APP_URL } from "@/lib/constants";
import { prisma } from "@/db";

const queryParams = z.object({
    teamId: z.string()
});

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response(null, { status: 403 });
    }

    console.log(req);

    const url = new URL(req.url);

    const args = url.pathname.replace("/api/apps/", "").split("/");
    if (!Array.isArray(args)) {
        return NextResponse.json({ error: "API route not found" });
    }
    
    const { teamId } = queryParams.parse(
      Object.fromEntries(url.searchParams),
    );

    const team = await prisma.organization.findFirst({
        where: {
            id: teamId,
            members: {
                some: {
                    userId: session.user.id,
                    role: {
                        not: "MEMBER"
                    }
                }
            }
        },
    });

    if (!team) {
        throw new Error("Unauthorized");
    }
    

    const [appId, action] = args;
    try {
        const app = getAppById(appId);
        if (!app) {
            return NextResponse.redirect(`${APP_URL}/t/${team.slug}/settings/apps?error=Unknown app.`)
        }

        if (action === "install") {
            return app.install(req, { user: session.user, team });
        } else if (action === "callback") {
            return app.callback(req, { user: session.user, team });
        }

        return NextResponse.redirect(`${APP_URL}/t/${team.slug}/settings/apps?error=Unhandled action.`)
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: err });
    }
}