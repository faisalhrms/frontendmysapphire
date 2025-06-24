import React, { useState, useEffect } from "react";
import ExecutiveSummaryTable from "./ExecutiveSummaryTable.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import { formatNumberWithCommas } from "@helpers/formatters.js";
import Model from "@modules/ecom/components/SalesforceDashboard/Model.jsx";
import EcomDatatable from "@modules/ecom/components/EcomSalesForce/EcomDatatable.jsx";

const BreakupOrdersFO = ({ filters, dateFrom, dateTo }) => {
    const { data, isLoading, error } = useFetchWithFilters(
        "/salesforce/fetch_executive_summary/",
        filters,
        dateFrom,
        dateTo
    );

    const {
        summary = {
            orders_with_single_fo: 0,
            multi_fo_c: 0,
            total_fo_to_fulfil: 0,
        },
        fulfilment_data = [],
    } = data || {};

    const [showModal, setShowModal] = useState(false);
    const [isModalLoading, setModalLoading] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [apiData, setApiData] = useState(null);

    // useEffect(() => {
    //     if (error) {
    //         console.error("Error occurred:", error);
    //     }
    // }, [error]);

    const openModal = (type) => {
        setModalType(type);
        setShowModal(true);
        setModalLoading(true);

        setTimeout(() => {
            setApiData({ info: `Details for ${type}` });
            setModalLoading(false);
        }, 500);
    };

    const foBreakupData = isLoading
        ? [{ label: <LoadingSpinner />, accessor: "" }]
        : [
            {
                label: (
                    <div
                        onClick={() => openModal("Single FO")}
                        style={{ cursor: "pointer", width: "100%" }}
                        title="Click to open Single FO details"
                    >
                        Single FO
                    </div>
                ),
                accessor: (
                    <div
                        onClick={() => openModal("Single FO")}
                        style={{cursor: "pointer", width: "100%", textAlign: "right"}}
                        title="Click to open Single FO details"
                    >
                        <span
                            className="text-gray-800 hover:underline hover:font-bold dark:text-gray-200 dark:bg-bodybg">
                             {formatNumberWithCommas(summary.orders_with_single_fo)}
                        </span>

                    </div>
                ),
            },
            {
                label: (
                    <div
                        onClick={() => openModal("Split-Orders with Multiple FOs")}
                        style={{ cursor: "pointer", width: "100%" }}
                        title="Click to open Split-Orders details"
                    >
                        Split-Orders with Multiple FOs
                    </div>
                ),
                accessor: (
                    <div
                        onClick={() => openModal("Split-Orders with Multiple FOs")}
                        style={{cursor: "pointer", width: "100%", textAlign: "right"}}
                        title="Click to open Split-Orders details"
                    >
                         <span
                             className="text-gray-800 hover:underline hover:font-bold dark:text-gray-200 dark:bg-bodybg">
                             {formatNumberWithCommas(summary.multi_fo_c)}
                        </span>

                    </div>
                ),
            },
        ];

    return (
        <>
            <ExecutiveSummaryTable
                title="Breakup of Orders into FO (Single/Multiple)"
                data={foBreakupData}
                totals={[
                    "Total FO's to Fulfill",
                    formatNumberWithCommas(summary.total_fo_to_fulfil),
                ]}
                isLoading={isLoading}
            />

            {showModal && (
                <Model
                    modalType={modalType}
                    loading={isModalLoading}
                    onClose={() => setShowModal(false)}
                >
                    <EcomDatatable data={apiData} type={modalType} />
                </Model>
            )}
        </>
    );
};

export default BreakupOrdersFO;
