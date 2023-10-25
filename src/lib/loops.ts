import { env } from "@/env.mjs";

type EmailType = 'WELCOME';

type EmailBody = {
    type: EmailType;
    target: string;
    body?: Record<string, unknown>;
};

const transactionalEmailIds: Record<EmailType, string> = {
    WELCOME: 'clo4z2l8t00pvmn0p4afh89bu',
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