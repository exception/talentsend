import { APP_URL } from "@/lib/constants";
import { Organization, TeamPlan, User } from "@prisma/client";
import { NextResponse } from "next/server";

export interface ActionContext {
    user: User;
    team: Organization;
}

export abstract class App {
    constructor(public readonly name: string, public readonly appId: string, public readonly requiredPlans: TeamPlan[], public readonly appLogoUrl: string) {}

    abstract install(req: Request, context: ActionContext): Promise<Response>;

    callback(req: Request, context: ActionContext): Promise<Response> {
        return Promise.resolve(NextResponse.json({ received: true }));
    }

    _defaultInstallRedirect(teamSlug: string): Response {
        return NextResponse.redirect(`${APP_URL}/t/${teamSlug}/apps/${this.appId}/installed`);
    }
}