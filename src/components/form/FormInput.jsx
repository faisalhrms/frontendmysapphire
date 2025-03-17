import React from "react";
import { Controller } from "react-hook-form";
import ErrorMessage from "@components/form/ErrorMessage";
import { formatDateTimeLocal } from "@helpers/dateTime.js";

const FormInput = ({
                       name,
                       control,
                       errors,
                       placeholder,
                       type = "text",
                       className = "",
                       label = true,
                       is_required = false,
                       ...rest
                   }) => {
    const fieldError = name
        .split(/[\.\[\]]+/)
        .filter(Boolean)
        .reduce((acc, key) => (acc && acc[key] ? acc[key] : null), errors);

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
                    let inputValue = field.value || "";
                    if (type === "date") {
                        inputValue = inputValue
                            ? new Date(inputValue).toISOString().slice(0, 10)
                            : "";
                    } else if (type === "datetime-local") {
                        inputValue = inputValue ? formatDateTimeLocal(inputValue) : "";
                    } else if (type === "number") {
                        inputValue = inputValue ? Number(inputValue) : "";
                    }

                    return (
                        <input
                            type={type}
                            id={name}
                            className={`form-control w-full !rounded-sm border ${
                                fieldError ? "!border-red" : ""
                            } ${className}`}
                            placeholder={placeholder}
                            value={inputValue}
                            onChange={(e) => {
                                const value =
                                    type === "number" ? Number(e.target.value) : e.target.value;
                                field.onChange(value);
                            }}
                            onBlur={field.onBlur}
                            {...rest}
                        />
                    );
                }}
            />

            {/* Render error message */}
            <ErrorMessage message={fieldError?.message} />
        </>
    );
};

export default FormInput;
