import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
import Footer from '../footer';
import { firstName } from '@/lib/utils';
import { APP_URL } from '@/lib/constants';

interface Props {
    callId: string;
    callerName: string;
    callerEmail: string;
    targetName: string;
}

const CallSurvey = ({ callId, callerName, callerEmail, targetName }: Props) => {
    const callerFirst = firstName(callerName);

    const commentData = {
        callId,
        callerName,
        callerEmail,
    };

    return (
        <Html>
            <Head />
            <Preview>How was your call with {targetName}?</Preview>
            <Tailwind>
                <Body className="mx-auto my-auto bg-white font-sans">
                    <Container className="mx-auto my-10 rounded-md border border-solid border-neutral-200 p-10">
                        <Section className="mt-4">
                            <Img
                                src="https://res.cloudinary.com/dcdsmlpvg/image/upload/f_auto,q_auto/lukofxbsstyojptnu34n"
                                alt="TalentSend"
                                className="mx-auto my-0"
                            />
                        </Section>
                        <Text className="text-sm text-black mb-4">
                            Hey {callerFirst ?? callerName}! Thanks for using
                            Jumpcal for your recent call with {targetName}.
                        </Text>
                        <Section className="text-center mb-6">
                            <Text className="text-sm text-neutral-950">
                                Didn&apos;t get to say everything you wanted?
                            </Text>
                            <Button
                                href={`${APP_URL}/post-call?data=${btoa(
                                    JSON.stringify(commentData),
                                )}`}
                                className="px-4 py-2 bg-black rounded-md text-white text-center text-sm"
                            >
                                Leave a Comment
                            </Button>
                        </Section>
                        <Text className="text-xs text-neutral-950">
                            Did you know that by using Jumpcal you are saving a
                            ton of scheduling time? Don&apos;t have an account?{' '}
                            <Link
                                className="font-medium text-neutral-950"
                                href={`${APP_URL}/signup`}
                            >
                                Sign Up now
                            </Link>
                            !
                        </Text>
                        <Footer intendedFor={callerEmail} />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default CallSurvey;
