import React, { useState, useEffect } from "react";
import ExecutiveSummaryTable from "./ExecutiveSummaryTable.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import { formatNumberWithCommas } from "@helpers/formatters.js";
import Model from "./Model.jsx";
import BreakupOrdersFO from "../../components/SalesforceDashboard/BreakupOrdersFO.jsx"
import OrdersFulfillmentSummary from "../../components/SalesforceDashboard/OrdersFulfillmentSummary.jsx"
import EcomDatatable from "../../components/EcomSalesForce/EcomDatatable.jsx"

import {
    commerce_cloud,

    total_orders_oms,
    multiple_fo,
    single_fo,
    cancelled,
    fetchExecutiveSummary,
    ipc,
    owe,
    oms,
} from "../../services/saleapi_service.js";

const functionMap = {

    commerce_cloud,
    total_orders_oms,
    multiple_fo,
    single_fo,
    cancelled,
    ipc,
    owe,
    oms,
};

const ExecutiveForm = ({ data ,isLoading, filters, dateFrom, dateTo }) => {
    const [showModal, setShowModal] = useState(false);
    const [isModelLoading, setModelLoading] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [apiData, setApiData] = useState(null);
    const [modalTitle, setModalTitle] = useState("Dynamic Modal Title");
    const { summary = {}, fulfilment_data = [] } = data || {};


    const fetchModalData = async (type) => {
        try {
            const validDateFrom = filters?.date_from || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0];
            const validDateTo = filters?.date_to || new Date().toISOString().split("T")[0];
            let fetchedData;
            setApiData([]);
            setModalType(type);
            setShowModal(true);
            setModelLoading(true);

            const selectedFunction = functionMap[type];

            if (typeof selectedFunction === "function") {
                const res = await selectedFunction({ dateFrom: filters?.date_from, dateTo: filters?.date_to });
                setModalTitle(type.replace(/_/g, " ").toUpperCase());
                setApiData(res||[]);
            } else {
                console.log("Error: Invalid type function passed to fetchModalData");
            }


        } catch (error) {
            console.error("Error fetching modal data:", error);
        } finally {
            setModelLoading(false);
        }
    };

    const reconciliationData = isLoading
        ? [{ label: <LoadingSpinner />, accessor: "" }]
        : [
            {
                label: <span className="p-1 rounded text-right  ">Commerce Cloud</span>,
                accessor: (
                    <div className="p-1 rounded text-right  "
                         onClick={() => fetchModalData("commerce_cloud")}>
                    <span className="text-gray-800 hover:underline hover:font-bold dark:text-gray-200 dark:bg-bodybg">
                        {formatNumberWithCommas(summary.total_orders_cc)}
                    </span>
                    </div>
                ),
            },
            {
                label: <span className="p-1 rounded text-right  ">Total - Orders in OMS</span>,
                accessor: (
                    <div className="p-1 rounded text-right  "
                         onClick={() => fetchModalData("total_orders_oms")}>
                    <span className="text-gray-800 hover:underline hover:font-bold dark:text-gray-200 dark:bg-bodybg">
                        {formatNumberWithCommas(summary.total_orders_summary)}
                    </span>
                    </div>
                ),
            },
            {
                label: <span className="text-danger font-bold dark:text-gray-200 dark:bg-bodybg">Missing in OMS</span>,
                accessor: (
                    <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold dark:text-gray-900 dark:bg-bodybg"
                         onClick={() => fetchModalData("oms")}>
                        <span className="text-danger hover:underline hover:font-bold">
                            {formatNumberWithCommas(summary.missing_oms)}
                        </span>
                    </div>
                ),
            },
            {
                label: <span className=" dark:text-gray-200 dark:bg-bodybg">Orders with Single FOs</span>,
                accessor: (
                    <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold dark:text-gray-900 dark:bg-bodybg"
                         onClick={() => fetchModalData("single_fo")}>
                        <span className="text-gray-800 hover:underline hover:font-bold dark:text-gray-200 dark:bg-bodybg">
                            {formatNumberWithCommas(summary.orders_with_single_fo)}
                        </span>
                    </div>
                ),
            },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg">Orders with Multiple FOs</span>,
                accessor: (
                    <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold dark:text-gray-900 dark:bg-bodybg"
                         onClick={() => fetchModalData("multiple_fo")}>
                        <span className="text-gray-800 hover:underline hover:font-bold dark:text-gray-200 dark:bg-bodybg">
                            {formatNumberWithCommas(summary.orders_with_multiple_fo)}
                        </span>
                    </div>
                ),
            },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg">Cancelled in OMS</span>,
                accessor: (
                    <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold dark:text-gray-900 dark:bg-bodybg"
                         onClick={() => fetchModalData("cancelled")}>
                        <span className=" text-gray-800 hover:underline hover:font-bold dark:text-gray-200 dark:bg-bodybg">
                            {formatNumberWithCommas(summary.cancelled)}
                        </span>
                    </div>
                ),
            },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg">In-Process with Customer Care</span>,
                accessor: (
                    <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold dark:text-gray-900 dark:bg-bodybg"
                         onClick={() => fetchModalData("ipc")}>
                        <span className="text-gray-800 hover:underline hover:font-bold dark:text-gray-200 dark:bg-bodybg">
                            {formatNumberWithCommas(summary.in_process_with_customercare)}
                        </span>
                    </div>
                ),
            },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg">Orders with Exceptions</span>,
                accessor: (
                    <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold dark:text-gray-900 dark:bg-bodybg"
                         onClick={() => fetchModalData("owe")}>
                        <span className="text-gray-800 hover:underline hover:font-bold dark:text-gray-200 dark:bg-bodybg">
                            {formatNumberWithCommas(summary.order_with_exception)}
                        </span>
                    </div>
                ),
            },
        ];



    return (
        <div className="flex flex-wrap md:flex-nowrap gap-6 p-2 dark:text-gray-900 dark:bg-bodybg ">
            <ExecutiveSummaryTable
                title="Reconciliation CC vs OMS"
                data={reconciliationData}
                totals={["Total - Orders in OMS", formatNumberWithCommas(summary.total_order_oms)]}
                isLoading={isLoading}
            />
            <BreakupOrdersFO filters={filters} dateFrom={dateFrom} dateTo={dateTo} />
            <OrdersFulfillmentSummary filters={filters} dateFrom={dateFrom} dateTo={dateTo} />

            {showModal && (
                <Model modalType={modalType} loading={isModelLoading} onClose={() => setShowModal(false) }>
                    <EcomDatatable data={apiData} type={modalType}/>
                </Model>
            )}
        </div>
    );
};

export default ExecutiveForm;
