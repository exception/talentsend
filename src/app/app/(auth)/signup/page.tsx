import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense } from 'react';
import SignupForm from './form';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { makeMetadata } from '@/lib/utils';

export const metadata = makeMetadata({
    title: 'Sign up to TalentSend',
});

const SignupPage = () => {
    return (
        <div className="flex flex-col space-y-2 z-10 text-center w-full max-w-md mx-auto mb-auto">
            <Card>
                <CardHeader className="pb-4 space-y-2">
                    <CardTitle>Create your TalentSend account</CardTitle>
                    <p className="text-sm font-normal text-neutral-400">
                        TalentSend TalentSend TalentSend TalentSend.
                    </p>
                </CardHeader>
                <Separator />
                <CardContent className="flex flex-col items-center gap-y-2 pt-4">
                    <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                        <SignupForm />
                    </Suspense>
                    {/* <p className="text-sm text-card-foreground">
                    Don&apos;t have an account?{' '}
                    <Link href="/register">
                        <strong>Sign up</strong>
                    </Link>
                </p> */}
                </CardContent>
            </Card>
            <p className="text-xs text-neutral-400">
                By continuing you are agreeing to our <strong>Terms</strong> &{' '}
                <strong>Privacy Policy</strong>.
            </p>
        </div>
    );
};

export default SignupPage;
