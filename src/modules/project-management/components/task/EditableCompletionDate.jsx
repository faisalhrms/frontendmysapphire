import React, { useState } from "react";
import { Controller } from "react-hook-form";
import ErrorMessage from "@components/form/ErrorMessage";
import { formatDate } from "@helpers/dateTime.js";
import { updateTaskCompletionDate } from "@modules/project-management/services/taskService";
import { useHasPermission } from "@modules/auth/hooks/authHooks.js";
import CompletionDateConfirmModal from "@modules/project-management/components/model/CompletionDateConfirmModal.jsx";

const EditableCompletionDate = ({ task, control, errors, minDate }) => {
    const [localValue, setLocalValue] = useState(task.completed_at);
    const [pendingValue, setPendingValue] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const canEditCompletionDate = useHasPermission("pms.change_task");
    const isEditable = canEditCompletionDate && task.status === "completed";

    const handleSave = async (value) => {
        try {
            setIsSubmitting(true);
            await updateTaskCompletionDate(task.id, value);
            setLocalValue(value);
            setShowConfirmModal(false); // close after success
        } catch (error) {
            console.error("Failed to update completion date:", error);
        } finally {
            setIsSubmitting(false);
            setPendingValue(null);
        }
    };

    if (!isEditable) {
        // Read-only mode
        return formatDate(localValue, "MMM dd, yyyy") || "";
    }

    // ✅ Ensure only date format (YYYY-MM-DD)
    const formatForInput = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toISOString().split("T")[0];
    };

    const min = formatForInput(minDate);

    return (
        <>
            <Controller
                name={`completed_at_${task.id}`}
                control={control}
                defaultValue={formatForInput(localValue)}
                render={({ field }) => {
                    const inputValue = field.value ? formatForInput(field.value) : "";

                    return (
                        <div className="flex items-center space-x-2">
                            <input
                                type="date"
                                className={`form-control w-full !rounded-sm border ${
                                    errors[`completed_at_${task.id}`] ? "!border-red" : ""
                                }`}
                                value={inputValue}
                                min={min}   // ✅ only min enforced
                                onChange={(e) => {
                                    field.onChange(e.target.value);
                                    if (e.target.value !== localValue) {
                                        setPendingValue(e.target.value);
                                    } else {
                                        setPendingValue(null);
                                    }
                                }}
                            />

                            {/* ✅ Show Check button only if date changed */}
                            {pendingValue && pendingValue !== localValue && (
                                <button
                                    type="button"
                                    className="ti-btn ti-btn-success !py-1 !px-2 !text-[0.75rem]"
                                    onClick={() => setShowConfirmModal(true)}
                                >
                                    <i className="bi bi-check-lg"></i>
                                </button>
                            )}

                            <ErrorMessage message={errors[`completed_at_${task.id}`]?.message} />
                        </div>
                    );
                }}
            />

            {/* Confirmation Modal */}
            <CompletionDateConfirmModal
                isOpen={showConfirmModal}
                isSubmitting={isSubmitting}   // ✅ pass loading state
                onConfirm={() => handleSave(pendingValue)}
                onClose={() => {
                    setShowConfirmModal(false);
                    setPendingValue(null);
                }}
            />
        </>
    );
};

export default EditableCompletionDate;
