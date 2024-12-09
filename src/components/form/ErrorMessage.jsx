import React from 'react';

const ErrorMessage = ({ message }) => {
    if (!message) return null;

    return (
        <p className="text-sm text-red mt-2">{message}</p>
    );
};

export default ErrorMessage;
