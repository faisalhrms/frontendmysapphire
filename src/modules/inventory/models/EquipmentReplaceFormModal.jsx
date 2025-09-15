import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Modal from "@modules/inventory/models/components/Modal.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@components/form/FormInput.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import GalleryUpload from "@components/GalleryUpload.jsx";
import FormButton from "@components/form/FormButton.jsx";
import ReplacedByDropdown from "@components/dropdowns/ReplacedByDropdown.jsx";
import { equipmentReplaceSchema } from "@modules/inventory/schemas/equipmentReplaceSchema";
import { useReplaceForm } from "@modules/inventory/hooks/inventoryReplaceHooks.js";

const EquipmentReplaceFormModal = ({
                                       isOpen,
                                       onClose,
                                       equipmentId,
                                       replaceData = null,
                                       onSuccess,
                                       equipmentData = []
                                   }) => {
    const isEditMode = Boolean(replaceData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors, isDirty }
    } = useForm({
        resolver: zodResolver(equipmentReplaceSchema),
        defaultValues: {
            replacement_date: new Date().toISOString().split("T")[0],
            maturity_date: "",
            replaced_by_id: undefined,
            reason_for_replacement: "",
            remarks: "",
            attachment_ids: []
        }
    });

    const { handleReplaceSubmit } = useReplaceForm(
        equipmentId,
        replaceData,
        (resp) => {
            onSuccess?.(resp);
            onClose();
            reset();
        }
    );

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await handleReplaceSubmit(data);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (isOpen && replaceData) {
            reset({
                ...replaceData,
                replacement_date: replaceData.replacement_date?.split("T")[0] || "",
                maturity_date: replaceData.maturity_date?.split("T")[0] || "",
                attachment_ids: replaceData.attachments?.map((a) => a.id) || [],
                replaced_by_id: replaceData.replaced_by?.id
            });
        } else if (isOpen) {
            reset({
                replacement_date: new Date().toISOString().split("T")[0],
                maturity_date: "",
                replaced_by_id: undefined,
                reason_for_replacement: "",
                remarks: "",
                attachment_ids: []
            });
        }
    }, [isOpen, replaceData, reset]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? "Edit Replacement" : "Create Replacement"}
            width="max-w-4xl"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="col-span-12">
                        <div className="box mb-6">

                            <div className="box-body grid grid-cols-12 gap-4">
                                {/* === Row 1: replacement_date + maturity_date + replaced_by_id === */}
                                <div className="col-span-4">
                                    <FormInput
                                        is_required={true}
                                        type="date"
                                        name="replacement_date"
                                        control={control}
                                        errors={errors}
                                        placeholder="Replacement Date"
                                        label={true}

                                    />
                                </div>

                                <div className="col-span-4">
                                    <FormInput
                                        is_required={true}
                                        name="maturity_date"
                                        type="date"
                                        control={control}
                                        errors={errors}
                                        placeholder="Maturity Date"
                                        label={true}

                                    />
                                </div>

                                <div className="col-span-4">
                                    <ReplacedByDropdown
                                        haveLabel={true}
                                        name="replaced_by_id"
                                        control={control}
                                        errors={errors}
                                        company_id={equipmentData?.company_id}
                                        defaultUser={replaceData?.replaced_by || null}
                                    />
                                </div>

                                {/* === Row 2: reason + remarks === */}
                                <div className="col-span-6">
                                    <FormTextarea
                                        name="reason_for_replacement"
                                        control={control}
                                        errors={errors}
                                        placeholder="Reason for replacement"
                                        rows={4}
                                        is_required
                                        label="Reason For Replacement"
                                    />
                                </div>

                                <div className="col-span-6">
                                    <FormTextarea
                                        name="remarks"
                                        control={control}
                                        errors={errors}
                                        placeholder="Additional remarks"
                                        rows={4}
                                        label="Remarks"
                                    />
                                </div>

                                {/* === Attachments === */}
                                <div className="col-span-12">
                                    <GalleryUpload
                                        inputName="attachment_ids"
                                        placeholder="Select Attachments"
                                        control={control}
                                        errors={errors}
                                        currentValue={replaceData?.attachments?.map((a) => a.id) || []}
                                        files={replaceData?.attachments || []}
                                        label="Replacement Attachments"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* === Submit === */}
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
                                text={isEditMode ? "Update Replacement" : "Submit Replacement"}
                                disabled={!isDirty && isEditMode}
                                className="ti-btn-primary"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

EquipmentReplaceFormModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    equipmentId: PropTypes.number.isRequired,
    replaceData: PropTypes.object,
    onSuccess: PropTypes.func,
    equipmentData: PropTypes.array
};

EquipmentReplaceFormModal.defaultProps = {
    replaceData: null,
    onSuccess: () => {},
    equipmentData: []
};

export default EquipmentReplaceFormModal;
