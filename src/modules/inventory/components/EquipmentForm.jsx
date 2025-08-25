import {useForm, useFieldArray, useWatch} from "react-hook-form";
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
import {useEquipmentForm, useVerifyEquipment} from "@modules/inventory/hooks/inventoryHooks.js";
import { CheckCircle, Loader2, ShieldCheck } from "lucide-react";
import SubEquipmentTable from "./SubEquipmentTable.jsx";
import FormCheckbox from "@components/form/FormCheckbox.jsx";
import CustodianDropdown from "@components/dropdowns/CustodianDropDown.jsx";
import {useSelector} from "react-redux";
import EquipmentRepairFormList from "@modules/inventory/views/EquipmentRepairFormList.jsx";

const EquipmentForm = ({ equipmentData, isEditMode = false }) => {
    const companyId = useSelector((state) => state.auth.user.employee.company.id);
    const { employee } = useSelector((state) => state.auth.user);
    const { verifyEquipment, isVerifying,isVerifiedSuccess, } = useVerifyEquipment();
      const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm({
        resolver: zodResolver(equipmentSchema),
        defaultValues: {
            ...equipmentData,
            company_id: equipmentData?.company_id || companyId,
            laptop_issued_as_per_policy: equipmentData?.laptop_issued_as_per_policy ?? true,
            sub_equipments: equipmentData?.sub_equipments || [],
            quantity: equipmentData?.quantity || 1,
            verified_on: equipmentData?.verified_on || null,
            verified_by: equipmentData?.verified_by || null,
        },
    });
    const verified_on = useWatch({ control, name: "verified_on" });
    const verified_by = useWatch({ control, name: "verified_by" });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "sub_equipments",
    });

    const { handleEquipmentSubmit } = useEquipmentForm(equipmentData, isEditMode);
    const status = useWatch({
        control,
        name: "status",
    });
    useEffect(() => {
        if (equipmentData) {
            Object.keys(equipmentData).forEach((key) => {
                setValue(key, equipmentData[key]);
            });
        }
    }, [equipmentData, setValue]);

    const handleVerify = async () => {
        if (!equipmentData?.id) return;
        try {
            const updatedEquipment = await verifyEquipment(equipmentData.id);
            // Update form values with new verification data
            setValue("verified", updatedEquipment.verified);
            setValue("verified_on", updatedEquipment.verified_on);
            setValue("verified_by", updatedEquipment.verified_by);
        } catch (error) {
            console.error("Verification failed:", error);
        }
    };
    return (
        <form onSubmit={handleSubmit(handleEquipmentSubmit)}>
            <div className="grid grid-cols-12 gap-x-6">
                <div className="xxl:col-span-9 col-span-12">
                      <div className="box">
                        <div className="box-header">
                            <div className="box-title">Asset Info</div>
                        </div>
                        <div className="box-body">
                            <div className="grid grid-cols-12 gap-4">
                                {/* ---------- Site ---------- */}
                                <div className="xl:col-span-4 col-span-12">
                                    <FormAsyncSelect
                                        name="equipment_site_id"
                                        is_required={true}
                                        control={control}
                                        errors={errors}
                                        placeholder="Site"
                                        apiUrl="/select/locations/"
                                        queryKeyBase="locations"
                                        clientSideSearch={false}
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
                                        is_required={true}
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
                                        is_required={true}
                                        control={control}
                                        errors={errors}
                                        placeholder="Physical Location"
                                        apiUrl="/select/equipment/locations/"
                                        queryKeyBase="locations"
                                        clientSideSearch={false}
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

                                {/*/!* ---------- Code ---------- *!/*/}
                                {/*<div className="xl:col-span-4 col-span-12">*/}
                                {/*    <FormInput*/}
                                {/*        type="number"*/}
                                {/*        name="code"*/}
                                {/*        control={control}*/}
                                {/*        errors={errors}*/}
                                {/*        placeholder="Code"*/}
                                {/*    />*/}
                                {/*</div>*/}

                                {/* ---------- Type ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormAsyncSelect
                                        name="equipment_type_id"
                                        is_required={true}
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

                                    />
                                </div>

                                {/* ---------- Asset Code ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormInput
                                        is_required={true}
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
                                        is_required={true}
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
                                {/* ---------- Quantity ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormInput
                                        name="quantity"
                                        control={control}
                                        errors={errors}
                                        placeholder="Quantity"
                                        type="number"
                                        min="1"
                                    />
                                </div>
                                {/* ---------- previous Custodian ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormInput
                                        name="previous_custodian"
                                        control={control}
                                        errors={errors}
                                        placeholder="Previous Custodian"
                                    />
                                </div>

                                {/* ---------- Custodian ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <CustodianDropdown
                                        haveLabel={true}
                                        name="custodian_id"
                                        control={control}
                                        errors={errors}
                                        data={equipmentData}
                                        onCustodianSelect={(selected) => console.log("Custodian Selected:", selected)}
                                    />

                                </div>

                                {/* ---------- Price Paid by Employee ---------- */}
                                {status === "sold_to_employee" && (
                                    <div className="xl:col-span-6 col-span-12">
                                        <FormInput
                                            name="price_paid_by_employee"
                                            control={control}
                                            errors={errors}
                                            placeholder="Price Paid by Employee"
                                            type="number"
                                        />
                                    </div>
                                )}

                                {/* ---------- Exception Approval Granted By (Grade G-15 Employee) ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormAsyncSelect
                                        name="exception_approval_granted_by_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Approval Granted By (Grade G-15)"
                                        apiUrl="/select/employees/g15/"  // API URL for G-15 employees
                                        queryKeyBase="g15_employees"
                                        clientSideSearch={true}
                                        preselectedOptions={formatOptions(equipmentData, "exception_approval_granted_by", "id", "full_name")}
                                    />
                                </div>

                                {/* ---------- Laptop Model ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormInput
                                        name="laptop_model"
                                        control={control}
                                        errors={errors}
                                        placeholder="Laptop Model"
                                    />
                                </div>

                                {/* ---------- Processor ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormInput
                                        name="processor"
                                        control={control}
                                        errors={errors}
                                        placeholder="Processor"
                                    />
                                </div>

                                {/* ---------- RAM ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormInput
                                        name="ram"
                                        control={control}
                                        errors={errors}
                                        placeholder="RAM"
                                    />
                                </div>

                                {/* ---------- Hard Disk ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormInput
                                        name="hard_disk"
                                        control={control}
                                        errors={errors}
                                        placeholder="Hard Disk"
                                    />
                                </div>

                                {/* ---------- Screen Size ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormInput
                                        name="screen_size"
                                        control={control}
                                        errors={errors}
                                        placeholder="Screen Size"
                                    />
                                </div>

                                {/* ---------- Mouse ---------- */}
                                <div className="xl:col-span-4 col-span-12">
                                    <FormInput
                                        name="mouse"
                                        control={control}
                                        errors={errors}
                                        placeholder="Mouse"
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormInput
                                        type="number"
                                        name="purchase_price"
                                        control={control}
                                        errors={errors}
                                        placeholder="Parchase Price"
                                    />
                                </div>

                                {/* ---------- Accessories ---------- */}
                                <div className="xl:col-span-4 col-span-12">
                                    <FormInput
                                        name="accessories"
                                        control={control}
                                        errors={errors}
                                        placeholder="Accessories"
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormInput
                                        name="pos_id"
                                        control={control}
                                        errors={errors}
                                        placeholder="Pos ID"
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormInput
                                        name="mac"
                                        control={control}
                                        errors={errors}
                                        placeholder="MAC Address"
                                    />
                                </div>
                                <div className="xl:col-span-4 col-span-12">
                                    <FormInput
                                        name="ip"
                                        control={control}
                                        errors={errors}
                                        placeholder="IP Address"
                                    />
                                </div>

                                {/* ---------- Description ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormTextarea
                                        is_required={true}
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
                                        is_required={true}
                                        name="specs"
                                        control={control}
                                        errors={errors}
                                        placeholder="Specification"
                                        rows={5}
                                    />
                                </div>
                                {/* ---------- remarks ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormTextarea
                                        name="remarks"
                                        control={control}
                                        errors={errors}
                                        placeholder="Remarks"
                                        rows={5}
                                    />
                                </div>

                                {/* ---------- maintenance_history ---------- */}
                                <div className="xl:col-span-6 col-span-12">
                                    <FormTextarea
                                        name="maintenance_history"
                                        control={control}
                                        errors={errors}
                                        placeholder="Maintenance History"
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
                              <FormButton isLoading={isSubmitting}/>
                          </div>
                      </div>

                    {
                        isEditMode === true && (
                            <SubEquipmentTable
                                fields={fields}
                                append={append}
                                remove={remove}
                                control={control}
                                errors={errors}
                            />
                        )
                    }



                </div>

                {/* ====================== RIGHT SECTION (Dates & Checkboxes) ====================== */}
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

                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">Warranty Expiry Date</div>
                        </div>
                        <div className="box-body">
                            <FormInput
                                type="date"
                                name="warranty_expire"
                                label={false}
                                control={control}
                                errors={errors}
                                placeholder="Warranty Expiry Date"
                            />
                        </div>
                    </div>
                    {/* Store Communication Ready Checkbox */}
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">Store Communication Ready</div>
                        </div>
                        <div className="box-body">
                            <FormCheckbox

                                name="store_comm_ready"
                                label="Store Communication Ready"
                                control={control}
                                errors={errors}
                            />
                        </div>
                    </div>

                    {/* Antivirus Checkbox */}
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">Antivirus</div>
                        </div>
                        <div className="box-body">
                            <FormCheckbox
                                name="antivirus"
                                label="Antivirus"
                                control={control}
                                errors={errors}
                            />
                        </div>
                    </div>

                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">Laptop Issued as Per Policy</div>
                        </div>
                        <div className="box-body">
                            <FormCheckbox
                                name="laptop_issued_as_per_policy"
                                label="Laptop Issued as Per Policy"
                                control={control}
                                errors={errors}
                            />
                        </div>
                    </div>
                    <div className="box">
                        <div className="box-header">
                            <div className="box-title">Asset Tag Availability</div>
                        </div>
                        <div className="box-body">
                            <FormCheckbox
                                name="asset_tag_available"
                                label="Asset Tag Available"
                                control={control}
                                errors={errors}
                            />
                        </div>
                    </div>
                    {isEditMode && (
                        <div className="box">
                            <div className="box-header">
                                <div className="box-title">Verification</div>
                            </div>
                            <div className="box-body">
                                {isVerifiedSuccess ? (
                                    <button
                                        type="button"
                                        disabled
                                        className="ti-btn ti-btn-success ti-btn-wave w-full flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        Verified
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleVerify}
                                        disabled={isVerifying}
                                        className="ti-btn ti-btn-primary-full ti-btn-wave w-full flex items-center justify-center gap-2"
                                    >
                                        {isVerifying ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck className="w-5 h-5" />
                                                Mark as Verified
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                </div>

            </div>

        </form>
    );
};

export default EquipmentForm;
