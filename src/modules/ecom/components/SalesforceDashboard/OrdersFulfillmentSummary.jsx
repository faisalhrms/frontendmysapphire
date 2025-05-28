import React, { useState, useEffect } from "react";
import ExecutiveSummaryTable from "./ExecutiveSummaryTable.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const OrdersFulfillmentSummary = ({ filters, dateFrom, dateTo }) => {
    const validDateFrom = dateFrom || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0];
    const validDateTo = dateTo || new Date().toISOString().split("T")[0];


    const { data, isLoading } = useFetchWithFilters('/salesforce/fetch_executive_summary/', filters, dateFrom, dateTo);
    const { summary = {
        reconciliation() {

        }
    }, fulfilment_data = [] } = data || {};

    const fulfillmentData = isLoading
        ? [{ label: <LoadingSpinner />, accessor: "" }]
        : [
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg">Total Parcels to Fulfill</span>,
                accessor: <span className="dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(summary.total_fo_to_fulfil)}</span>
            },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg">Un-Approved FOs</span>,
                accessor: <span className="dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(fulfilment_data.find(row => row.status === "Un-Approved FOs")?.value )}</span>
            },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg" >Approved FOs</span>,
                accessor: <span className="dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(fulfilment_data.find(row => row.status === "Approved FOs")?.value )}</span>
            },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg">Dispatched but Not Picked</span>,
                accessor: <span className="dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(fulfilment_data.find(row => row.status === "Dispatched but Not Picked")?.value )}</span>
            },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg">In Transit</span>,
                accessor: <span className="dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(fulfilment_data.find(row => row.status === "In transit")?.value )}</span>
            },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg">Delivered</span>,
                accessor: <span className="dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(fulfilment_data.find(row => row.status === "Delivered")?.value )}</span>
            },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg">Returned</span>,
                accessor: <span className="dark:text-gray-200 dark:bg-bodybg">{formatNumberWithCommas(fulfilment_data.find(row => row.status === "Returned")?.value )}</span>
            },
            {
                label: <span className="dark:text-gray-200 dark:bg-bodybg font-bold" >Reconciliation</span>,
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
