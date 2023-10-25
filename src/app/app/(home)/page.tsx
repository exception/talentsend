import OrganizationSelector from './organization-selector';
import PendingInvites from './pending-invites';

const RootContainer = () => {
    return (
        <div className="flex flex-col mt-4">
            <PendingInvites />
            <OrganizationSelector />
        </div>
    );
};

export default RootContainer;
