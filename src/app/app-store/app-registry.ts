import { App } from ".";
import { SlackApp } from "./slack";

const registryMap: Record<string, App> = {
    "slack": new SlackApp()
}

export const getAppById = (appId?: string) => {
    if (!appId) return undefined;
    return registryMap[appId];
}

export const getAllApps = async (): Promise<App[]> => {
    const allApps = Object.values(registryMap);
    const publishStatuses = await Promise.all(allApps.map(app => app.isPublished()));
    
    return allApps.filter((app, index) => publishStatuses[index]);
  };
  