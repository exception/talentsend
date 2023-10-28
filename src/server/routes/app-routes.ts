import { getAllApps } from "@/app/app-store/app-registry";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const appRoutes = createTRPCRouter({
    availableApps: protectedProcedure.query(async () => {
        return await getAllApps();
    })
})