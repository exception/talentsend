'use client';

import { EquitySchema } from '@/lib/offer';
import { Organization } from '@prisma/client';
import Image from 'next/image';
import { title } from 'radash';
import { z } from 'zod';
import { Avatar, AvatarImage } from '../ui/avatar';

interface CompanyRow {
    organization: Pick<
        Organization,
        'imageUrl' | 'about' | 'name' | 'brand' | 'equity'
    >;
}

const InfoCard = ({ title, value }: { title: string; value?: string }) => {
    return value ? (
        <div className="flex flex-col">
            <p className="text-sm">{title}</p>
            <p className="text-sm font-semibold">{value}</p>
        </div>
    ) : (
        <></>
    );
};

const AboutSchema = z.object({
    mission: z.string().optional(),
    location: z.string().optional(),
    about: z.string().optional(),
    size: z.string().optional(),
});

const CompanyRow = ({ organization }: CompanyRow) => {
    const _about = AboutSchema.parse(organization.about ?? {});
    const _equity = EquitySchema.pick({ stage: true })
        .partial()
        .parse(organization.equity ?? {});

    return (
        <div
            id="about"
            className="p-4 lg:p-8 bg-white rounded-xl shadow-md flex flex-col w-full space-y-4"
        >
            <div className="flex flex-row items-center mb-4 space-x-4">
                <Avatar className="h-28 w-28 rounded-full">
                    <AvatarImage src={organization.imageUrl!} />
                </Avatar>
                <div className="flex flex-col space-y-3">
                    <h1 className="text-lg lg:text-2xl font-semibold">
                        About {organization.name}
                    </h1>
                    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4 md:items-center">
                        <InfoCard
                            title={'Headquarters'}
                            value={_about.location}
                        />
                        <InfoCard title="Company Size" value={_about.size} />
                        <InfoCard
                            title="Last Funding Round"
                            value={title(_equity.stage?.toLowerCase())}
                        />
                    </div>
                </div>
            </div>
            {_about.mission && (
                <h2 className="text-2xl font-semibold">{_about.mission}</h2>
            )}
            {_about.about && <p className="text-sm">{_about.about}</p>}
        </div>
    );
};

export default CompanyRow;
