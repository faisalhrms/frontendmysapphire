import React from "react";

const ConfirmationModal = ({ show, message, onConfirm, onCancel }) => {
    if (!show) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
            <div className="bg-white p-6 rounded shadow-lg z-60">
                <p>{message}</p>
                <div className="flex justify-end space-x-4 mt-4">
                    <button className="ti-btn ti-btn-light" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="ti-btn ti-btn-primary-full" onClick={onConfirm}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
