import { prisma } from '@/db';
import { ActionContext, App, FunctionArguments } from '..';
import { NextResponse } from 'next/server';
import { APP_URL_SECURE } from '@/lib/constants';
import { z } from 'zod';
import { log } from '@/lib/utils';

const oauthQueryParams = z.object({
    code: z.string(),
});

export class SlackApp extends App {
    constructor() {
        super(
            'Slack',
            'slack',
            ['FREE', 'PREMIUM', 'ENTERPRISE'],
            '/_static/app-store/apps/slack.png',
        );
    }

    async install({ context }: FunctionArguments): Promise<Response> {
        const redirectUri = `${APP_URL_SECURE}/api/apps/${this.appId}/callback?teamId=${context.team.id}`;

        return NextResponse.redirect(
            `https://slack.com/oauth/authorize?client_id=5652187117284.6102891563142&scope=incoming-webhook&redirect_uri=${redirectUri}`,
        );
    }

    async callback({ req, context }: FunctionArguments): Promise<Response> {
        const url = new URL(req.url);
        console.log(url.searchParams);
        const { code } = oauthQueryParams.parse(
            Object.fromEntries(url.searchParams),
        );

        const redirectUri = `${APP_URL_SECURE}/api/apps/${this.appId}/callback?teamId=${context.team.id}`;

        const params = new URLSearchParams();
        params.append("client_id", "5652187117284.6102891563142");
        params.append("client_secret", "3133773c78d8332f016a7cc22b1a6713");
        params.append("code", code);
        params.append("redirect_uri", redirectUri);

        const response = await fetch('https://slack.com/api/oauth.access', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        if (response.status !== 200) {
            console.log(response);
            return this._defaultErrorRedirect(context.team.slug, "Slack Response Error");
        }

        const body = await response.json();
        
        if (!body.ok) {
            await log({
                message: "Invalid Slack Install \n" + JSON.stringify(body),
            });

            return this._defaultErrorRedirect(context.team.slug, "Slack response not OK.");
        }

        await prisma.installedApp.create({
            data: {
                appId: this.appId,
                appData: body,
                organization: {
                    connect: {
                        id: context.team.id,
                    },
                },
            },
        });

        return this._defaultInstallRedirect(context.team.slug);
    }
}
