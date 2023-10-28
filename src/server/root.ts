import { appRoutes } from "./routes/app-routes";
import { offerRoutes } from "./routes/offer-routes";
import { organizationRoutes } from "./routes/organization-routes";
import { userRoutes } from "./routes/user-routes";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
    users: userRoutes,
    organization: organizationRoutes,
    offers: offerRoutes,
    apps: appRoutes
});

export type AppRouter = typeof appRouter;
