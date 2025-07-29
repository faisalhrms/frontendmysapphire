import React, { useEffect } from "react";
import PropTypes from "prop-types";
import DataTable from "@components/datatable/DataTable.jsx";

const GraphDataModal = ({
                            isOpen,
                            onClose,
                            title,
                            apiEndpoint,
                            queryParams = {},
                            columns,
                            addButton = null,
                        }) => {
    // Prevent background scroll while modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const qs = new URLSearchParams(queryParams).toString();
    const apiUrl = `${apiEndpoint}${qs ? `?${qs}` : ""}`;

    return (
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-white dark:bg-gray-800 w-full h-full rounded-none shadow-xl overflow-y-auto"
            >
                {/* Close Button in Top Right */}
                <div className="flex justify-end px-4 pt-4">
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white text-2xl"
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {/* Optional Add Button */}
                {addButton && <div className="px-6 py-2">{addButton}</div>}

                {/* DataTable */}
                <div className="px-6 pb-6">
                    <DataTable
                        apiUrl={apiUrl}
                        columns={columns}
                        enableAdvancedFilters={false}
                        title={title} // ✅ passed title to DataTable
                    />
                </div>
            </div>
        </div>
    );
};

GraphDataModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    apiEndpoint: PropTypes.string.isRequired,
    queryParams: PropTypes.object,
    columns: PropTypes.array.isRequired,
    addButton: PropTypes.node,
};

export default React.memo(GraphDataModal);
