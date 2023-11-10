'use client';

import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/providers/trpc-provider';
import { Pencil, SaveIcon, Trash } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useTeam } from '../layout';
import { toast } from 'sonner';

const UploadImageRow = () => {
    const { team, refetch } = useTeam();
    const [imageContent, setImageContent] = useState<string | undefined>();
    const uploadAvatar = trpc.organization.uploadImage.useMutation({
        async onSuccess() {
            await refetch();
            if (!imageContent) {
                toast.success('Removed team logo');
            } else {
                toast.success('Updated team logo');
            }
            setImageContent(undefined);
        },
        onError() {
            toast.error('Logo upload failed', {
                description:
                    "Something went wrong while uploading your team's logo!",
            });
        },
    });

    useEffect(() => {
        setImageContent(
            team.imageUrl ??
                `https://api.dicebear.com/7.x/shapes/svg?seed=${team.name}&scale=80`,
        );
    }, [team]);

    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageContent(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        },
        [setImageContent],
    );

    return (
        <div className="flex w-full flex-col gap-y-2 mb-4">
            <p className="text-sm font-medium leading-none">Logo</p>
            <Dropzone
                maxFiles={1}
                multiple={false}
                accept={{
                    'image/png': ['.png'],
                    'image/jpg': ['.jpg', '.jpeg'],
                }}
                onDrop={handleDrop}
                onDropRejected={(fileRejections) => {
                    const errorCode = fileRejections[0]!.errors[0]!.code;
                    if (errorCode === 'file-too-large') {
                        toast.error('File not supported!', {
                            description: 'File is too large, max size is 3MB.',
                        });
                    } else if (errorCode === 'file-invalid-type') {
                        toast.error('File not supported!', {
                            description:
                                'This file type is not supported, we only support .jpg and .png.',
                        });
                    }
                }}
                maxSize={3_000_000}
            >
                {({ getRootProps, getInputProps }) => (
                    <div
                        className="border-neutral-200 group relative h-24 w-24 md:h-32 md:w-32 shrink-0 overflow-hidden rounded-full border hover:cursor-pointer hover:bg-neutral-500 hover:opacity-75 opacity-100 active:scale-95 transition-all"
                        {...getRootProps()}
                    >
                        <Image
                            className="h-full w-full object-cover"
                            src={imageContent ?? team.imageUrl ?? ''}
                            alt="Your Team Logo"
                            width={128}
                            height={128}
                            priority
                            unoptimized
                        />

                        <div className="absolute left-0 top-0 h-full w-full flex opacity-0 items-center justify-center text-neutral-100 transition-all group-hover:opacity-100">
                            <Pencil className="h-6 w-6" />
                        </div>
                        <input id="upload-image-form" {...getInputProps()} />
                    </div>
                )}
            </Dropzone>
            <div className="flex w-full justify-between items-center">
                <p className="text-xs md:text-sm text-neutral-400 max-w-md">
                    Max file size: <span className="font-medium">3MB</span>,
                    only .jpg and .png are supported.
                </p>
                <div className="flex self-end items-center space-x-2">
                    {team.imageUrl && (
                        <Button
                            disabled={uploadAvatar.isLoading}
                            loading={uploadAvatar.isLoading && !imageContent}
                            variant="outline"
                            size="sm"
                            icon={<Trash className="h-4 w-4" />}
                            onClick={() => {
                                uploadAvatar.mutate({
                                    image: undefined,
                                    slug: team.slug,
                                });
                            }}
                        >
                            Remove
                        </Button>
                    )}
                    <Button
                        disabled={
                            !imageContent || imageContent.includes('dicebear')
                        }
                        loading={uploadAvatar.isLoading}
                        variant="default"
                        size="sm"
                        icon={<SaveIcon className="h-4 w-4" />}
                        onClick={() =>
                            uploadAvatar.mutate({
                                image: imageContent,
                                slug: team.slug,
                            })
                        }
                    >
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UploadImageRow;
