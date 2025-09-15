import { useState } from "react";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

const useGlobalApproval = (onSuccess) => {
    const [selectedId, setSelectedId] = useState(null);
    const [actionType, setActionType] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [approvalTypeLabel, setApprovalTypeLabel] = useState("");

    const getModalType = (type) => (type === "approved" ? "success" : "danger");
    const getModalTitle = (type) => {
        const actionText = type === "approved" ? "Approve" : "Reject";
        return `${actionText} ${approvalTypeLabel}`;
    };

    const getModalMessage = (type) => {
        const actionText = type === "approved" ? "approve" : "reject";
        return `Are you sure you want to ${actionText} ${approvalTypeLabel}?`;
    };


    const getModalButtonText = (type) => (type === "approved" ? "Approve" : "Reject");

    const handleActionClick = (id, type, approvalTypeLabel) => {
        setSelectedId(id);
        setActionType(type);
        setApprovalTypeLabel(approvalTypeLabel);
        setIsModalOpen(true);
    };

    const handleSubmit = async (remarks) => {
        if (!selectedId || !actionType) return;

        setIsSubmitting(true);
        try {
            const response = await api.post(
                `/approvals/request/${selectedId}/take-action/`,
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
            Notify.error(error.response?.data?.message || 'Failed to perform action')
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

export default useGlobalApproval;
