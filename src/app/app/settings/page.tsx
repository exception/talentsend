import { makeMetadata } from '@/lib/utils';
import AccountSettingsForm from './form';
import SettingsContainer from './settings-container';
import UploadAvatarRow from './upload-avatar';

export const metadata = makeMetadata({
    title: 'TalentSend - Account Settings',
});

const AccountSettings = () => {
    return (
        <SettingsContainer title="Account">
            <UploadAvatarRow />
            <AccountSettingsForm />
        </SettingsContainer>
    );
};

export default AccountSettings;
