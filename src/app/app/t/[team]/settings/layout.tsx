'use client';

import React from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import Navigation from './navigation';

const TeamSettingsLayout = ({ children }: React.PropsWithChildren<unknown>) => {
    const [parentDivRef] = useAutoAnimate();

    return (
        <div className="flex items-start lg:flex-row lg:space-x-12 flex-col space-y-4 lg:space-y-0 px-0 lg:px-20 mt-0 lg:mt-5 w-full">
            <Navigation />
            <div className="flex w-full px-2.5 lg:px-0" ref={parentDivRef}>
                {children}
            </div>
        </div>
    );
};

export default TeamSettingsLayout;
