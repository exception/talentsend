import { prisma } from "@/db";
import { Offer } from "@prisma/client";
import { getAppById } from "../app-registry";
import { IOfferUpdateConsumer } from "../interfaces/offer-update-consumer";
import { ZodObject } from "zod";

const relevantApps = ["slack"];

const canUpdateOffer = (app: any): app is IOfferUpdateConsumer<ZodObject<any>> => {
    return "publishOfferUpdate" in app;
};

export const handleAppsOfferAccept = async (offer: Offer, teamId: string) => {
    const apps = await prisma.installedApp.findMany({
        where: {
            organizationId: teamId,
            appId: {
                in: relevantApps
            },
        },
        include: {
            organization: true
        }
    });

    if (!apps || apps.length === 0) return;

    const promises: Promise<any>[] = [];

    for (const app of apps) {
        const _app = getAppById(app.appId);
        if (!_app) continue;

        if (canUpdateOffer(_app)) {
            promises.push(_app.publishOfferUpdate(offer, app.organization, app.appData));
        }
    }

    await Promise.allSettled(promises);
};
