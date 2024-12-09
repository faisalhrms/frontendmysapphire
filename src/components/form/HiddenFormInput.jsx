import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import ErrorMessage from '@components/form/ErrorMessage';

const HiddenFormInput = ({ name, control, value, valueType, errors }) => {
    return (
        <>
            <Controller
                name={name}
                control={control}
                defaultValue=""
                render={({ field }) => {
                    let hiddenValue;

                    if (valueType === 'array') {
                        hiddenValue = Array.isArray(value) ? JSON.stringify(value) : JSON.stringify([value]);
                    } else if (valueType === 'date') {
                        hiddenValue = value ? new Date(value).toISOString().slice(0, 10) : '';
                    } else if (valueType === 'number') {
                        hiddenValue = value !== undefined && value !== null ? value : null;
                    } else {
                        hiddenValue = value || '';
                    }

                    useEffect(() => {
                        field.onChange(hiddenValue);
                    }, [hiddenValue]);

                    return (
                        <input
                            type="hidden"
                            id={`${name}_hidden`}
                            {...field}
                            value={hiddenValue !== null ? hiddenValue : ''}
                        />
                    );
                }}
            />
            <ErrorMessage message={errors[name]?.message} />
        </>
    );
};

export default HiddenFormInput;
