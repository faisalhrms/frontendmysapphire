// @modules/it-governance/forms/ITGovernForm.jsx
import React, { useEffect } from "react";
import { Controller } from "react-hook-form";

import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormRichTextarea from "@components/form/FormRichTextarea.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";
import ErrorMessage from "@components/form/ErrorMessage.jsx";

import { useServiceLevelAgreementForm } from "@modules/it_governance/hooks/useServiceLevelAgreementForm.js";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import {formatOptions} from "@helpers/formatters.js";

const UNIT_OPTIONS = [
    { value: "hours", label: "Hours" },
    { value: "minutes", label: "Minutes" },
    { value: "days", label: "Days" },
];

const PRIORITY_OPTIONS = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
];

const SUPPORT_HOURS_OPTIONS = [
    { value: "24_hours", label: "24 Hours (24/7)" },
    { value: "business_hours", label: "9:00 AM – 5:30 PM" },
];


const REVIEW_FREQ_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1} month${i + 1 > 1 ? "s" : ""}`,
}));

const EXCLUSION_OPTIONS = [
    { value: "Force Majeure", label: "Force Majeure" },
    { value: "Scheduled Maintenance", label: "Scheduled Maintenance" },
    { value: "Third-party system failures", label: "Third-party system failures" },
    { value: "Cyberattack (Zero-day)", label: "Cyberattack (Zero-day)" },
];

const ITGovernForm = ({ slaData = {}, isEditMode = false }) => {
    const { control, handleSubmit, errors, isSubmitting, handleSlaSubmit, reset } =
        useServiceLevelAgreementForm(slaData, isEditMode);

    useEffect(() => {
        if (slaData && slaData.id) {
            reset(); // rehydrate using hook defaults
        }
    }, [slaData, reset]);

    return (
        <form onSubmit={handleSubmit(handleSlaSubmit)}>
            <div className="grid grid-cols-12 gap-x-6">
                {/* Full width main form (no meta column) */}
                <div className="col-span-12">
                    {/* Basic Information */}
                    <div className="box mb-6">
                        <div className="box-header">
                            <div className="box-title">Vendor Information</div>
                        </div>

                        <div className="box-body grid grid-cols-12 gap-4">
                            <div className="col-span-4">
                                <FormInput
                                    name="vendor_name"
                                    control={control}
                                    errors={errors}
                                    placeholder="Vendor Name"
                                    is_required={true}
                                />
                            </div>

                            <div className="col-span-4">
                                <FormInput name="phone" control={control} errors={errors} placeholder="Phone"/>
                            </div>

                            {/* ✅ NEW Address Field */}
                            <div className="col-span-4">
                                <FormInput
                                    name="address"
                                    control={control}
                                    errors={errors}
                                    placeholder="Address"
                                />
                            </div>

                            <div className="col-span-4">
                                <FormAsyncSelect
                                    name="key_metric_id"
                                    control={control}
                                    errors={errors}
                                    placeholder="Select Key Metric"
                                    apiUrl="/select/sla/metrics/"
                                    queryKeyBase="sla_metrics"
                                    clientSideSearch={false}
                                    preselectedOptions={formatOptions(
                                        slaData,
                                        "key_metric"
                                    )}
                                    allowSaveNewOption={true}
                                    saveOptionEndpoint="/select/sla/metric/"
                                />
                            </div>

                            {/* ✅ Changed Support Hours to Select */}
                            <div className="col-span-4">
                                <FormSelect
                                    name="support_hours"
                                    control={control}
                                    errors={errors}
                                    options={SUPPORT_HOURS_OPTIONS}
                                    placeholder="Support Hours"
                                    isClearable={false}
                                />
                            </div>

                            <div className="col-span-4">
                                <FormInput name="duration" control={control} errors={errors}
                                           placeholder="Duration"/>
                            </div>

                            <div className="col-span-6">
                                <FormTextarea
                                    name="responsibilities"
                                    control={control}
                                    errors={errors}
                                    placeholder="Responsibilities"
                                    rows={3}
                                    is_required={false}
                                    needLabel={true}
                                />
                            </div>

                            <div className="col-span-6">
                                <FormTextarea
                                    name="services_provided"
                                    control={control}
                                    errors={errors}
                                    placeholder="Services Provided"
                                    rows={3}
                                    is_required={false}
                                    needLabel={true}
                                />
                            </div>
                        </div>
                    </div>

                    {/* SLA Timings & Review */}
                    <div className="box mb-6">
                        <div className="box-header">
                            <div className="box-title">SLA Timings & Review</div>
                        </div>

                        <div className="box-body">
                            {/* First row: Priority + Response + Resolution */}
                            <div className="grid grid-cols-12 gap-4 mb-4">
                                {/* Priority */}
                                <div className="col-span-4">
                                    <FormSelect
                                        name="priority"
                                        control={control}
                                        errors={errors}
                                        options={PRIORITY_OPTIONS}
                                        placeholder="Priority"
                                        is_required={true}
                                    />
                                </div>

                                {/* Response Time with grouped border */}
                                <div className="col-span-4">
                                    <label className="block text-sm font-medium text-gray-800 mb-1">
                                        Response Time <span className="text-gray-500 text-xs">(Unit)</span>
                                    </label>
                                    <div className="flex gap-2 p-2 border border-gray-300 rounded-md bg-gray-50">
                                        <FormInput
                                            name="response_value"
                                            control={control}
                                            errors={errors}
                                            type="number"
                                            className="w-1/3"     // narrower number box
                                        />
                                        <FormSelect
                                            name="response_unit"
                                            control={control}
                                            errors={errors}
                                            options={UNIT_OPTIONS}
                                            isClearable={false}
                                            className="w-1/3 min-w-[4rem]"  // compact select
                                        />
                                    </div>
                                    <ErrorMessage message={errors.response_value?.message}/>
                                </div>

                                {/* Resolution Time with grouped border */}
                                <div className="col-span-4">
                                    <label className="block text-sm font-medium text-gray-800 mb-1">
                                        Resolution Time <span className="text-gray-500 text-xs">(Unit)</span>
                                    </label>
                                    <div className="flex gap-2 p-2 border border-gray-300 rounded-md bg-gray-50">
                                        <FormInput
                                            name="resolution_value"
                                            control={control}
                                            errors={errors}
                                            type="number"
                                            className="w-1/3"     // narrower number box
                                        />
                                        <FormSelect
                                            name="resolution_unit"
                                            control={control}
                                            errors={errors}
                                            options={UNIT_OPTIONS}
                                            isClearable={false}
                                            className="w-1/3 min-w-[4rem]"  // compact select
                                        />
                                    </div>
                                    <ErrorMessage message={errors.resolution_value?.message}/>
                                </div>

                            </div>

                            {/* Remaining fields */}
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-3">
                                    <FormSelect
                                        name="review_frequency"
                                        control={control}
                                        errors={errors}
                                        options={REVIEW_FREQ_OPTIONS}
                                        placeholder="Review Frequency"
                                        isClearable={true}
                                    />
                                </div>

                                <div className="col-span-3">
                                    <FormInput
                                        name="penalties"
                                        control={control}
                                        errors={errors}
                                        placeholder="Penalties (short)"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <FormInput
                                        name="confidentiality_requirement"
                                        control={control}
                                        errors={errors}
                                        placeholder="Confidentiality Requirement"
                                    />
                                </div>
                                <div className="col-span-3">
                                    <FormInput
                                        name="termination_notice_period"
                                        control={control}
                                        errors={errors}
                                        placeholder="Termination Notice Period (days)"
                                        type="number"
                                    />
                                </div>


                            </div>
                        </div>
                    </div>


                    {/* Exit & Exclusions */}
                    <div className="box mb-6">
                        <div className="box-header">
                            <div className="box-title">Exit & Exclusions</div>
                        </div>

                        <div className="box-body grid grid-cols-12 gap-4">
                            <div className="col-span-3">
                                <FormInput
                                    name="exit_clause_reference"
                                    control={control}
                                    errors={errors}
                                    placeholder="Exit Clause Reference"
                                />
                            </div>

                            <div className="col-span-3">
                                <FormInput
                                    name="dispute_resolution"
                                    control={control}
                                    errors={errors}
                                    placeholder="Dispute Resolution"
                                />
                            </div>
                            <div className="col-span-3">
                                <FormInput name="early_exit_penalty" control={control} errors={errors}
                                           placeholder="Early Exit Penalty"/>
                            </div>

                            <div className="col-span-3">
                                <FormSelect
                                    name="exclusions"
                                    control={control}
                                    errors={errors}
                                    options={EXCLUSION_OPTIONS}
                                    placeholder="Exclusions"
                                    isMulti={true}
                                    isClearable={true}
                                />
                            </div>
                            <div className="col-span-6">
                                <FormRichTextarea name="exit_conditions" control={control} errors={errors}
                                                  placeholder="Exit Conditions"/>
                            </div>

                            <div className="col-span-6">
                                <FormRichTextarea name="exit_obligations" control={control} errors={errors}
                                                  placeholder="Exit Obligations"/>
                            </div>
                            <div className="col-span-12">
                                <GalleryUpload
                                    currentValue={slaData?.attachment_ids}
                                    files={slaData?.attachments}
                                    inputName="attachment_ids"
                                    placeholder="Select Attachments"
                                    control={control}
                                    errors={errors}
                                />
                            </div>

                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end">
                        <FormButton isLoading={isSubmitting} label={isEditMode ? "Update SLA" : "Create SLA"}/>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ITGovernForm;
