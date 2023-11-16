import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { Badge } from '@/components/ui/badge';

const slackAppData = z.object({
    url: z.string(),
    channel: z.string(),
});

const SlackAppData = ({ data }: { data: Prisma.JsonValue }) => {
    const appData = slackAppData.safeParse(data);
    if (!appData.success) {
        return <></>;
    }

    return (
        <p className="text-sm">
            Posting to the <Badge>{appData.data.channel}</Badge> channel.
        </p>
    );
};

export default SlackAppData;
