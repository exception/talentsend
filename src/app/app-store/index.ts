import { APP_URL } from "@/lib/constants";
import { Organization, TeamPlan, User } from "@prisma/client";
import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

export interface ActionContext {
    user: User;
    team: Organization;
}

export interface FunctionArguments {
    req: Request;
    context: ActionContext;
}

export interface AppMetadata {
    name: string;
    requiredPlans: TeamPlan[];
    appLogoUrl: string;
    description?: string;
    isNew?: boolean;
}

export abstract class App {
    constructor(public readonly appId: string, public readonly metadata: AppMetadata) {}

    abstract install(args: FunctionArguments): Promise<Response>;

    callback(args: FunctionArguments): Promise<Response> {
        return Promise.resolve(NextResponse.json({ received: true }));
    }

    _defaultInstallRedirect(teamSlug: string): Response {
        return NextResponse.redirect(`${APP_URL}/t/${teamSlug}/apps/${this.appId}?installed=true`);
    }

    _defaultErrorRedirect(teamSlug: string, error: string): Response {
        return NextResponse.redirect(`${APP_URL}/t/${teamSlug}/apps/${this.appId}?error=${error}`);
    }

    async isPublished(): Promise<boolean> {
        if (process.env.NODE_ENV !== "production") return true;

        const enabledApps = await get(`enabledApps`);
        if (enabledApps && Array.isArray(enabledApps)) {
            return enabledApps.includes(this.appId);
        }

        return false;
    }
}