'use client';

import SettingsContainer from '@/app/app/settings/settings-container';
import UploadImageRow from '../upload-image-row';
import BrandColorsForm from './colors-form';
import OfferLetterForm from './offer-letter-form';
import { Separator } from '@/components/ui/separator';

const TeamBrandSettings = () => {
    return (
        <SettingsContainer title="Branding">
            <UploadImageRow />
            <div className="mb-4 ">
                <h2 className="font-semibold text-base">Colors</h2>
                <Separator className="my-2" />
                <BrandColorsForm />
            </div>
            <div className="mb-4 ">
                <h2 className="font-semibold text-base">Offer Letter</h2>
                <Separator className="my-2" />
                <OfferLetterForm />
            </div>
        </SettingsContainer>
    );
};

export default TeamBrandSettings;
