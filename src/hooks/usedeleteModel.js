import { useState } from "react";

function useDeleteModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleConfirm = async (onConfirm) => {
        setIsSubmitting(true);
        if (onConfirm) {
            await onConfirm();
        }
        setIsSubmitting(false);
        closeModal();
    };

    return {
        isOpen,
        isSubmitting,
        openModal,
        closeModal,
        handleConfirm
    };
}

export default useDeleteModal;
