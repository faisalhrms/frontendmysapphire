import React from "react";
import {useApprovalTypeForm} from "@modules/approvals/setup/hooks/useApprovalTypeForm.js";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormRichTextarea from "@components/form/FormRichTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormToggle from "@components/form/FormToggle.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormInput from "@components/form/FormInput.jsx";

const ApprovalTypeForm = ({ editMode = false, approvalTypeId = null }) => {
    const {
        control,
        errors,
        handleSubmit,
        onSubmit,
        isSubmitting,
    } = useApprovalTypeForm(editMode, approvalTypeId);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-x-6 min-h-screen">
                {/* LEFT MAIN FORM */}
                <div className="xxl:col-span-8 xl:col-span-8 lg:col-span-8 sm:col-span-8 col-span-12">
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">Approval Type</div>
                        </div>
                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="xl:col-span-6 col-span-12">
                                    <FormInput
                                        name="code"
                                        control={control}
                                        errors={errors}
                                        placeholder="Code"
                                        is_required={true}
                                    />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <FormInput
                                        name="label"
                                        control={control}
                                        errors={errors}
                                        placeholder="Label"
                                        is_required={true}
                                    />
                                </div>
                                <div className="col-span-12">
                                    <FormTextarea
                                        name="description"
                                        control={control}
                                        errors={errors}
                                        placeholder="Description"
                                        rows={3}
                                    />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <FormInput
                                        name="detail_page_url"
                                        control={control}
                                        errors={errors}
                                        placeholder="Detail Page URL"
                                        is_required={true}
                                    />
                                </div>
                                <div className="xl:col-span-6 col-span-12">
                                    <FormInput
                                        name="approval_page_url"
                                        control={control}
                                        errors={errors}
                                        placeholder="Approval Page URL"
                                        is_required={true}
                                    />
                                </div>

                                {/* Email Templates */}
                                <div className="col-span-12">
                                    <FormInput
                                        name="approver_subject_template"
                                        control={control}
                                        errors={errors}
                                        placeholder="Approver Email Subject"
                                    />
                                </div>
                                <div className="col-span-12">
                                    <FormRichTextarea
                                        name="approver_body_template"
                                        control={control}
                                        errors={errors}
                                        placeholder="Approver Email Body"
                                        editorOptions={{
                                            height: 150,
                                        }}
                                        is_required={true}
                                    />
                                </div>
                                <div className="col-span-12">
                                    <FormInput
                                        name="requester_subject_template"
                                        control={control}
                                        errors={errors}
                                        placeholder="Requester Email Subject"
                                        is_required={true}
                                    />
                                </div>
                                <div className="col-span-12">
                                    <FormRichTextarea
                                        name="requester_body_template"
                                        control={control}
                                        errors={errors}
                                        placeholder="Requester Email Body"
                                        editorOptions={{
                                            height: 150,
                                        }}
                                        is_required={true}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t sm:flex justify-end">
                            <FormButton isLoading={isSubmitting} />
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 sm:col-span-4 col-span-12 sticky top-0 self-start">
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">Settings</div>
                        </div>
                        <div className="box-body space-y-4">
                            <ul className='list-group list-group-flush list-none !rounded-md'>
                                <li className='list-group-item'>
                                    <div>
                                        <FormToggle
                                            name="is_active"
                                            control={control}
                                            errors={errors}
                                            label="Active"
                                            placeholder="Active"
                                        />
                                    </div>
                                    <div className='mt-3'>
                                        <FormToggle
                                            name="notify_requester"
                                            control={control}
                                            errors={errors}
                                            label="Notify Requester"
                                            placeholder="Notify Requester"
                                        />
                                    </div>
                                    <div className='mt-3'>
                                        <FormToggle
                                            name="notify_on_all_actions"
                                            control={control}
                                            errors={errors}
                                            label="Notify on All Actions"
                                            placeholder="Notify on All Actions"
                                        />
                                    </div>
                                </li>
                                <li className='list-group-item'>
                                    <FormInput
                                        type="number"
                                        name="sla_hours"
                                        control={control}
                                        errors={errors}
                                        placeholder="SLA Hours"
                                    />
                                    <div className='mt-2'>
                                        <FormSelect
                                            name="escalation_type"
                                            control={control}
                                            errors={errors}
                                            options={[
                                                {label: "None", value: "none"},
                                                {label: "Next Level", value: "next_level"},
                                                {label: "Custom", value: "custom"},
                                            ]}
                                            placeholder="Escalation Type"
                                        />
                                    </div>
                                </li>
                                <li className='list-group-item'>
                                    <div>
                                        <FormToggle
                                            name="reminder_enabled"
                                            control={control}
                                            errors={errors}
                                            label="Enable Reminders"
                                            placeholder="Enable Reminders"
                                        />
                                    </div>
                                    <div className='mt-3'>
                                        <FormInput
                                            type="number"
                                            name="reminder_interval_hours"
                                            control={control}
                                            errors={errors}
                                            placeholder="Reminder Interval (hours)"
                                        />
                                    </div>
                                    <div className='mt-2'>
                                        <FormInput
                                            type="number"
                                            name="reminder_max_days"
                                            control={control}
                                            errors={errors}
                                            placeholder="Reminder Max Days"
                                        />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ApprovalTypeForm;
