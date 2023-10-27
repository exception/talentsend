import { makeMetadata } from '@/lib/utils';
import AccountSettingsForm from './form';
import Container from '../../../components/ui/container';
import UploadAvatarRow from './upload-avatar';

export const metadata = makeMetadata({
    title: 'TalentSend - Account Settings',
});

const AccountSettings = () => {
    return (
        <Container title="Account">
            <UploadAvatarRow />
            <AccountSettingsForm />
        </Container>
    );
};

export default AccountSettings;
