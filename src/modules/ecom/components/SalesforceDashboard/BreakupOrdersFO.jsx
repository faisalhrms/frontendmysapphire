import React, { useState, useEffect } from "react";
import ExecutiveSummaryTable from "./ExecutiveSummaryTable.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const BreakupOrdersFO = ({ filters, dateFrom, dateTo }) => {

    const { data, isLoading, error } = useFetchWithFilters('/salesforce/fetch_executive_summary/', filters, dateFrom, dateTo);
    const { summary = {
        orders_with_single_fo() {

        },
        multi_fo_c() {

        },
        total_fo_to_fulfil() {

        }
    }, fulfilment_data = [] } = data || {};


    useEffect(() => {
        if (error) {
            console.error("Error occurred:", error);

        }
    }, [error]);


    const foBreakupData = isLoading
        ? [{ label: <LoadingSpinner />, accessor: "" }]
        : [
            { label: "Single FO", accessor: formatNumberWithCommas(summary.orders_with_single_fo) },
            { label: "Split-Orders with Multiple FOs", accessor: formatNumberWithCommas(summary.multi_fo_c) },
            { label: "Total FO's to Fulfill", accessor: formatNumberWithCommas(summary.total_fo_to_fulfil) },
        ];

    return (
        <ExecutiveSummaryTable
            title="Breakup of Orders into FO (Single/Multiple)"
            data={foBreakupData}
            totals={["Total FO's to Fulfill", formatNumberWithCommas(summary.total_fo_to_fulfil)]}
            isLoading={isLoading}
        />
    );
};

export default BreakupOrdersFO;
