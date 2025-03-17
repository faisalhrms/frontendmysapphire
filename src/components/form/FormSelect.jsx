import React from 'react';
import { Controller } from 'react-hook-form';
import Select from 'react-select';
import ErrorMessage from '@components/form/ErrorMessage.jsx';

const FormSelect = ({ name, label = true, control, errors, options, placeholder, className = "", isClearable = true, onSelectChange, is_required = false, ...rest }) => {
    return (
        <>
            {label && (
                <label htmlFor={name} className="form-label">
                    {placeholder}
                    {is_required && <span className="text-rose-500 pl-1"> *</span>}
                </label>
            )}
            <Controller
                name={name}
                control={control}
                render={({field}) => (
                    <Select
                        {...field}
                        {...rest}
                        isClearable={isClearable}
                        className={`w-full !rounded-sm border ${errors[name] ? 'border-red' : ''} ${className}`}
                        classNamePrefix="Select2"
                        placeholder={placeholder}
                        options={options}
                        onChange={(option) => {
                            const value = option ? option.value : '';
                            field.onChange(value);
                            if (onSelectChange) {
                                onSelectChange(value);
                            }
                        }}
                        onBlur={field.onBlur}
                        value={options ? options.find(option => option.value === field.value) : null}
                        menuPortalTarget={document.body}
                        styles={{
                            menuPortal: (base) => ({ ...base, zIndex: 9999 })
                        }}
                    />
                )}
            />
            <ErrorMessage message={errors[name]?.message}/>
        </>
    );
};

export default FormSelect;