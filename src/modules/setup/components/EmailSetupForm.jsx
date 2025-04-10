import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";

import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormButton from "@components/form/FormButton.jsx";

import {emailSetupTypes, getEmailSetupTypeLabel} from "@modules/setup/services/emailSetupService.js";
import emailSetupSchema from "@modules/setup/schemas/EmailSetupSchema.js";
import {useEmailSetupForm} from "@modules/setup/hooks/emailSetupHook.js";
import {formatOptions} from "@helpers/formatters.js";

const EmailSetupForm = ({ emailSetupData, isEditMode = false }) => {
    const companyId = useSelector((state) => state.auth.user.employee.company.id);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm({
        resolver: zodResolver(emailSetupSchema),
        defaultValues: {
            ...emailSetupData,
            company_id: emailSetupData?.company_id || companyId,
            to_emails: emailSetupData?.to_emails || [],
            cc_emails: emailSetupData?.cc_emails || [],
            type: emailSetupData?.type || "",
        },
    });

    const { handleEmailSetupSubmit } = useEmailSetupForm(emailSetupData, isEditMode);
    useEffect(() => {
        if (emailSetupData) {
            Object.keys(emailSetupData).forEach((key) => {
                setValue(key, emailSetupData[key]);
            });
        }
    }, [emailSetupData, setValue]);

    return (
        <form onSubmit={handleSubmit(handleEmailSetupSubmit)} className="grid grid-cols-12 gap-x-6">
            <div className="xxl:col-span-12 col-span-12">
                <div className="box">
                    <div className="box-header">
                        <div className="box-title">Email Setup Info</div>
                    </div>
                    <div className="box-body">
                        <div className="grid grid-cols-12 gap-4">
                            {/* To Emails */}
                            <div className="xl:col-span-6 col-span-12">
                                <FormAsyncSelect
                                    name="to_emails_id"
                                    control={control}
                                    errors={errors}
                                    placeholder="To Emails"
                                    label="To Emails"
                                    isMulti={true}
                                    apiUrl="/select/users/"
                                    queryKeyBase="to_emails"
                                    preselectedOptions={formatOptions(
                                        emailSetupData,
                                        "to_emails"
                                    )}
                                    is_required={true}
                                />
                            </div>

                            {/* CC Emails */}
                            <div className="xl:col-span-6 col-span-12">
                                <FormAsyncSelect
                                    name="cc_emails_id"
                                    control={control}
                                    errors={errors}
                                    placeholder="CC Emails"
                                    label="CC Emails"
                                    isMulti={true}
                                    apiUrl="/select/users/"
                                    queryKeyBase="cc_emails"
                                    preselectedOptions={formatOptions(
                                        emailSetupData,
                                        "cc_emails"
                                    )}
                                    is_required={false}
                                />
                            </div>

                            {/* Type */}
                            <div className="xl:col-span-6 col-span-12">
                                <FormSelect
                                    name="type"
                                    control={control}
                                    errors={errors}
                                    placeholder="Email Type"
                                    label="Email Type"
                                    options={emailSetupTypes}
                                    is_required={true}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="box-footer">
                        <FormButton isSubmitting={isSubmitting} />
                    </div>
                </div>
            </div>
        </form>
    );
};

export default EmailSetupForm;
