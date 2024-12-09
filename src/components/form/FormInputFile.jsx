import React from 'react';
import { Controller } from 'react-hook-form';
import ErrorMessage from '@components/form/ErrorMessage';

const FormFileInput = ({ name, control, errors, placeholder, classNames = "", fileTypes = ['.csv', '.xls', '.xlsx'], label = true, ...rest }) => {
    const acceptFileTypes = fileTypes.join(',');
    return (
        <>
            {label && <label htmlFor={name} className="form-label">{placeholder}</label>}
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <label className="block">
                        <span className="sr-only">Upload File</span>
                        <input
                            id={name}
                            type="file"
                            accept={acceptFileTypes}
                            placeholder={placeholder}
                            className={`block w-full border border-gray-200 focus:shadow-sm dark:focus:shadow-white/10 rounded-sm text-sm focus:z-10 focus:outline-0 focus:border-gray-200 dark:focus:border-white/10 dark:border-white/10 dark:text-white/50
                                        file:border-0 file:bg-light file:me-4 file:py-3 file:px-4 dark:file:bg-black/20 dark:file:text-white/50 ${errors[name] ? '!border-red' : ''} ${classNames}`}
                            onBlur={field.onBlur}
                            onChange={(e) => field.onChange(e.target.files[0])}
                            {...rest}
                        />
                    </label>
                )}
            />
            <ErrorMessage message={errors[name]?.message} />
        </>
    );
};

export default FormFileInput;
