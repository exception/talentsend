import { getAllApps } from "@/app/app-store/app-registry";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { get } from "@vercel/edge-config";

export const appRoutes = createTRPCRouter({
    availableApps: protectedProcedure.query(async () => {
        const appStore = (await get("appStore")) as { disabled: boolean };
        if (appStore.disabled) return [];

        return getAllApps();
    })
})