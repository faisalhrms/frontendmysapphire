import React, { useState, useEffect } from "react";
import ExecutiveSummaryTable from "./ExecutiveSummaryTable.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import { formatNumberWithCommas } from "@helpers/formatters.js";
import TableOms from "../../components/SalesforceDashboard/TableOms.jsx";
import { fetchDataFromAPI, fetchDataAPI, fetchDataAPIProcess } from "../../services/salesforcedashboard_services.js";
import Model from "./Model.jsx";
import Table from "../SalesforceDashboard/Table.jsx";
import TableProcess from "../../components/SalesforceDashboard/TableProcess.jsx";

const ExecutiveForm = ({ filters, dateFrom, dateTo }) => {
    const { data, isLoading } = useFetchWithFilters('/salesforce/fetch_executive_summary/', filters, dateFrom, dateTo);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [apiData, setApiData] = useState(null);
    const [apiDatas, setApiDatas] = useState(null);
    const [apiDataprocess, setApiDataprocess] = useState(null);

    const { summary = {}, fulfilment_data = [] } = data || {};

    const fetchModalData = async (type) => {
        try {
            const validDateFrom = dateFrom || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0];
            const validDateTo = dateTo || new Date().toISOString().split("T")[0];

            let fetchedData;
            setModalType(type);

            if (type === "oms") {
                fetchedData = await fetchDataFromAPI(validDateFrom, validDateTo, filters);
                setApiData(fetchedData);
            } else if (type === "ipc") {
                fetchedData = await fetchDataAPIProcess(validDateFrom, validDateTo, filters);
                setApiDataprocess(fetchedData);
            } else if (type === "owe") {
                fetchedData = await fetchDataAPI(validDateFrom, validDateTo, filters);
                setApiDatas(fetchedData);
            }

            setShowModal(true);
        } catch (error) {
            console.error("Error fetching modal data:", error);
        }
    };

    const reconciliationData = isLoading
        ? [{ label: <LoadingSpinner />, accessor: "" }]
        : [
            { label: "Commerce Cloud", accessor: formatNumberWithCommas(summary.total_orders_cc) },
            { label: "Total - Orders in OMS", accessor: formatNumberWithCommas(summary.total_orders_summary) },
            {
                label: <span className="text-danger font-bold dark:text-gray-200 dark:bg-bodybg">Missing in OMS</span>,
                accessor: (
                    <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold dark:text-gray-200 dark:bg-bodybg"
                         onClick={() => fetchModalData("oms")}>
                        <span className="text-danger hover:underline hover:font-bold">
                            {formatNumberWithCommas(summary.missing_oms)}
                        </span>
                    </div>
                ),
            },
            { label: "Orders with Single FOs", accessor: formatNumberWithCommas(summary.orders_with_single_fo) },
            { label: "Orders with Multiple FOs", accessor: formatNumberWithCommas(summary.orders_with_multiple_fo) },
            { label: "Cancelled in OMS", accessor: formatNumberWithCommas(summary.cancelled) },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg">In-Process with Customer Care</span>,
                accessor: (
                    <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold dark:text-gray-200 dark:bg-bodybg"
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
                    <div className="p-1 rounded text-right cursor-pointer transition-all hover:font-bold dark:text-gray-200 dark:bg-bodybg"
                         onClick={() => fetchModalData("owe")}>
                        <span className="text-gray-800 hover:underline hover:font-bold dark:text-gray-200 dark:bg-bodybg">
                            {formatNumberWithCommas(summary.order_with_exception)}
                        </span>
                    </div>
                ),
            },
        ];

    const foBreakupData = isLoading
        ? [{ label: <LoadingSpinner />, accessor: "" }]
        : [
            { label: "Single FO", accessor: formatNumberWithCommas(summary.orders_with_single_fo) },
            { label: "Split-Orders with Multiple FOs", accessor: formatNumberWithCommas(summary.multi_fo_c) },
        ];

    const fulfillmentData = isLoading
        ? [{ label: <LoadingSpinner />, accessor: "" }]
        : [
            {
                label: <span style={{ fontWeight: "bold" }}>Total Parcels to Fulfill</span>,
                accessor: <span style={{ fontWeight: "bold" }}>{formatNumberWithCommas(summary.total_fo_to_fulfil)}</span>
            },
            ...fulfilment_data.map(row => ({
                label: row.status.trim(),
                accessor: formatNumberWithCommas(row.value)
            })),
            { label: <span style={{ fontWeight: "bold" }}>Reconciliation</span>, accessor: formatNumberWithCommas(summary.reconciliation) },
        ];

    return (
        <div className="flex flex-wrap md:flex-nowrap gap-6 p-2 dark:text-gray-200 dark:bg-bodybg">
            <ExecutiveSummaryTable
                title="Reconciliation CC vs OMS"
                data={reconciliationData}
                totals={["Total - Orders in OMS", formatNumberWithCommas(summary.total_order_oms)]}
                isLoading={isLoading}
            />
            <ExecutiveSummaryTable
                title="Breakup of Orders into FO (Single/Multiple)"
                data={foBreakupData}
                totals={["Total FO's to Fulfill", formatNumberWithCommas(summary.total_fo_to_fulfil)]}
                isLoading={isLoading}
            />
            <ExecutiveSummaryTable
                title="Orders Fulfillment Summary"
                data={fulfillmentData}
                totals={[]}
                isLoading={isLoading}
            />
            {showModal && (
                <Model onClose={() => setShowModal(false)}>
                    {modalType === "oms" ? (
                        <TableOms apiData={apiData} />
                    ) : modalType === "owe" ? (
                        <Table apiDatas={apiDatas} />
                    ) : modalType === "ipc" ? (
                        <TableProcess apiDataprocess={apiDataprocess} />
                    ) : null}
                </Model>
            )}
        </div>
    );
};

export default ExecutiveForm;
