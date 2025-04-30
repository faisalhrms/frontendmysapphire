// src/components/email/SendEmail.jsx
import React from "react";
import { useSendEmailForm } from "@modules/setup/hooks/SendEmailHook.js";
import FormSelect from "@components/form/FormSelect.jsx";
import FormButton from "@components/form/FormButton.jsx";
import { emailSetupTypes } from "@modules/setup/services/emailSetupService.js";

/**
 * Component to render a simple send email form
 * @param {{ isActive: boolean }} props
 */
const SendEmail = ({ isActive }) => {
    if (!isActive) return null;

    const { control, errors, isSubmitting, handleSubmit, onSubmit } = useSendEmailForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-4 items-end">
            <div className="xxl:col-span-12 col-span-12">
                <div className="box">
                    {/* Current Date (readonly) */}
                    <div className="box-body">
                        <div className="grid grid-cols-12 gap-4">
                            <div className="xl:col-span-4 col-span-12">
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    type="date"
                                    {...control.register("date")}
                                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                    disabled
                                />
                            </div>

                            {/* Email Type */}
                            <div className="xl:col-span-4 col-span-12">
                                <FormSelect
                                    name="report_type"
                                    control={control}
                                    errors={errors}
                                    placeholder="Select Email Type"
                                    label="Email Type"
                                    options={emailSetupTypes}
                                    is_required={true}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="xl:col-span-4 pt-7 col-span-12">
                                <FormButton isSubmitting={isSubmitting} className="w-full"/>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
        </form>
);
};

export default SendEmail;
