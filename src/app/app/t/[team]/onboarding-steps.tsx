'use client';

import { Separator } from '@/components/ui/separator';
import { useTeam } from './layout';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const OnboardingChecks = () => {
    const { team } = useTeam();

    const hasImageUrl = !!team.imageUrl && !team.imageUrl.includes('dicebear');

    const hasCompletedOnboarding = !!team.equity && hasImageUrl;

    if (hasCompletedOnboarding) return <></>;

    return (
        <div className="p-4 bg-gradient-to-b from-white via-neutral-50 to-neutral-100 border border-neutral-300 rounded-md mb-5">
            <h1 className="text-xl font-semibold">Almost there!</h1>
            <p className="text-sm text-neutral-400">
                Complete the following steps to ensure your candidates have the
                best possible experience.
            </p>
            <Separator className="my-2" />
            <div className="space-y-2">
                <Link
                    className="flex items-center justify-start space-x-2"
                    href={`/t/${team.slug}/settings/brand`}
                >
                    <CheckCircle2
                        className={cn(
                            'h-4 w-4',
                            hasImageUrl ? 'text-green-500' : 'text-neutral-600',
                        )}
                    />
                    <p className="text-sm text-neutral-500">
                        Add a company logo.
                    </p>
                </Link>
                <Link
                    className="flex items-center justify-start space-x-2 text-neutral-600"
                    href={`/t/${team.slug}/settings/equity`}
                >
                    <CheckCircle2
                        className={cn(
                            'h-4 w-4',
                            !!team.equity
                                ? 'text-green-500'
                                : 'text-neutral-500',
                        )}
                    />
                    <p className="text-sm text-neutral-500">
                        Add company equity information.
                    </p>
                </Link>
            </div>
        </div>
    );
};

export default OnboardingChecks;
