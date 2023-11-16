import { Offer, Organization, Prisma } from '@prisma/client';
import { ZodObject, z } from 'zod';
import { App, AppMetadata } from '..';

export abstract class IOfferUpdateConsumer<T extends ZodObject<any>> extends App {
    constructor(public readonly appId: string, public readonly metadata: AppMetadata) {
        super(appId, metadata);
    }

    async publishOfferUpdate(offer: Offer, team: Organization, appData: Prisma.JsonValue) {
        const zodSchema: T = this.getZodSchema();
        const parsedAppData = zodSchema.safeParse(appData);

        if (!parsedAppData.success) {
            throw new Error('Invalid appData format');
        }

        await this._internalPublishOfferUpdate(offer, team, parsedAppData.data);
    }

    abstract getZodSchema(): T;

    abstract _internalPublishOfferUpdate: (offer: Offer, team: Organization, appData: z.infer<T>) => Promise<void>;
}