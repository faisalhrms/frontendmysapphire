import React from "react";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { formatOptions } from "@helpers/formatters.js";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import { equipmentStatuses } from "@modules/inventory/services/inventoryService.js";
import FormTextarea from "@components/form/FormTextarea.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";
import FormButton from "@components/form/FormButton.jsx";

const InventoryForm = ({ equipmentData, control, errors, isSubmitting, handleSubmit, handleEquipmentSubmit }) => {
    return (
        <form onSubmit={handleSubmit(handleEquipmentSubmit)}>
            <div className="grid grid-cols-12 gap-4">

                <div className="col-span-12 lg:col-span-9">
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">Edit Form</div>
                        </div>
                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">
                                {/* Site Select */}
                                <div className="col-span-12 md:col-span-6">
                                    <FormAsyncSelect
                                        name="site_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Site"
                                        apiUrl="/select/sites"
                                        queryKeyBase="sites"
                                        clientSideSearch={true}
                                        preselectedOptions={formatOptions(equipmentData, 'site')}
                                    />
                                </div>

                                {/* Department Select */}
                                <div className="col-span-12 md:col-span-6">
                                    <FormAsyncSelect
                                        name="department_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Department"
                                        apiUrl="/select/departments"
                                        queryKeyBase="departments"
                                        clientSideSearch={true}
                                        preselectedOptions={formatOptions(equipmentData, 'department')}
                                    />
                                </div>

                                {/* Location Select */}
                                <div className="col-span-12 md:col-span-6">
                                    <FormAsyncSelect
                                        name="location_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Physical Location"
                                        apiUrl="/select/locations"
                                        queryKeyBase="locations"
                                        clientSideSearch={true}
                                        preselectedOptions={formatOptions(equipmentData, 'location')}
                                    />
                                </div>

                                {/* Type Select */}
                                <div className="col-span-12 md:col-span-6">
                                    <FormAsyncSelect
                                        name="type_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Type"
                                        apiUrl="/select/types"
                                        queryKeyBase="types"
                                        clientSideSearch={true}
                                        preselectedOptions={formatOptions(equipmentData, 'type')}
                                    />
                                </div>

                                {/* Asset Code */}
                                <div className="col-span-12 md:col-span-6">
                                    <FormInput
                                        name="asset_code"
                                        control={control}
                                        errors={errors}
                                        placeholder="Asset Code"
                                    />
                                </div>

                                {/* Serial No */}
                                <div className="col-span-12 md:col-span-6">
                                    <FormInput
                                        name="serial_no"
                                        control={control}
                                        errors={errors}
                                        placeholder="Serial No"
                                    />
                                </div>

                                {/* Part No */}
                                <div className="col-span-12 md:col-span-6">
                                    <FormInput
                                        type="number"
                                        name="part_no"
                                        control={control}
                                        errors={errors}
                                        placeholder="Part No"
                                    />
                                </div>

                                {/* Status Select */}
                                <div className="col-span-12 md:col-span-6">
                                    <FormSelect
                                        name="status_id"
                                        control={control}
                                        errors={errors}
                                        options={equipmentStatuses}
                                        placeholder="Status"
                                        label="Status"
                                    />
                                </div>

                                {/* Description Textarea */}
                                <div className="col-span-12 md:col-span-6">
                                    <FormTextarea
                                        name="description"
                                        control={control}
                                        errors={errors}
                                        placeholder="Description"
                                        rows={5}
                                    />
                                </div>

                                {/* Specification Textarea */}
                                <div className="col-span-12 md:col-span-6">
                                    <FormTextarea
                                        name="specs"
                                        control={control}
                                        errors={errors}
                                        placeholder="Specification"
                                        rows={5}
                                    />
                                </div>

                                {/* Gallery Upload */}
                                <div className="col-span-12">
                                    <GalleryUpload
                                        currentValue={equipmentData?.attachment_ids}
                                        files={equipmentData?.attachments}
                                        inputName="attachment_ids"
                                        placeholder="Select Attachments"
                                        control={control}
                                        errors={errors}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-2 border-t border-dashed sm:flex justify-end">
                            <FormButton isLoading={isSubmitting}/>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar with Date Fields and Custodian */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-2">
                    <div className="box flex-grow">
                        <div className="box-header">
                            <div className="box-title">Purchase Date</div>
                        </div>
                        <div className="box-body p-4">
                            <FormInput
                                type="date"
                                name="purchased_at"
                                control={control}
                                errors={errors}
                                label={false}
                                placeholder="Purchase Date"
                            />
                        </div>
                    </div>

                    <div className="box flex-grow">
                        <div className="box-header">
                            <div className="box-title">HandOver Date</div>
                        </div>
                        <div className="box-body p-4">
                            <FormInput
                                type="date"
                                name="handed_at"
                                label={false}
                                control={control}
                                errors={errors}
                                placeholder="Handover Date"
                            />
                        </div>
                    </div>

                    <div className="box flex-grow">
                        <div className="box-header">
                            <div className="box-title">Maturity Date</div>
                        </div>
                        <div className="box-body p-4">
                            <FormInput
                                type="date"
                                name="matured_at"
                                label={false}
                                control={control}
                                errors={errors}
                                placeholder="Maturity Date"
                            />
                        </div>
                    </div>

                    <div className="box flex-grow">
                        <div className="box-header">
                            <div className="box-title">Custodian</div>
                        </div>
                        <div className="box-body p-4">
                            <FormAsyncSelect
                                name="custodian_id"
                                control={control}
                                errors={errors}
                                placeholder="Custodian"
                                apiUrl="/select/users"
                                queryKeyBase="users"
                                clientSideSearch={true}
                                preselectedOptions={formatOptions(equipmentData, 'users', 'id', 'full_name')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>

    );
};

export default InventoryForm;
