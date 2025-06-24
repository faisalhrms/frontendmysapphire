import React, { useState, useEffect } from "react";
import ExecutiveSummaryTable from "./ExecutiveSummaryTable.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const OrdersFulfillmentSummary = ({ filters, dateFrom, dateTo }) => {
    const validDateFrom = dateFrom || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0];
    const validDateTo = dateTo || new Date().toISOString().split("T")[0];

    const { data, isLoading } = useFetchWithFilters('/salesforce/fetch_executive_summary/', filters, dateFrom, dateTo);
    const { summary = { reconciliation() {} }, fulfilment_data = [] } = data || {};

    const fulfillmentData = isLoading
        ? [{ label: <LoadingSpinner />, accessor: "" }]
        : [
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg">Total Parcels to Fulfill</span>,
                accessor: <span className="dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(summary.total_fo_to_fulfil)}</span>
            },
            ...fulfilment_data.map(row => ({
                label: <span className="dark:text-gray-200 dark:bg-bodybg">{row.status}</span>,
                accessor: <span className="dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(row.value)}</span>
            })),
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg font-bold  sticky left-0 z-20"  >Reconciliation</span>,
                accessor: <span className="dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(summary.reconciliation)}</span>
            }
        ];



    return (
        <ExecutiveSummaryTable
            title="Orders Fulfillment Summary"
            data={fulfillmentData}
            totals={[]}
            isLoading={isLoading}


        />
    );
};

export default OrdersFulfillmentSummary;
