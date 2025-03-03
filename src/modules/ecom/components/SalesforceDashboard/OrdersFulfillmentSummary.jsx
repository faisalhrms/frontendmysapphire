import React, { useState, useEffect } from "react";
import ExecutiveSummaryTable from "./ExecutiveSummaryTable.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const OrdersFulfillmentSummary = ({ filters, dateFrom, dateTo }) => {
    const validDateFrom = dateFrom || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0]; // Default to 30 days ago
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
                label: <span style={{ fontWeight: "bold" }}>Total Parcels to Fulfill</span>,
                accessor: <span style={{ fontWeight: "bold" }}>{formatNumberWithCommas(summary.total_fo_to_fulfil)}</span>
            },
            {
                label: <span style={{ fontWeight: "bold" }}>Un-Approved FOs</span>,
                accessor: <span>{formatNumberWithCommas(fulfilment_data.find(row => row.status === "Un-Approved FOs")?.value )}</span>
            },
            {
                label: <span style={{ fontWeight: "bold" }}>Approved FOs</span>,
                accessor: <span>{formatNumberWithCommas(fulfilment_data.find(row => row.status === "Approved FOs")?.value )}</span>
            },
            {
                label: <span style={{ fontWeight: "bold" }}>Dispatched but Not Picked</span>,
                accessor: <span>{formatNumberWithCommas(fulfilment_data.find(row => row.status === "Dispatched but Not Picked")?.value )}</span>
            },
            {
                label: <span style={{ fontWeight: "bold" }}>In Transit</span>,
                accessor: <span>{formatNumberWithCommas(fulfilment_data.find(row => row.status === "In transit")?.value )}</span>
            },
            {
                label: <span style={{ fontWeight: "bold" }}>Delivered</span>,
                accessor: <span>{formatNumberWithCommas(fulfilment_data.find(row => row.status === "Delivered")?.value )}</span>
            },
            {
                label: <span style={{ fontWeight: "bold" }}>Returned</span>,
                accessor: <span>{formatNumberWithCommas(fulfilment_data.find(row => row.status === "Returned")?.value )}</span>
            },
            {
                label: <span style={{ fontWeight: "bold" }}>Reconciliation</span>,
                accessor: <span>{formatNumberWithCommas(summary.reconciliation)}</span>
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
