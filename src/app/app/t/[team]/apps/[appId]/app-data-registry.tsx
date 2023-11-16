import { Prisma } from '@prisma/client';
import SlackAppData from './slack-app-data';

type AppComponent = React.ComponentType<{ data: Prisma.JsonValue }>;

const appDataRegistry: Record<string, AppComponent> = {
    slack: SlackAppData,
};

export const renderAppChild = (appId: string, data: Prisma.JsonValue) => {
    const Component = appDataRegistry[appId];
    return Component ? <Component data={data} /> : null;
};
