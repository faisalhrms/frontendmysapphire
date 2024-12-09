import React from 'react';
import { Oval } from 'react-loader-spinner';

const LoadingSpinner = () => (
    <div className="flex justify-center items-center min-h-[200px]">
        <Oval color={`rgb(var(--primary))`} height={30} width={30} />
    </div>
);

export default LoadingSpinner;
