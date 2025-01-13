import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";
import { formatOptions } from "@helpers/formatters.js";
import { equipmentStatuses } from "@modules/inventory/services/inventoryService.js";
import equipmentSchema from "@modules/inventory/schemas/equipmentSchema.js";
import { useEquipmentForm } from "@modules/inventory/hooks/inventoryHooks.js";


import SubEquipmentTable from "./SubEquipmentTable.jsx";

const EquipmentForm = ({ equipmentData, isEditMode = false }) => {

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm({
        resolver: zodResolver(equipmentSchema),
        defaultValues: {
            ...equipmentData,
            sub_equipments: equipmentData?.sub_equipments || [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "sub_equipments",
    });

    const { handleEquipmentSubmit } = useEquipmentForm(equipmentData, isEditMode);

    useEffect(() => {
        if (equipmentData) {
            Object.keys(equipmentData).forEach((key) => {
                setValue(key, equipmentData[key]);
            });
        }
    }, [equipmentData, setValue]);

    return (
        <form onSubmit={handleSubmit(handleEquipmentSubmit)}>
            <div className="grid grid-cols-12 gap-x-6 md:flex">
                <div className="xxl:col-span-9 col-span-12">
                      <div className="box">
                        <div className="box-header">
                            <div className="box-title">Equipment Info</div>
                        </div>
                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">
                                {/* ---------- Site ---------- */}
                                <div className="xl:col-span-4 col-span-12">
                                    <FormAsyncSelect
                                        name="equipment_site_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Site"
                                        apiUrl="/select/locations/"
                                        queryKeyBase="locations"
                                        clientSideSearch={true}
                                        preselectedOptions={formatOptions(
                                            equipmentData,
                                            "equipment_site"
                                        )}
                                    />
                                </div>

                                {/* ---------- Department ---------- */}
                                <div className="xl:col-span-4 col-span-12">
                                    <FormAsyncSelect
                                        name="department_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Department"
                                        apiUrl="/select/departments"
                                        queryKeyBase="departments"
                                        clientSideSearch={true}
                                        preselectedOptions={formatOptions(
                                            equipmentData,
                                            "department",
                                            "id",
                                            "name"
                                        )}
                                    />
                                </div>

                                {/* ---------- Location ---------- */}
                                <div className="xl:col-span-4 col-span-12">
                                    <FormAsyncSelect
                                        name="location_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Physical Location"
                                        apiUrl="/select/equipment/locations/"
                                        queryKeyBase="locations"
                                        clientSideSearch={true}
                                        preselectedOptions={formatOptions(
                                            equipmentData,
                                            "location",
                                            "id",
                                            "name"
                                        )}
                                        saveOptionEndpoint="/select/equipment/location/"
                                        allowSaveNewOption={true}
                                    />
                                </div>

                                {/* ---------- Code ---------- */}
                                <div className="xl:col-span-4 col-span-12">
                                    <FormInput
                                        type="number"
                                        name="code"
                                        control={control}
                                        errors={errors}
                                        placeholder="Code"
                                    />
                                </div>

                                {/* ---------- Type ---------- */}
                                <div className="xl:col-span-4 col-span-12">
                                    <FormAsyncSelect
                                        name="equipment_type_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Type"
                                        apiUrl="/select/equipment/types/"
                                        queryKeyBase="types"
                                        clientSideSearch={true}
                                        preselectedOptions={formatOptions(
                                            equipmentData,
                                            "equipment_type",
                                            "id",
                                            "name"
                                        )}
                                        saveOptionEndpoint="/select/equipment/type/"
                                        allowSaveNewOption={true}
                                    />
                                </div>

                                {/* ---------- Asset Code ---------- */}
                                <div className="xl:col-span-4 col-span-12">
                                    <FormInput
                                        name="asset_code"
                                        control={control}
                                        errors={errors}
                                        placeholder="Asset Code"
                                    />
                                </div>

                                {/* ---------- Serial No ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormInput
                                        name="serial_no"
                                        control={control}
                                        errors={errors}
                                        placeholder="Serial No"
                                    />
                                </div>

                                {/* ---------- Part No ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormInput
                                        name="part_no"
                                        control={control}
                                        errors={errors}
                                        placeholder="Part No"
                                    />
                                </div>

                                {/* ---------- Status ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormSelect
                                        name="status"
                                        control={control}
                                        errors={errors}
                                        placeholder="Status"
                                        options={equipmentStatuses}
                                        label="Status"
                                    />
                                </div>

                                {/* ---------- Custodian ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormAsyncSelect
                                        name="custodian_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Custodian"
                                        apiUrl="/select/users"
                                        queryKeyBase="users"
                                        clientSideSearch={true}
                                        preselectedOptions={formatOptions(
                                            equipmentData,
                                            "custodian",
                                            "id",
                                            "full_name"
                                        )}
                                    />
                                </div>

                                {/* ---------- Description ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormTextarea
                                        name="description"
                                        control={control}
                                        errors={errors}
                                        placeholder="Description"
                                        rows={5}
                                    />
                                </div>

                                {/* ---------- Specs ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormTextarea
                                        name="specs"
                                        control={control}
                                        errors={errors}
                                        placeholder="Specification"
                                        rows={5}
                                    />
                                </div>

                                {/* ---------- Attachments ---------- */}
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
                        <div className="px-6 py-4 border-t border-dashed sm:flex justify-end">
                            <FormButton isLoading={isSubmitting} />
                        </div>
                    </div>


                    <SubEquipmentTable
                        fields={fields}
                        append={append}
                        remove={remove}
                        control={control}
                        errors={errors}
                    />
                </div>

                {/* ====================== RIGHT SECTION (Dates) ====================== */}
                <div className="xxl:col-span-3 col-span-12">
                    {/* Purchase Date */}
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">Purchase Date</div>
                        </div>
                        <div className="box-body">
                            <FormInput
                                type="date"
                                name="purchase_date"
                                control={control}
                                errors={errors}
                                label={false}
                                placeholder="Purchase Date"
                            />
                        </div>
                    </div>

                    {/* Handover Date */}
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">HandOver Date</div>
                        </div>
                        <div className="box-body">
                            <FormInput
                                type="date"
                                name="handover_date"
                                label={false}
                                control={control}
                                errors={errors}
                                placeholder="Handover Date"
                            />
                        </div>
                    </div>

                    {/* Maturity Date */}
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">Maturity Date</div>
                        </div>
                        <div className="box-body">
                            <FormInput
                                type="date"
                                name="maturity_date"
                                label={false}
                                control={control}
                                errors={errors}
                                placeholder="Maturity Date"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default EquipmentForm;
