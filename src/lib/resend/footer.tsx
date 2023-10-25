import { Hr, Tailwind, Text } from "@react-email/components";

interface Props {
  intendedFor: string;
  showUnsubscribe?: boolean;
}

const Footer = ({ intendedFor }: Props) => {
  return (
    <Tailwind>
      <Hr className="my-6 w-full border border-neutral-200" />
      <Text className="text-xs text-neutral-400">
        This email was intended for{" "}
        <span className="font-medium">{intendedFor}</span>. If you think this
        email was not meant for you, please ignore and delete it.
      </Text>
    </Tailwind>
  );
};

export default Footer;
