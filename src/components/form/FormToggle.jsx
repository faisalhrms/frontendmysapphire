import React, {useMemo} from 'react';
import { Controller } from 'react-hook-form';
import ErrorMessage from '@components/form/ErrorMessage.jsx';

const FormToggle = ({ name, label, control, errors, placeholder, toggleClasses = "ltr:sm:float-right rtl:sm:float-left", labelClasses = 'label-success mb-1', ...rest }) => {
    const id = useMemo(() => Math.random().toString(36).substr(2, 9), []);
    return (
        <>
            {
                label && (
                    <label className="form-label">{placeholder}</label>
                )
            }
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <div className={`custom-toggle-switch ${toggleClasses}`}>
                        <input
                            id={id}
                            type="checkbox"
                            {...field}
                            {...rest}
                            checked={!!field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                        />
                        <label htmlFor={id} className={labelClasses}></label>
                    </div>
                )}
            />
            <ErrorMessage message={errors[name]?.message} />
        </>
    );
};

export default FormToggle;
