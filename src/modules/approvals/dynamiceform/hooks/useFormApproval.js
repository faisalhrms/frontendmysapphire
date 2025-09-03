import { useState } from "react";
import api from "@config/axiosConfig.js";

const useFormApproval = (onSuccess) => {
    const [selectedId, setSelectedId] = useState(null);
    const [actionType, setActionType] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getModalType = (type) => (type === "approved" ? "success" : "danger");
    const getModalTitle = (type) => (type === "approved" ? "Approve Form" : "Reject Form");
    const getModalMessage = (type) =>
        type === "approved"
            ? "Are you sure you want to approve this form?"
            : "Are you sure you want to reject this form?";
    const getModalButtonText = (type) => (type === "approved" ? "Approve" : "Reject");

    const handleActionClick = (id, type) => {
        setSelectedId(id);
        setActionType(type);
        setIsModalOpen(true);
    };

    const handleSubmit = async (remarks) => {
        if (!selectedId || !actionType) return;

        setIsSubmitting(true);
        try {
            const response = await api.post(
                `/forms/que/approvals/${selectedId}/take-action/`,
                {
                    action: actionType,
                    remarks,
                }
            );

            const data = response.data;
            if (!data.status) {
                throw new Error(data.message || "Unknown error occurred");
            }

            setIsModalOpen(false);
            if (onSuccess) {
                onSuccess();
            }
            return data.data;
        } catch (error) {
            console.error("Action failed:", error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        selectedId,
        actionType,
        isModalOpen,
        isSubmitting,
        getModalType,
        getModalTitle,
        getModalMessage,
        getModalButtonText,
        handleActionClick,
        handleSubmit,
        setIsModalOpen,
    };
};

export default useFormApproval;
