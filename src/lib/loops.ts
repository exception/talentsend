import { env } from "@/env.mjs";

type EmailType = 'WELCOME' | 'OFFER_ACCEPTED' | 'OFFER_ACCEPTED_CANDIDATE' | 'TEAM_INVITE';

type EmailBody = {
    type: EmailType;
    target: string;
    body?: Record<string, unknown>;
};

const transactionalEmailIds: Record<EmailType, string> = {
    WELCOME: 'clo4z2l8t00pvmn0p4afh89bu',
    OFFER_ACCEPTED: 'clo6g6cc302csl10p5qv0b8o1',
    OFFER_ACCEPTED_CANDIDATE: 'clo6gl31e00h3l20nlvomhg5w',
    TEAM_INVITE: 'clo7df2uz004slc0og8myfm1g'
};

export const sendEmail = async ({ type, target, body }: EmailBody) => {
    await fetch('https://app.loops.so/api/v1/transactional', {
        method: 'POST',
        body: JSON.stringify({
            transactionalId: transactionalEmailIds[type],
            email: target,
            dataVariables: body,
        }),
        headers: {
            Authorization: `Bearer ${env.LOOPS_API_KEY}`
        }
    });
};

// export const createLoopsAudienceContact = async ({  })