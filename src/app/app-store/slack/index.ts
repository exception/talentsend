import { prisma } from '@/db';
import { FunctionArguments } from '..';
import { NextResponse } from 'next/server';
import { APP_URL, APP_URL_SECURE } from '@/lib/constants';
import { z } from 'zod';
import { log } from '@/lib/utils';
import { IOfferUpdateConsumer } from '../interfaces/offer-update-consumer';
import { Offer, Organization } from '@prisma/client';

const oauthQueryParams = z.object({
    code: z.string(),
});

const appDataSchema = z.object({
    url: z.string()
});

type AppDataSchema = z.infer<typeof appDataSchema>;

export class SlackApp extends IOfferUpdateConsumer<typeof appDataSchema> {
    constructor() {
        super(
            'slack',
            {
                appLogoUrl: '/_static/app-store/apps/slack.png',
                name: "Slack",
                requiredPlans: ["ENTERPRISE", "PREMIUM", 'FREE'],
                description: "Configure Webhooks and get updates when candidates accept their offers.",
                isNew: true,
                categories: ["notifications"],
                removalText: "no longer receive notifications to your selected Slack channel"
            }
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
        const { code } = oauthQueryParams.parse(
            Object.fromEntries(url.searchParams),
        );

        const redirectUri = `${APP_URL_SECURE}/api/apps/${this.appId}/callback?teamId=${context.team.id}`;

        const params = new URLSearchParams();
        params.append('client_id', '5652187117284.6102891563142');
        params.append('client_secret', '3133773c78d8332f016a7cc22b1a6713');
        params.append('code', code);
        params.append('redirect_uri', redirectUri);

        const response = await fetch('https://slack.com/api/oauth.access', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        if (response.status !== 200) {
            console.log(response);
            return this._defaultErrorRedirect(
                context.team.slug,
                'Slack Response Error',
            );
        }

        const body = await response.json();

        if (!body.ok) {
            await log({
                message: 'Invalid Slack Install \n' + JSON.stringify(body),
            });

            return this._defaultErrorRedirect(
                context.team.slug,
                'Slack response not OK.',
            );
        }

        await prisma.installedApp.create({
            data: {
                appId: this.appId,
                appData: body.incoming_webhook,
                organization: {
                    connect: {
                        id: context.team.id,
                    },
                },
            },
        });

        return this._defaultInstallRedirect(context.team.slug);
    }

    getZodSchema() {
        return appDataSchema;
    }

    _internalPublishOfferUpdate = async (
        offer: Offer,
        team: Organization,
        appData: AppDataSchema,
    ): Promise<void> => {
        await fetch(appData.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                blocks: [
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            // @ts-expect-error
                            "text": `*${offer.targetFirstName} ${offer.targetLastName}* has verbally accepted their offer for the *${offer.body.role}* role.`
                        }
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": `<${APP_URL}/t/${team.slug}/offer/${offer.id}|View Offer>`
                        }
                    }
                ]
            }),
        });
    }
}
