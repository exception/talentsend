'use client';

import { Progress } from '@/components/ui/progress';
import { useTeam } from '../../layout';
import { InfinityIcon } from 'lucide-react';

const Usage = () => {
    const { team } = useTeam();
    const maxCuota = team.plan === 'PREMIUM' ? 10 : -1;

    return (
        <div className="w-full p-4 rounded-md border border-neutral-200 bg-white flex flex-col space-y-2 mt-5">
            <h3 className="text-base font-medium">Your Monthly Usage</h3>
            {team.plan === 'PREMIUM' && (
                <>
                    <Progress
                        value={(team.offerCuota ?? 0 / maxCuota) * 100}
                        className="w-full"
                    />
                    <p className="self-end text-neutral-400 text-sm">
                        {team.offerCuota} / {maxCuota}
                    </p>
                </>
            )}
            {team.plan !== 'PREMIUM' && (
                <>
                    <Progress value={0} className="w-full" />
                    <p className="self-end text-neutral-400 text-sm flex items-center">
                        {team.offerCuota} /{' '}
                        <InfinityIcon className="ml-2 h-4 w-4" />
                    </p>
                </>
            )}
        </div>
    );
};

export default Usage;
