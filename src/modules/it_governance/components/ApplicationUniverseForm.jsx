// @modules/it-governance/forms/ApplicationUniverseForm.jsx
import React, { useEffect } from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";
import ErrorMessage from "@components/form/ErrorMessage.jsx";
import { useApplicationUniverseForm } from "@modules/it_governance/hooks/useApplicationUniverseForm.js";

/**
 * Application Type options (matches ApplicationTypeChoices enum)
 */
const APPLICATION_TYPE_OPTIONS = [
    { value: "in_house", label: "In-house Developed" },
    { value: "purchased", label: "Purchased" },
    { value: "customized", label: "Customized" },
    { value: "offshore", label: "Offshore" },
];

const ApplicationUniverseForm = ({ appData = {}, isEditMode = false }) => {
    const { control, handleSubmit, errors, isSubmitting, handleApplicationSubmit, reset } =
        useApplicationUniverseForm(appData, isEditMode);

    useEffect(() => {
        if (appData && appData.id) {
            reset(); // rehydrate using hook defaults
        }
    }, [appData, reset]);

    return (
        <form onSubmit={handleSubmit(handleApplicationSubmit)}>
            <div className="grid grid-cols-12 gap-x-6">
                <div className="col-span-12">
                    {/* === Application Details === */}
                    <div className="box mb-6">
                        <div className="box-header">
                            <div className="box-title">Application Details</div>
                        </div>

                        <div className="box-body grid grid-cols-12 gap-4">
                            {/* Application Name */}
                            <div className="col-span-4">
                                <FormInput
                                    name="application_name"
                                    control={control}
                                    errors={errors}
                                    placeholder="Application Name"
                                    is_required={true}
                                />
                            </div>

                            {/* Application Ownership */}
                            <div className="col-span-4">
                                <FormInput
                                    name="application_ownership"
                                    control={control}
                                    errors={errors}
                                    placeholder="Ownership (e.g. IT Department)"
                                />
                            </div>

                            {/* Application Versions */}
                            <div className="col-span-4">
                                <FormInput
                                    name="application_versions"
                                    control={control}
                                    errors={errors}
                                    placeholder="Versions (comma-separated)"
                                />
                            </div>

                            {/* Application Type */}
                            <div className="col-span-4">
                                <FormSelect
                                    name="application_type"
                                    control={control}
                                    errors={errors}
                                    options={APPLICATION_TYPE_OPTIONS}
                                    placeholder="Application Type"
                                    is_required={true}
                                    isClearable={false}
                                />
                            </div>

                            {/* Backend Database */}
                            <div className="col-span-4">
                                <FormInput
                                    name="backend_database"
                                    control={control}
                                    errors={errors}
                                    placeholder="Backend Database (e.g. PostgreSQL 14)"
                                />
                            </div>

                            {/* Platform */}
                            <div className="col-span-4">
                                <FormInput
                                    name="platform"
                                    control={control}
                                    errors={errors}
                                    placeholder="Platform / Framework (e.g. Django + React)"
                                />
                            </div>

                            {/* Integrations */}
                            <div className="col-span-12">
                                <FormTextarea
                                    name="integrations"
                                    control={control}
                                    errors={errors}
                                    placeholder="Integrations (comma-separated)"
                                    rows={3}
                                    is_required={false}
                                    needLabel={true}
                                />
                            </div>

                            {/* Attachments */}
                            <div className="col-span-12">
                                <GalleryUpload
                                    currentValue={appData?.attachment_ids}
                                    files={appData?.attachments}
                                    inputName="attachment_ids"
                                    placeholder="Select Attachments"
                                    control={control}
                                    errors={errors}
                                />
                                <ErrorMessage message={errors.attachment_ids?.message} />
                            </div>
                        </div>
                    </div>

                    {/* === Submit === */}
                    <div className="flex justify-end">
                        <FormButton
                            isLoading={isSubmitting}
                            label={isEditMode ? "Update Application" : "Create Application"}
                        />
                    </div>
                </div>
            </div>
        </form>
    );
};

export default ApplicationUniverseForm;
