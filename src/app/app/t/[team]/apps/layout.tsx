import MaxWidthContainer from '@/components/app/max-width-container';

const AppsLayout = ({ children }: React.PropsWithChildren<unknown>) => {
    return <MaxWidthContainer className="mt-5">{children}</MaxWidthContainer>;
};

export default AppsLayout;
