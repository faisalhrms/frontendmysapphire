import React from 'react';
import { Controller } from 'react-hook-form';
import ErrorMessage from '@components/form/ErrorMessage.jsx';

const FormCheckbox = ({ name, label, control, errors,placeholder, className = "", is_required = false, ...rest }) => {
    return (
        <>
            {
                label && (
                    <label  className="form-label">{placeholder}
                        {is_required && <span className="text-rose-500 "> *</span>}
                    </label>
                )
            }
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <div className="flex items-center">
                        <div className="form-check !ps-0 me-4">
                        <input
                            id={name}
                            type="checkbox"
                            {...field}
                            {...rest}
                            checked={!!field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className={`form-checkbox-input ${errors[name] ? 'border-red' : ''}`}
                        />
                        {label && <label htmlFor={name} className="form-check-label">{label}</label>}
                        </div>
                    </div>
                )}
            />
            <ErrorMessage message={errors[name]?.message} />
        </>
    );
};

export default FormCheckbox;
