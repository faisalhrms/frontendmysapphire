import React from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const Modal = ({ onClose, title, children, loading = false, isVisible = true }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="relative p-4 rounded-lg shadow-lg w-[1200px] bg-white max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button
                        className="text-xl font-bold text-gray-600 hover:text-gray-800"
                        onClick={onClose}
                    >
                        ✖
                    </button>
                </div>

                <div className="mt-4 pr-2">
                    {loading ? (
                        <div className="flex justify-center items-center min-h-[200px]">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        children
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;
