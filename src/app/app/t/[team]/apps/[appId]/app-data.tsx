import { getAppById } from '@/app/app-store/app-registry';
import { InstalledApp } from '@prisma/client';

interface AppDataProps {
    app: InstalledApp;
}

const InstalledAppData = ({ app }: AppDataProps) => {
    const localApp = getAppById(app.appId);
    return (
        <>
            <h1>{localApp?.metadata.name}</h1>
        </>
    );
};

export default InstalledAppData;
