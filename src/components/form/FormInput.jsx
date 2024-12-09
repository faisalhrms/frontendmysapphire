import React from 'react';
import { Controller } from 'react-hook-form';
import ErrorMessage from '@components/form/ErrorMessage';

const FormInput = ({ name, control, errors, placeholder, type = "text", className = "", label = true, ...rest }) => {
    return (
        <>
            {
                label && (
                    <label htmlFor={name} className="form-label">{placeholder}</label>
                )
            }
            <Controller
                name={name}
                control={control}
                render={({ field }) => {
                    let inputValue = field.value || '';

                    if (type === 'date') {
                        inputValue = inputValue ? new Date(inputValue).toISOString().slice(0, 10) : '';
                    } else if (type === 'number') {
                        inputValue = inputValue ? Number(inputValue) : '';
                    }

                    return (
                        <input
                            type={type}
                            id={name}
                            className={`form-control w-full !rounded-sm border ${errors[name] ? '!border-red' : ''} ${className}`}
                            placeholder={placeholder}
                            value={inputValue}
                            onChange={e => {
                                const value = type === 'number' ? Number(e.target.value) : e.target.value;
                                field.onChange(value);
                            }}
                            onBlur={field.onBlur}
                            {...rest}
                        />
                    );
                }}
            />
            <ErrorMessage message={errors[name]?.message} />
        </>
    );
};

export default FormInput;
