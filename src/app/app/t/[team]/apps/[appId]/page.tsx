'use client';

import { getAppById } from '@/app/app-store/app-registry';
import { redirect } from 'next/navigation';
import { useTeam } from '../../layout';
import Container from '@/components/ui/container';

interface Props {
    params: {
        appId: string;
    };
}

const SpecificAppPage = ({ params }: Props) => {
    const app = getAppById(params.appId);
    const { team } = useTeam();

    if (!app) {
        return redirect(`/t/${team.slug}/apps`);
    }

    return (
        <Container
            backUrl={`/t/${team.slug}/apps`}
            title={`${app.name} App`}
        ></Container>
    );
};

export default SpecificAppPage;
