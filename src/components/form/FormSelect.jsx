import React from 'react';
import { Controller } from 'react-hook-form';
import Select from 'react-select';
import ErrorMessage from '@components/form/ErrorMessage.jsx';

const FormSelect = ({ name, label = true, control, errors, options, placeholder, className = "", ...rest }) => {
    return (
        <>
            {label &&
                <label htmlFor={name} className="form-label">{placeholder}</label>
            }
            <Controller
                name={name}
                control={control}
                render={({field}) => (
                    <Select
                        {...field}
                        {...rest}
                        isClearable={true}
                        className={`w-full !rounded-sm border ${errors[name] ? 'border-red' : ''} ${className}`}
                        classNamePrefix="Select2"
                        placeholder={placeholder}
                        options={options}
                        onChange={option => field.onChange(option ? option.value : '')}
                        onBlur={field.onBlur}
                        value={options ? options.find(option => option.value === field.value) : null}
                    />
                )}
            />
            <ErrorMessage message={errors[name]?.message}/>
        </>
    );
};

export default FormSelect;