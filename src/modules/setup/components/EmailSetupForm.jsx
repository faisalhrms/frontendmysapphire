import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";

import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormSelect      from "@components/form/FormSelect.jsx";
import FormButton      from "@components/form/FormButton.jsx";

import {
    emailSetupTypes,
} from "@modules/setup/services/emailSetupService.js";
import emailSetupSchema from "@modules/setup/schemas/EmailSetupSchema.js";
import { useEmailSetupForm } from "@modules/setup/hooks/emailSetupHook.js";

const EmailSetupForm = ({ emailSetupData, isEditMode = false }) => {
    const companyId = useSelector((s) => s.auth.user.employee.company.id);

    const { control, handleSubmit, formState: { errors, isSubmitting }, setValue } =
        useForm({
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
            <div className="col-span-12">
                <div className="box">
                    <div className="box-header"><h3 className="box-title">Email Setup</h3></div>
                    <div className="box-body grid grid-cols-12 gap-4">

                        <div className="col-span-12 xl:col-span-6">
                            <FormAsyncSelect
                                label={true}
                                name="to_emails"
                                placeholder="To Emails"
                                control={control}
                                errors={errors}
                                isMulti
                                is_required
                                clientSideSearch={false}
                                apiUrl="/select/user-emails/"
                                queryKeyBase="to_emails"
                                preselectedOptions={emailSetupData?.to_emails.map((e) => ({label: e, value: e}))}
                            />
                        </div>

                        <div className="col-span-12 xl:col-span-6">
                            <FormAsyncSelect
                                label={true}
                                placeholder="CC Emails"
                                name="cc_emails"
                                control={control}
                                errors={errors}
                                isMulti
                                clientSideSearch={false}
                                apiUrl="/select/user-emails/"
                                queryKeyBase="cc_emails"
                                preselectedOptions={emailSetupData?.cc_emails.map((e) => ({label: e, value: e}))}
                            />
                        </div>

                        <div className="col-span-12 xl:col-span-6">
                            <FormSelect
                                name="type"
                                control={control}
                                errors={errors}
                                label="Report Type"
                                placeholder="Select type"
                                options={emailSetupTypes}
                                is_required
                            />
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
