// Modal.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default function Modal({ isOpen, onClose, title, children, width = 'max-w-3xl' }) {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black opacity-50 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Modal container */}
            <div className={`bg-white rounded-lg shadow-xl z-10 w-full ${width} max-h-[90vh] overflow-y-auto`}>
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl focus:outline-none"
                        aria-label="Close"
                    >
                        &times;
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    width: PropTypes.string, // New prop to control width
};