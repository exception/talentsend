'use client';

import { redirect } from 'next/navigation';
import { useTeam } from '../../../../layout';
import BenefitEditor from '../../benefit-editor';

interface EditPackageProps {
    params: {
        id: string;
    };
}

const EditPackagePage = ({ params }: EditPackageProps) => {
    const { team } = useTeam();
    const pkg = team.benefitPackages.find((pkg) => pkg.id === params.id);

    if (!pkg) {
        return redirect(`/t/${team.slug}/settings/benefits`);
    }

    return <BenefitEditor benefit={pkg} />;
};

export default EditPackagePage;
