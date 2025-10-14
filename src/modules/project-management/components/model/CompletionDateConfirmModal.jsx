import React, { useState, useEffect } from "react";
import styles from "@css/custom/alert-modal.module.css";

function CompletionDateConfirmModal({
                                        id = "completion-date",
                                        type = "success",
                                        title = "Confirm Completion Date",
                                        message = "Are you sure you want to set this completion date?",
                                        btnTxt = "Confirm",
                                        isOpen = false,
                                        isSubmitting = false,
                                        onConfirm,
                                        onClose,
                                    }) {
    const [input, setInput] = useState("");

    useEffect(() => {
        if (!isOpen) {
            setInput("");
        }
    }, [isOpen]);

    const handleConfirm = () => {
        if (onConfirm) onConfirm(input);
        if (onClose) onClose(false);
    };

    const closeModal = () => {
        if (onClose) onClose(false);
    };

    if (!isOpen) return null;

    return (
        <div
            id={`${id}-modal`}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="ti-modal-body">
                    <div className={styles.tiModalContent}>
                        <div className={`alert custom-alert1 alert-${type}`}>
                            <button
                                aria-label="Close"
                                className="btn-close ms-auto"
                                type="button"
                                onClick={closeModal}
                            >
                                <i className="bi bi-x"></i>
                            </button>
                            <div className="text-center px-5 pb-0">
                                <svg
                                    className={`custom-alert-icon svg-${type} inline-flex`}
                                    fill="#000000"
                                    height="1.5rem"
                                    width="1.5rem"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path
                                        d={
                                            type === "danger"
                                                ? "M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z"
                                                : "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                                        }
                                    />
                                </svg>
                                <h5 className="text-[1.25rem] !font-medium">{title}</h5>
                                <p>{message}</p>
                                <div>
                                    <button
                                        className={`ti-btn ti-btn-${type}-full !py-1 !px-2 !text-[0.75rem] !font-medium text-white m-1 ${
                                            isSubmitting ? "ti-btn-disabled" : ""
                                        }`}
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={handleConfirm}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span
                                                    aria-label="loading"
                                                    className="ti-spinner !w-[1rem] !h-[1rem] text-white"
                                                    role="status"
                                                ></span>
                                                <span>Loading...</span>
                                            </>
                                        ) : (
                                            btnTxt
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompletionDateConfirmModal;
