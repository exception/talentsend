import { App } from ".";
import { SlackApp } from "./slack";

const registryMap: Record<string, App> = {
    "slack": new SlackApp()
}

export const getAppById = (appId?: string) => {
    if (!appId) return undefined;
    return registryMap[appId];
}

export const getAllApps = (): App[] => {
    return [];
    // return Object.values(registryMap);
}