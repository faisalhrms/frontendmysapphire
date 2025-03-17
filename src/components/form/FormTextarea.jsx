import React from 'react';
import { Controller } from 'react-hook-form';
import ErrorMessage from '@components/form/ErrorMessage.jsx';

const FormTextarea = ({ name, control, errors, placeholder, rows = 2, className = "", is_required=false, ...rest }) => {
    return (
        <>
            <label htmlFor={name} className="form-label">{placeholder}
                {is_required && <span className="text-rose-500 pl-1"> *</span>}
            </label>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <textarea
                        {...field}
                        value={field.value ?? ''}
                        className={`form-control w-full !rounded-sm border ${errors[name] ? '!border-red' : ''} ${className}`}
                        placeholder={placeholder}
                        rows={rows}
                        {...rest}
                    />
                )}
            />
            <ErrorMessage message={errors[name]?.message}/>
        </>
    );
};

export default FormTextarea;
