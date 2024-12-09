import React, { useState, useEffect } from "react";

import styles from '@css/custom/alert-modal.module.css'

function AlertModal({
                        id = "task",
                        type = "danger",
                        title = "Danger",
                        message = "Are you sure you want to delete?",
                        btnTxt = "Delete",
                        isOpen = false,
                        needInput = false,
                        inputLabel = "Comments",
                        inputType = "textarea",
                        isSubmitting = false,
                        onConfirm,
                        onClose,
                    }) {
    const [input, setInput] = useState("");
    const [inputModel, setInputModel] = useState("password");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    useEffect(() => {
        handleModal(isOpen, `${id}-alert-modal`);
    }, [isOpen, id]);

    const togglePasswordVisibility = () => {
        setInputModel(inputModel === "password" ? "text" : "password");
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleConfirm = () => {
        if (onConfirm) onConfirm(input);
    };

    const closeModal = () => {
        if (onClose) onClose(false);
    };

    return (
        <div
            id={`${id}-alert-modal`}
            data-hs-overlay-keyboard="false"
            className='hs-overlay ti-modal hidden [--overlay-backdrop:static] backdrop-blur-[0.08rem]'>
            <div className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out min-h-[calc(100%-3.5rem)] flex items-center">
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
                                    viewBox="0 0 24 24"
                                    width="1.5rem"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M0 0h24v24H0z" fill="none"/>
                                    <path
                                        d={
                                            type === "danger"
                                                ? "M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z"
                                                : "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                                        }
                                    />
                                </svg>
                                <h5 className="text-[1.25rem] !font-medium">{title}</h5>
                                <p style={needInput ? {marginBottom: "0.2rem"} : {}}>
                                    {message}
                                </p>
                                {needInput && (
                                    <div className="col-span-12">
                                        <label className="form-label">{inputLabel}</label>
                                        {inputType === "textarea" && (
                                            <textarea
                                                rows="3"
                                                type="text"
                                                className="form-control"
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                            />
                                        )}
                                        {inputType === "password" && (
                                            <div className="input-group mb-1">
                                                <input
                                                    type={inputModel}
                                                    className="form-control form-control-lg !rounded-s-md"
                                                    placeholder="password"
                                                    required
                                                    value={input}
                                                    onChange={(e) => setInput(e.target.value)}
                                                />
                                                <button
                                                    id="button-addon2"
                                                    aria-label="button"
                                                    className="ti-btn ti-btn-light !mb-0 !rounded-s-none"
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                >
                                                    {isPasswordVisible ? (
                                                        <i className="ri ri-eye-line"></i>
                                                    ) : (
                                                        <i className="ri ri-eye-off-line"></i>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <div>
                                    <button
                                        className={`ti-btn ti-btn-${type}-full !py-1 !px-2 !text-[0.75rem] !font-medium text-white m-1 ${isSubmitting ? "ti-btn-disabled" : ""}`}
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={handleConfirm}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span
                                                    aria-label="loading"
                                                    className="ti-spinner !w-[1rem] !h-[1rem] text-white"
                                                    role="status">
                                                </span>
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

function handleModal(isOpen, id) {
    const modal = document.getElementById(id);
    if (modal) {
        if (isOpen) {
            window.HSOverlay.open(modal);
        } else {
            window.HSOverlay.close(modal);
        }
    }
}

export default AlertModal;
