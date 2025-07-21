// EquipmentRepairFormModal.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@modules/inventory/models/components/Modal.jsx';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";
import FormButton from "@components/form/FormButton.jsx";
import { equipmentRepairSchema } from "@modules/inventory/schemas/equipmentRepairSchema";
import { useRepairForm } from "@modules/inventory/hooks/inventoryRepairHooks.js";

const EquipmentRepairFormModal = ({
                                      isOpen,
                                      onClose,
                                      equipmentId,
                                      repairData = null,
                                      onSuccess
                                  }) => {
    const isEditMode = Boolean(repairData);
    const [isSubmitting, setIsSubmitting] = useState(false);
console.log(`repair data`,repairData)
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors, isDirty }
    } = useForm({
        resolver: zodResolver(equipmentRepairSchema),
        defaultValues: {
            issue_description: "",
            repair_cost: 0,
            pr_po_number: "",
            repair_date: new Date().toISOString().split('T')[0],
            turnaround_time: 1,
            vendor_details: "",
            status: "open",
            attachment_ids: []
        }
    });

    const { handleRepairSubmit } = useRepairForm(
        equipmentId,
        repairData,
        (response) => {
            onSuccess?.(response);
            onClose();
            reset();
        }
    );

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await handleRepairSubmit(data);
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (isOpen && repairData) {
            reset({
                ...repairData,
                repair_date: repairData.repair_date?.split('T')[0] || new Date().toISOString().split('T')[0],
                attachment_ids: repairData.attachments?.map(a => a.id) || []
            });
        } else if (isOpen) {
            reset({
                issue_description: "",
                repair_cost: 0,
                pr_po_number: "",
                repair_date: new Date().toISOString().split('T')[0],
                turnaround_time: 1,
                vendor_details: "",
                status: "open",
                attachment_ids: []
            });
        }
    }, [isOpen, repairData, reset]);

    // Fix for background scrolling
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.width = "100%";
        } else {
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        }

        return () => {
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? "Edit Repair" : "Create Repair"}
            width="max-w-4xl"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Repair Details - 4 column grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-2">
                        <FormInput
                            name="vendor_details"
                            control={control}
                            errors={errors}
                            placeholder="Vendor name and contact"
                            label="Vendor Details"
                        />
                    </div>
                    <div>
                        <FormInput
                            type="number"
                            name="repair_cost"
                            control={control}
                            errors={errors}
                            placeholder="Repair Cost"
                            label="Repair Cost"
                            step="0.01"
                            min="0"
                        />
                    </div>
                    <div>
                        <FormInput
                            name="pr_po_number"
                            control={control}
                            errors={errors}
                            placeholder="PR/PO Number"
                            label="PR/PO Number"
                        />
                    </div>
                    <div>
                        <FormInput
                            type="date"
                            name="repair_date"
                            control={control}
                            errors={errors}
                            label="Repair Date"
                            placeholder="Repair Date"
                            is_required={true}
                        />

                    </div>
                    <div>
                        <FormInput
                            type="number"
                            name="turnaround_time"
                            control={control}
                            errors={errors}
                            placeholder="Days"
                            label="Turnaround Time"
                            min="1"
                            is_required={true}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <FormSelect
                            name="status"
                            control={control}
                            errors={errors}
                            options={[
                                { value: "open", label: "Open" },
                                { value: "in_progress", label: "In Progress" },
                                { value: "closed", label: "Closed" }
                            ]}
                            is_required
                            placeholder="Repair Status"
                        />
                    </div>
                </div>

                {/* Issue Description (moved to end before attachments) */}
                <div>
                    <FormTextarea
                        name="issue_description"
                        control={control}
                        errors={errors}
                        placeholder="Describe the issue in detail"
                        rows={4}
                        is_required={true}
                        label="Issue Description"
                    />
                </div>

                {/* Attachments */}
                <div>
                    <GalleryUpload
                        inputName="attachment_ids"
                        placeholder="Select Attachments"
                        control={control}
                        errors={errors}
                        currentValue={repairData?.attachments?.map(a => a.id) || []}
                        files={repairData?.attachments || []}
                        label="Repair Attachments"
                    />
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="ti-btn ti-btn-light ti-btn-wave"
                    >
                        Cancel
                    </button>
                    <FormButton
                        isLoading={isSubmitting}
                        text={isEditMode ? "Update Repair" : "Submit Repair"}
                        disabled={!isDirty && isEditMode}
                        className="ti-btn-primary"
                    />
                </div>
            </form>
        </Modal>
    );
};

EquipmentRepairFormModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    equipmentId: PropTypes.number.isRequired,
    repairData: PropTypes.object,
    onSuccess: PropTypes.func,
};

EquipmentRepairFormModal.defaultProps = {
    repairData: null,
    onSuccess: () => {},
};

export default EquipmentRepairFormModal;