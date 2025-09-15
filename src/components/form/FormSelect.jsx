import React from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";
import ErrorMessage from "@components/form/ErrorMessage.jsx";

/**
 * FormSelect changed this beacuse it not support the multiselect and i have to use it in my ITGovernForm
 * - supports single and multi select via `isMulti` prop
 * - keeps same API as earlier, only adds multi handling
 */
const FormSelect = ({
                        name,
                        label = true,
                        control,
                        errors,
                        options = [],
                        placeholder,
                        className = "",
                        isClearable = true,
                        onSelectChange,
                        is_required = false,
                        isMulti = false, // NEW: support multi-select
                        ...rest
                    }) => {
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
                render={({ field }) => {
                    // determine current value shape for react-select
                    const currentValue = (() => {
                        if (isMulti) {
                            // field.value expected to be array of primitive values
                            if (!Array.isArray(field.value)) return [];
                            return options.filter((opt) => field.value.includes(opt.value));
                        }
                        // single select
                        return options.find((opt) => opt.value === field.value) || null;
                    })();

                    return (
                        <Select
                            {...rest}
                            isMulti={isMulti}
                            isClearable={isClearable}
                            className={`w-full !rounded-sm border ${errors[name] ? "border-red" : ""} ${className}`}
                            classNamePrefix="Select2"
                            placeholder={placeholder}
                            options={options}
                            value={currentValue}
                            onChange={(selected) => {
                                if (isMulti) {
                                    const values = selected ? selected.map((s) => s.value) : [];
                                    field.onChange(values);
                                    if (onSelectChange) onSelectChange(values);
                                } else {
                                    const value = selected ? selected.value : "";
                                    field.onChange(value);
                                    if (onSelectChange) onSelectChange(value);
                                }
                            }}
                            onBlur={field.onBlur}
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                            }}
                        />
                    );
                }}
            />

            <ErrorMessage message={errors[name]?.message} />
        </>
    );
};

export default FormSelect;
