import React from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import useSalesForceSyncTime from "@modules/ecom/hooks/useSalesforceSyncTime.js";

const Modal = ({
                   onClose,
                   modalType,
                   children,
                   loading = false,
                   isVisible = true,
                   filters = {},
                   activeTab = "executiveSummary"
               }) => {

    const { syncTime, errorMessage, refetch } = useSalesForceSyncTime(
        '/salesforce/fetch_sync_time_cc/',
        'dd'
    );

    if (!isVisible) return null;

    let title;
    if (modalType === "oms") {
        title = "Missing in OMS";
    } else if (modalType === "owe") {
        title = "Orders with Exceptions";
    } else if (modalType === "ipc") {
        title = "In-Process with Customer Care";
    } else if (modalType === "commerce_cloud") {
        title = "Commerce Cloud";
    } else if (modalType === "total_orders_oms") {
        title = "Orders in OMS";
    } else if (modalType === "single_fo") {
        title = "Orders with Single FOs";
    } else if (modalType === "multiple_fo") {
        title = "Orders with Multiple FOs";
    } else if (modalType === "cancelled") {
        title = "Cancelled in OMS";
    } else {
        title = "Modal";
    }

    const handleModalRefresh = async () => {
        try {
            await refetch(filters, activeTab);
        } catch (error) {
            console.error("Error refreshing modal data:", error);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="relative p-4 rounded-lg shadow-lg w-[1200px] bg-white max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-lg font-semibold">{title}</h2>

                    <div className="flex items-center space-x-4">

                        {syncTime && (
                            <div className="text-primary p-2 rounded-lg text-black">
                                <p className="text-sm">{`Date: ${syncTime}`}</p>
                            </div>
                        )}


                        {errorMessage && (
                            <div className="text-red-500 p-2 rounded-lg">
                                <p className="text-sm">{errorMessage}</p>
                            </div>
                        )}



                        <button
                            className="text-xl font-bold text-gray-600 hover:text-gray-800"
                            onClick={onClose}
                        >
                            ✖
                        </button>
                    </div>
                </div>

                <div className="mt-4 pr-2 overflow-y-auto max-h-[80vh]">
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