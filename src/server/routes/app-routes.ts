import { getAllApps } from "@/app/app-store/app-registry";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { get } from "@vercel/edge-config";

export const appRoutes = createTRPCRouter({
    availableApps: protectedProcedure.query(async () => {
        const appStoreDisabled = await get("appStore.disabled");
        if (appStoreDisabled) return [];

        return getAllApps();
    })
})