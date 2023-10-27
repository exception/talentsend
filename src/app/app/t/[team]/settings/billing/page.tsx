'use client';

import SettingsContainer from '@/app/app/settings/settings-container';
import { useTeam } from '../../layout';
import Link from 'next/link';
import { APP_URL } from '@/lib/constants';
import { buttonVariants } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import va from '@vercel/analytics';
import Usage from './usage';
import PlanSelectRow from './plan-select';

const TeamSettingsPage = () => {
    const { team, refetch } = useTeam();
    const searchParams = useSearchParams();
    const [billingSuccess, setBillingSuccess] = useState(false);

    useEffect(() => {
        if (searchParams?.get('success')) {
            setBillingSuccess(true);
            setTimeout(async () => {
                await refetch();
                va.track('Upgraded Plan');
            }, 1000);
        }
    }, [searchParams]);

    return (
        <SettingsContainer
            title="Billing"
            renderChild={() => (
                <Link
                    href={`${APP_URL}/api/stripe/billing?teamId=${team.id}`}
                    target="_blank"
                    className={buttonVariants({
                        variant: 'default',
                        className: 'mt-2 md:mt-0',
                    })}
                >
                    <ExternalLink className="h-4 w-4" />
                    Billing Page
                </Link>
            )}
        >
            {/* {error && (
      <div className="bg-red-50 p-4 border border-red-300 rounded-md">
        <div className="space-y-2">
          <h3 className="text-base text-red-500 font-medium">
            Billing Error
          </h3>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    )} */}
            {billingSuccess && (
                <div className="bg-white p-4 border border-neutral-200 rounded-md mb-5">
                    <h3 className="text-base font-medium">Billing Success!</h3>
                </div>
            )}
            <PlanSelectRow />
        </SettingsContainer>
    );
};

export default TeamSettingsPage;
