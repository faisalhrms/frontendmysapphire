// @modules/it-governance/forms/WarrantyForm.jsx
import React, { useEffect } from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";
import ErrorMessage from "@components/form/ErrorMessage.jsx";
import { useWarrantyForm } from "@modules/it_governance/hooks/useWarrantyForm.js";

/**
 * Warranty Period options (matches WarrantyPeriodChoices)
 */
const WARRANTY_PERIOD_OPTIONS = [
    { value: "1_month", label: "1 Month" },
    { value: "2_months", label: "2 Months" },
    { value: "3_months", label: "3 Months" },
    { value: "4_months", label: "4 Months" },
    { value: "5_months", label: "5 Months" },
    { value: "6_months", label: "6 Months" },
    { value: "7_months", label: "7 Months" },
    { value: "8_months", label: "8 Months" },
    { value: "9_months", label: "9 Months" },
    { value: "10_months", label: "10 Months" },
    { value: "11_months", label: "11 Months" },
    { value: "12_months", label: "12 Months" },
    { value: "1_year", label: "1 Year" },
    { value: "2_years", label: "2 Years" },
    { value: "na", label: "Not Applicable" },
];

/**
 * Possible exclusions (multi-select LOV)
 */
const EXCLUSION_OPTIONS = [
    { value: "Hardware Support", label: "Hardware Support" },
    { value: "Third-party Licenses", label: "Third-party Licenses" },
    { value: "Custom Development", label: "Custom Development" },
    { value: "Software Updates", label: "Software Updates" },
];

/**
 * Dispute resolution options (LOV)
 */
const DISPUTE_OPTIONS = [
    { value: "negotiation", label: "Negotiation" },
    { value: "mediation", label: "Mediation" },
    { value: "arbitration", label: "Arbitration" },
];

const WarrantyForm = ({ warrantyData = {}, isEditMode = false }) => {
    const {
        control,
        handleSubmit,
        errors,
        isSubmitting,
        handleWarrantySubmit,
        reset,
    } = useWarrantyForm(warrantyData, isEditMode);

    useEffect(() => {
        if (warrantyData && warrantyData.id) {
            reset();
        }
    }, [warrantyData, reset]);

    return (
        <form onSubmit={handleSubmit(handleWarrantySubmit)}>
            <div className="grid grid-cols-12 gap-x-6">
                <div className="col-span-12">
                    <div className="box mb-6">
                        <div className="box-header">
                            <div className="box-title">Warranty Details</div>
                        </div>

                        <div className="box-body grid grid-cols-12 gap-4">
                            {/* Vendor */}
                            <div className="col-span-4">
                                <FormInput
                                    name="vendor"
                                    control={control}
                                    errors={errors}
                                    placeholder="Vendor"
                                    is_required={true}
                                />
                            </div>

                            {/* Client */}
                            <div className="col-span-4">
                                <FormInput
                                    name="client"
                                    control={control}
                                    errors={errors}
                                    placeholder="Client"
                                    is_required={true}
                                />
                            </div>

                            {/* Equipment & Services */}
                            <div className="col-span-4">
                                <FormInput
                                    name="equipment_and_services"
                                    control={control}
                                    errors={errors}
                                    placeholder="Equipment and Services Covered"
                                    rows={3}
                                    is_required={true}
                                    needLabel={true}
                                />
                            </div>

                            {/* Warranty Period */}
                            <div className="col-span-3">
                                <FormSelect
                                    name="warranty_period"
                                    control={control}
                                    errors={errors}
                                    options={WARRANTY_PERIOD_OPTIONS}
                                    placeholder="Warranty Period"
                                    is_required={true}
                                    isClearable={false}
                                />
                            </div>

                            {/* Warranty Ends (Months) */}
                            <div className="col-span-3">
                                <FormInput
                                    name="warranty_ends"
                                    control={control}
                                    errors={errors}
                                    type="number"
                                    placeholder="Warranty Ends (Months)"
                                    is_required={true}
                                />
                            </div>
                            <div className="col-span-3">
                                <FormSelect
                                    name="exclusions"
                                    control={control}
                                    errors={errors}
                                    options={EXCLUSION_OPTIONS}
                                    placeholder="Select Exclusions"
                                    isMulti={true}
                                    is_required={false}
                                />
                            </div>
                            {/* Disputes Resolved - now LOV */}
                            <div className="col-span-3">
                                <FormSelect
                                    name="disputes_resolved"
                                    control={control}
                                    errors={errors}
                                    options={DISPUTE_OPTIONS}
                                    placeholder="Disputes Resolved"
                                    is_required={true}
                                    isClearable={false}
                                />
                            </div>

                            {/* Service Credits */}
                            <div className="col-span-6">
                                <FormTextarea
                                    name="service_credits"
                                    control={control}
                                    errors={errors}
                                    placeholder="Service Credits"
                                    rows={3}
                                />
                            </div>

                            {/* Confidentiality Protocols */}
                            <div className="col-span-6">
                                <FormTextarea
                                    name="confidentiality_protocols"
                                    control={control}
                                    errors={errors}
                                    placeholder="Confidentiality Protocols"
                                    rows={3}
                                />
                            </div>

                            {/* Exclusions (multi-select) */}


                            {/* Attachments */}
                            <div className="col-span-12">
                                <GalleryUpload
                                    currentValue={warrantyData?.attachment_ids}
                                    files={warrantyData?.attachments}
                                    inputName="attachment_ids"
                                    placeholder="Select Attachments"
                                    control={control}
                                    errors={errors}
                                />
                                <ErrorMessage message={errors.attachment_ids?.message}/>
                            </div>
                        </div>
                    </div>

                    {/* === Submit === */}
                    <div className="flex justify-end">
                        <FormButton
                            isLoading={isSubmitting}
                            label={isEditMode ? "Update Warranty" : "Create Warranty"}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
};

export default WarrantyForm;
