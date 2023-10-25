'use client';

import { useState } from 'react';
import { PublicOfferType } from './page';
import PublicOfferView from '@/components/views/public-offer';
import Image from 'next/image';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Props {
    offer: PublicOfferType;
}

const formSchema = z.object({
    email: z.string().email(),
});

const ConfirmEmailOfferPage = ({ offer }: Props) => {
    const [valid, setValid] = useState(false);
    const [validating, setValidating] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setValidating(true);

        setTimeout(() => {
            if (data.email.toLowerCase() === offer.targetEmail.toLowerCase()) {
                setValid(true);
            } else {
                form.setValue('email', '');
                form.setError('email', {
                    message: 'Email is not valid',
                });
                setValidating(false);
            }
        }, 2500);
    };

    if (!valid && !offer.canSkipEmailConfirmation) {
        return (
            <div className="min-h-screen flex bg-neutral-50 px-4">
                <Image
                    src="/_static/svgs/badge-ribbon.svg"
                    alt="Badge Ribbon"
                    height={268}
                    width={434}
                    priority
                    className="hidden md:block absolute inset-x-0 mx-auto top-5 md:top-0 w-[434px] h-[268px] z-10"
                />
                <div className="flex mx-auto mt-[24vh] mb-auto flex-col px-4 py-8 bg-white rounded-xl drop-shadow-md w-full md:max-w-sm items-center justify-center text-center space-y-4">
                    <Image
                        src={offer.organization.imageUrl!}
                        alt={offer.organization.name}
                        width={112}
                        height={112}
                        className="w-[112px] h-[112px] rounded-full"
                    />
                    <h1 className="font-semibold text-lg md:text-2xl">
                        Congratulations on your job offer from{' '}
                        {offer.organization.name}, {offer.targetFirstName}!
                    </h1>
                    <div className="flex flex-col space-y-2 items-start w-full">
                        <p className="font-medium">
                            Enter your email to open your offer:
                        </p>
                        <Form {...form}>
                            <form
                                className="w-full space-y-2"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="john@example.com"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    disabled={!form.formState.isValid}
                                    className="w-full"
                                    loading={validating}
                                >
                                    Validate Email
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
                <Image
                    src="/_static/svgs/talentsend-logo-gray.svg"
                    alt="Talentsend Logo Gray"
                    height={28}
                    width={225}
                    className="absolute inset-x-0 mx-auto bottom-8 w-[225px] h-[28px]"
                />
            </div>
        );
    }

    return <PublicOfferView offer={offer} />;
};

export default ConfirmEmailOfferPage;
