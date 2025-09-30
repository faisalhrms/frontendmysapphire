import React from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { HardDrive, PlusCircle } from "lucide-react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { formatOptions, formatOptionsWithConcatenation } from "@helpers/formatters.js";
import GalleryUpload from "@components/GalleryUpload.jsx";
import { useCivilBoqTenderForm } from "@modules/civil_mgmt/tender/hooks/useCivilBoqTenderForm.js";
import FormSelect from "@components/form/FormSelect.jsx";

const CivilBoqTenderForm = ({ editMode = false, tenderId = null }) => {
    const {
        control,
        errors,
        handleSubmit,
        onSubmit,
        isSubmitting,
        formData,
    } = useCivilBoqTenderForm(editMode, tenderId);

    return (
        <>
            <IconPageHeader
                heading={editMode ? "Edit Tender" : "Add Tender"}
                description={
                    editMode
                        ? "Edit existing tender details"
                        : "Create a new tender for a BOQ"
                }
                icon={editMode ? HardDrive : PlusCircle}
            />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="xxl:col-span-8 xl:col-span-8 lg:col-span-8 sm:col-span-8 col-span-12">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Tender Info</div>
                            </div>
                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12">
                                        <FormAsyncSelect
                                            name="boq"
                                            control={control}
                                            errors={errors}
                                            placeholder="Select BOQ"
                                            apiUrl="/select/civil/boqs/"
                                            queryKeyBase="civil_boqs"
                                            preselectedOptions={formatOptions(formData, "boq_option", "value", "label")}
                                            is_required={true}
                                            isDisabled={editMode}
                                        />
                                    </div>

                                    <div className="col-span-12">
                                        <FormInput
                                            name="title"
                                            control={control}
                                            errors={errors}
                                            placeholder="Tender Title"
                                            is_required={true}
                                        />
                                    </div>

                                    <div className="xl:col-span-6 col-span-12">
                                        <FormInput
                                            type="date"
                                            name="started_at"
                                            control={control}
                                            errors={errors}
                                            placeholder="Start Date"
                                            is_required={true}
                                        />
                                    </div>
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormInput
                                            type="date"
                                            name="ended_at"
                                            control={control}
                                            errors={errors}
                                            placeholder="End Date"
                                            is_required={true}
                                        />
                                    </div>

                                    <div className="col-span-12">
                                        <FormTextarea
                                            name="description"
                                            control={control}
                                            errors={errors}
                                            placeholder="Description"
                                            rows={5}
                                            is_required={true}
                                        />
                                    </div>

                                    <div className="col-span-12">
                                        <GalleryUpload
                                            currentValue={formData?.attachments}
                                            files={formData?.attached_attachments}
                                            inputName="attachments"
                                            placeholder="Select Attachments"
                                            control={control}
                                            errors={errors}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-dashed dark:border-defaultborder/10 sm:flex justify-end">
                                <FormButton isLoading={isSubmitting} />
                            </div>
                        </div>
                    </div>

                    <div className="xxl:col-span-4 xl:col-span-4 lg:col-span-4 sm:col-span-4 col-span-12 sticky top-0 self-start">
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Vendors</div>
                            </div>
                            <div className="box-body">
                                <FormAsyncSelect
                                    label={false}
                                    name="vendors"
                                    isMulti={true}
                                    control={control}
                                    errors={errors}
                                    placeholder="Select Vendors"
                                    apiUrl="/select/users-by-role/?role=civil_vendors"
                                    queryKeyBase="users_by_role"
                                    preselectedOptions={formatOptionsWithConcatenation(
                                        formData,
                                        "vendor_option",
                                        "id",
                                        ["full_name", "email"]
                                    )}
                                />
                            </div>
                        </div>

                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Status</div>
                            </div>
                            <div className="box-body">
                                <FormSelect
                                    label={false}
                                    name="status"
                                    control={control}
                                    errors={errors}
                                    placeholder="Select Status"
                                    options={[
                                        { value: "draft", label: "Draft" },
                                        { value: "open", label: "Open" },
                                    ]}
                                    is_required={true}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default CivilBoqTenderForm;
