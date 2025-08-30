import React, { useState } from "react";
import { Controller } from "react-hook-form";
import ErrorMessage from "@components/form/ErrorMessage";
import { formatDate, formatDateTimeLocal } from "@helpers/dateTime.js";
import { updateTaskCompletionDate } from "@modules/project-management/services/taskService";
import { useHasPermission } from "@modules/auth/hooks/authHooks.js";
import CompletionDateConfirmModal from "@modules/project-management/components/model/CompletionDateConfirmModal.jsx";

const EditableCompletionDate = ({ task, control, errors }) => {
    const [localValue, setLocalValue] = useState(task.completed_at);
    const [pendingValue, setPendingValue] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const canEditCompletionDate = useHasPermission("pms.change_task");
    const isEditable = canEditCompletionDate && task.status === "completed";

    const handleSave = async (value) => {
        try {
            await updateTaskCompletionDate(task.id, value);
            setLocalValue(value);
        } catch (error) {
            console.error("Failed to update completion date:", error);
        }
    };

    const handleBlur = (field) => {
        if (field.value !== localValue) {
            setPendingValue(field.value);
            setShowConfirmModal(true); // open confirm modal
        }
    };

    if (!isEditable) {
        // Read-only mode
        return formatDate(localValue, "MMM dd, yyyy") || "";
    }

    return (
        <>
            <Controller
                name={`completed_at_${task.id}`}
                control={control}
                defaultValue={localValue}
                render={({ field }) => {
                    let inputValue = field.value || "";
                    if (inputValue) {
                        inputValue = formatDateTimeLocal(inputValue);
                    }

                    return (
                        <div className="flex items-center space-x-2">
                            <input
                                type="datetime-local"
                                className={`form-control w-full !rounded-sm border ${
                                    errors[`completed_at_${task.id}`] ? "!border-red" : ""
                                }`}
                                value={inputValue}
                                onChange={(e) => field.onChange(e.target.value)}
                                onBlur={() => handleBlur(field)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleBlur(field);
                                    }
                                }}
                            />
                            <ErrorMessage message={errors[`completed_at_${task.id}`]?.message} />
                        </div>
                    );
                }}
            />

            {/* Confirmation Modal */}
            <CompletionDateConfirmModal
                isOpen={showConfirmModal}
                onConfirm={() => {
                    handleSave(pendingValue);
                    setPendingValue(null);
                    setShowConfirmModal(false);
                }}
                onClose={() => {
                    setPendingValue(null);
                    setShowConfirmModal(false);
                }}
            />
        </>
    );
};

export default EditableCompletionDate;
