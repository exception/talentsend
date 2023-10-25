'use client';

import SettingsContainer from '@/app/app/settings/settings-container';
import { useTeam } from '../../layout';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { PencilIcon } from 'lucide-react';
import { PackageType } from './benefit-editor';

const NoBenefitsCard = () => {
    return <div className=""></div>;
};

const BenefitsPage = () => {
    const { team } = useTeam();

    return (
        <SettingsContainer
            title="Benefit Packages"
            renderChild={() => (
                <Link
                    href={`/t/${team.slug}/settings/benefits/new`}
                    className={buttonVariants({ variant: 'default' })}
                >
                    Create new Package
                </Link>
            )}
        >
            {team.benefitPackages.length === 0 && <NoBenefitsCard />}
            {team.benefitPackages.length > 0 && (
                <div className="flex flex-col space-y-2">
                    {team.benefitPackages.map((pkg) => {
                        const _pkg = pkg as unknown as PackageType;
                        return (
                            <div className="rounded-md bg-white border border-neutral-200 p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">
                                        {_pkg.name}
                                    </p>
                                    <Link
                                        href={`/t/${team.slug}/settings/benefits/edit/${pkg.id}`}
                                        className={buttonVariants({
                                            variant: 'outline',
                                            size: 'sm',
                                        })}
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </Link>
                                </div>
                                <p className="text-xs text-neutral-400">
                                    This package has {_pkg.benefits?.length}{' '}
                                    benefits.
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </SettingsContainer>
    );
};

export default BenefitsPage;
