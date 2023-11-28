import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense } from 'react';
import LoginForm from './form';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { makeMetadata } from '@/lib/utils';

export const metadata = makeMetadata({
    title: 'Sign in to Talentsend',
});

const LoginPage = () => {
    return (
        <div className="flex flex-col space-y-2 z-10 text-center w-full max-w-md mx-auto mb-auto">
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle>Sign in to Talentsend</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="flex flex-col items-center gap-y-2 pt-4">
                    <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                        <LoginForm />
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

export default LoginPage;
