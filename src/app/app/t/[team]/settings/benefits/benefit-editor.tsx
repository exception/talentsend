'use client';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { trpc } from '@/lib/providers/trpc-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { BenefitPackage } from '@prisma/client';
import { Plus, SaveIcon, Trash } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTeam } from '../../layout';
import { useRouter } from 'next/navigation';
import Container from '@/components/ui/container';

const formSchema = z.object({
    name: z.string(),
    benefits: z
        .array(
            z.object({
                name: z.string(),
                value: z.coerce.number(),
                description: z.string(),
            }),
        )
        .min(1),
});

interface BenefitPageProps {
    benefit?: BenefitPackage;
}

type ElementType<T extends readonly any[]> = T extends readonly (infer U)[]
    ? U
    : never;
export type BenefitType = ElementType<z.infer<typeof formSchema>['benefits']>;
export type PackageType = z.infer<typeof formSchema> & {
    id: string;
};

const BenefitEditor = ({ benefit }: BenefitPageProps) => {
    const { toast } = useToast();
    const router = useRouter();
    const { team, refetch } = useTeam();

    const createNewBenefitMutation =
        trpc.organization.addBenefitPackage.useMutation({
            async onSuccess() {
                toast({
                    title: 'Successfully created new benefit package',
                });
                await refetch();
                router.push(`/t/${team.slug}/settings/benefits`);
            },
        });

    const updateBenefitMutation =
        trpc.organization.updateBenefitPackage.useMutation({
            async onSuccess() {
                toast({
                    title: 'Successfully saved  package',
                });
                await refetch();
                router.push(`/t/${team.slug}/settings/benefits`);
            },
        });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: benefit?.name,
            benefits: (benefit?.benefits as BenefitType[]) ?? [],
        },
    });
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'benefits',
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        if (benefit) {
            updateBenefitMutation.mutate({
                packageId: benefit.id,
                benefits: data.benefits,
                name: data.name,
            });
        } else {
            createNewBenefitMutation.mutate({
                benefits: data.benefits,
                name: data.name,
                slug: team.slug,
            });
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col w-full"
            >
                <Container
                    title={
                        benefit
                            ? 'Edit Benefit Package'
                            : 'Create Benefit Package'
                    }
                    renderChild={() => (
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                type="button"
                                icon={<Plus className="h-4 w-4" />}
                                onClick={() =>
                                    append({
                                        name: '',
                                        value: 0,
                                        description: '',
                                    })
                                }
                            >
                                Add new Benefit
                            </Button>
                            <Button
                                disabled={!form.formState.isValid}
                                icon={<SaveIcon className="h-4 w-4" />}
                                loading={
                                    updateBenefitMutation.isLoading ||
                                    createNewBenefitMutation.isLoading
                                }
                            >
                                Save
                            </Button>
                        </div>
                    )}
                >
                    <FormField
                        name={'name'}
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Package Name</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Software Engineer Package"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Separator className="my-4" />
                    {fields.length === 0 && (
                        <div className="flex flex-col space-y-2 items-center justify-center">
                            <h2 className="text-base lg:text-lg font-medium">
                                You haven&apos;t added any benefits yet.
                            </h2>
                            <Button
                                variant="outline"
                                type="button"
                                icon={<Plus className="h-4 w-4" />}
                                onClick={() =>
                                    append({
                                        name: '',
                                        value: 0,
                                        description: '',
                                    })
                                }
                            >
                                Create one!
                            </Button>
                        </div>
                    )}
                    {fields.map((field, index) => (
                        <div key={field.id} className="space-y-2">
                            <div className="flex flex-col lg:flex-row items-center lg:space-x-2">
                                <FormField
                                    name={`benefits.${index}.name`}
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Benefit Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Medical"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name={`benefits.${index}.value`}
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel>Benefit Value</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="10000"
                                                    addOn="$"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                name={`benefits.${index}.description`}
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Benefit Description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                placeholder="Description"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end items-center space-x-2">
                                <Button
                                    onClick={() => remove(index)}
                                    icon={<Trash className="h-4 w-4" />}
                                    variant={'outline'}
                                ></Button>
                            </div>
                        </div>
                    ))}
                </Container>
            </form>
        </Form>
    );
};

export default BenefitEditor;
