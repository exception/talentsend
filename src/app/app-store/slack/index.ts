import { prisma } from "@/db";
import { ActionContext, App } from "..";

export class SlackApp extends App {
    constructor() {
        super("Slack", "slack", ["FREE", "PREMIUM", "ENTERPRISE"], "/_static/app-store/apps/slack.png");
    }

    async install(req: Request, context: ActionContext): Promise<Response> {
        await prisma.installedApp.create({
            data: {
                appId: this.appId,
                appData: {},
                organization: {
                    connect: {
                        id: context.team.id
                    }
                }
            }
        });

        return this._defaultInstallRedirect(context.team.slug);
    }
}