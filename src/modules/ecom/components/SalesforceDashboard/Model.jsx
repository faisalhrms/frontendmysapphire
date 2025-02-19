import React from "react";

const Modal = ({ onClose, title, children }) => {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="relative p-4 rounded-lg shadow-lg w-[1000px] h-[500px] bg-white">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button
                        className="text-xl font-bold text-gray-600 hover:text-gray-800"
                        onClick={onClose}
                    >
                        ✖
                    </button>
                </div>
                <div className="mt-4 overflow-auto max-h-[400px]">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
