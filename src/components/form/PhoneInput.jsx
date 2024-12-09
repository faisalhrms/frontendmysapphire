import React from "react";
import MaskedInput from "react-text-mask";
import { Controller } from "react-hook-form";
import ErrorMessage from "@components/form/ErrorMessage.jsx";

// CustomMaskedInput expects 'inputRef' instead of 'ref' for MaskedInput
const CustomMaskedInput = ({ mask, inputRef, ...props }) => (
    <MaskedInput
        mask={mask}
        {...props}
        ref={inputRef}  // Use inputRef here to pass the ref to MaskedInput
    />
);

const PhoneInput = ({ control, errors }) => {
    return (
        <div className="xl:col-span-6 col-span-12">
            <label htmlFor="phone" className="form-label">Phone</label>
            <Controller
                name="phone"
                control={control}
                render={({ field }) => {
                    const mask = ['+', '9', '2', ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

                    return (
                        <CustomMaskedInput
                            mask={mask}
                            className={`form-control w-full !rounded-sm border ${errors.phone ? '!border-red' : ''}`}
                            placeholder="+92 336 8697029"
                            inputRef={field.ref}  // Pass the field ref to inputRef
                            value={field.value}  // Ensure value is correctly passed
                            onChange={field.onChange}  // Handle changes
                            onBlur={field.onBlur}  // Handle blur events
                        />
                    );
                }}
            />
            <ErrorMessage message={errors.phone?.message} />
        </div>
    );
};

export default PhoneInput;
