'use client';

import { useState } from 'react';
import Popover from './popover';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';

interface ColorPickerProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultColor?: string;
    onColorChange: (color: string) => void;
}

const ColorPicker = ({
    defaultColor = '#000000',
    onColorChange,
    className,
    ...props
}: ColorPickerProps) => {
    return (
        <Popover
            render={() => (
                <HexColorPicker color={defaultColor} onChange={onColorChange} />
            )}
        >
            <div
                className={cn(
                    'p-1 rounded-md border border-neutral-200 h-8 w-16 cursor-pointer',
                    className,
                )}
                {...props}
            >
                <div
                    className="h-full w-full"
                    style={{
                        backgroundColor: defaultColor,
                    }}
                />
            </div>
        </Popover>
    );
};

export default ColorPicker;
