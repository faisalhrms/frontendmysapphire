// @modules/inventory/components/EquipmentReAssignForm.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Reuse your existing form inputs
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormButton from "@components/form/FormButton.jsx";

import { equipmentStatuses } from "@modules/inventory/services/inventoryService.js";
import { useReAssignEquipment } from "@modules/inventory/hooks/inventoryHooks.js";

import reassignSchema from "@modules/inventory/schemas/reassignSchema.js";
import CustodianDropdown from "@components/dropdowns/CustodianDropDown.jsx";

const EquipmentReAssignForm = ({ equipmentData }) => {
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(reassignSchema),
        defaultValues: {
            equipment_id: equipmentData?.id,
            new_custodian_id: equipmentData?.custodian?.id || null,
            new_department_id: equipmentData?.department?.id || null,
            new_equipment_site_id: equipmentData?.equipment_site?.id || null,
            new_location_id: equipmentData?.location?.id || null,
            new_equipment_type_id: equipmentData?.equipment_type?.id || null,
            handover_date: equipmentData?.handover_date || null,
            maturity_date: equipmentData?.maturity_date || null,
            new_status: equipmentData?.status || "brand_new",
            reason: "",
        },
    });

    const { handleReAssign } = useReAssignEquipment();

    useEffect(() => {
        if (equipmentData) {
            setValue("equipment_id", equipmentData.id);
            setValue("new_custodian_id", equipmentData.custodian?.id || null);
            setValue("new_department_id", equipmentData.department?.id || null);
            setValue("new_equipment_site_id", equipmentData.equipment_site?.id || null);
            setValue("new_location_id", equipmentData.location?.id || null);
            setValue("new_equipment_type_id", equipmentData.equipment_type?.id || null);
            setValue("handover_date", equipmentData.handover_date || null);
            setValue("maturity_date", equipmentData.maturity_date || null);
            setValue("new_status", equipmentData.status || "brand_new");
        }
    }, [equipmentData, setValue]);

    const onSubmit = async (formData) => {
        await handleReAssign(formData);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-4">
            <div className="xxl:col-span-12 col-span-12">
                <div className="box">
                    <div className="box-header">
                        <div className="box-title">Re-Assignment Form</div>
                    </div>
                    <div className="box-body">
                        <div className="grid grid-cols-12 gap-4">
                        {/* Equipment ID (hidden or read-only) */}
                        <input type="hidden" {...register("equipment_id")} />

                            <div className="xl:col-span-3 col-span-12">
                                <CustodianDropdown
                                    haveLabel={true}
                                    name="new_custodian_id"
                                    control={control}
                                    errors={errors}
                                    data={equipmentData}
                                    onCustodianSelect={(selected) => console.log("Custodian Selected:", selected)}
                                />
                            </div>

                            <div className="xl:col-span-3 col-span-12">
                                <FormAsyncSelect
                                    name="new_department_id"
                                    control={control}
                                    errors={errors}
                                    placeholder="Department"
                                    apiUrl="/select/departments"
                                    queryKeyBase="departments"
                                    clientSideSearch={true}
                                    preselectedOptions={
                                        equipmentData?.department
                                            ? [{
                                                label: equipmentData.department.name,
                                                value: equipmentData.department.id
                                            }]
                                            : []
                                    }
                                />
                            </div>

                            <div className="xl:col-span-3 col-span-12">
                                <FormAsyncSelect
                                name="new_equipment_site_id"
                                control={control}
                                errors={errors}
                                placeholder="Site"
                                apiUrl="/select/locations/"
                                queryKeyBase="locations"
                                clientSideSearch={false}
                                preselectedOptions={
                                    equipmentData?.equipment_site
                                        ? [{
                                            label: equipmentData.equipment_site.name,
                                            value: equipmentData.equipment_site.id
                                        }]
                                        : []
                                }
                            />
                        </div>

                            <div className="xl:col-span-3 col-span-12">
                                <FormAsyncSelect
                                name="new_location_id"
                                control={control}
                                errors={errors}
                                placeholder="Physical Location"
                                apiUrl="/select/equipment/locations/"
                                queryKeyBase="locations"
                                clientSideSearch={true}
                                preselectedOptions={
                                    equipmentData?.location
                                        ? [{label: equipmentData.location.name, value: equipmentData.location.id}]
                                        : []
                                }
                            />
                        </div>

                            <div className="xl:col-span-3 col-span-12">
                                <FormAsyncSelect
                                name="new_equipment_type_id"
                                control={control}
                                errors={errors}
                                placeholder="Equipment Type"
                                apiUrl="/select/equipment/types/"
                                queryKeyBase="equipment_types"
                                clientSideSearch={true}
                                preselectedOptions={
                                    equipmentData?.equipment_type
                                        ? [{
                                            label: equipmentData.equipment_type.name,
                                            value: equipmentData.equipment_type.id
                                        }]
                                        : []
                                }
                            />
                        </div>

                            <div className="xl:col-span-3 col-span-12">
                                <FormSelect
                                name="new_status"
                                control={control}
                                errors={errors}
                                placeholder="Status"
                                options={equipmentStatuses}
                                label="New Status"
                            />
                        </div>

                            <div className="xl:col-span-3 col-span-12">
                                <FormInput
                                type="date"
                                name="handover_date"
                                control={control}
                                errors={errors}
                                placeholder="Handover Date"
                            />
                        </div>

                            <div className="xl:col-span-3 col-span-12">
                                <FormInput
                                type="date"
                                name="maturity_date"
                                control={control}
                                errors={errors}
                                placeholder="Maturity Date"
                            />
                        </div>

                        <div className="col-span-12">
                            <FormTextarea
                                name="reason"
                                control={control}
                                errors={errors}
                                placeholder="Reason for Reassignment"
                                rows={3}
                            />
                        </div>

                        <div className="col-span-12 flex justify-end">
                            <FormButton isLoading={isSubmitting} label="Reassign Equipment"/>
                        </div>
                        </div>
                    </div>
                </div>
            </div>

        </form>
);
};

export default EquipmentReAssignForm;
