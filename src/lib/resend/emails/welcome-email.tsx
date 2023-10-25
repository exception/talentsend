import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
import Footer from '../footer';
import { APP_URL } from '@/lib/constants';
import { firstName } from '@/lib/utils';

interface Props {
    name: string;
    email: string;
}

const WelcomeEmail = ({ name, email }: Props) => {
    return (
        <Html>
            <Head />
            <Preview>Welcome to talentsend.com</Preview>
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
                        <Heading className="my-5 text-center text-xl font-semibold text-neutral-950">
                            Jump Right Into TalentSend!
                        </Heading>
                        <Text className="text-sm text-neutral-950">
                            Thank you for hopping on board,{' '}
                            {firstName(name) ?? name}. With TalentSend,
                            you&apos;re just a leap away from seamless
                            networking.
                        </Text>
                        <Text className="text-sm text-neutral-950">
                            To begin, kindly set up an integration and mark your
                            availability from your settings. And remember, the
                            early bird doesn&apos;t just get the worm; they also
                            avoid back-to-back meetings!
                        </Text>
                        <Button
                            href={`${APP_URL}/settings/integrations`}
                            className="px-4 py-2 bg-black rounded-md text-white text-center text-sm"
                        >
                            Ready, Set, Jump!
                        </Button>
                        <Footer intendedFor={email} showUnsubscribe />
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};

export default WelcomeEmail;
