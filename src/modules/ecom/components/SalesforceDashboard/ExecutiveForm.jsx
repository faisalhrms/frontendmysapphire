
import React, { useEffect, useState } from "react";
import ExecutiveSummaryTable from "./ExecutiveSummaryTable.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import {formatNumberWithCommas} from "@helpers/formatters.js";

const ExecutiveForm = ({ filters }) => {
    const {data, isLoading} = useFetchWithFilters('/salesforce/fetch_executive_summary/', filters);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const {
        summary = {},
        total_fo_to_fulfil =[] ,
        fulfilment_data = [],
    } = data;

    const reconciliationData = [
        { label: "Commerce Cloud", accessor: formatNumberWithCommas(summary.total_orders_cc) },
        { label: "Total - Orders in OMS", accessor: formatNumberWithCommas(summary.total_orders_summary) },
        {
            label: <span style={{ color: "red", fontWeight: "bold" }}>Missing in OMS</span>,
            accessor: (
                <div style={{ padding: "5px", borderRadius: "4px", textAlign: "right" }}>
                    <span style={{ color: "red" }}>{formatNumberWithCommas(summary.missing_oms)}</span>
                </div>
            ),
        },
        { label: "Orders with Single FOs", accessor: formatNumberWithCommas(summary.orders_with_single_fo) },
        { label: "Orders with Multiple FOs", accessor: formatNumberWithCommas(summary.orders_with_multiple_fo) },
        { label: "Cancelled in OMS", accessor: formatNumberWithCommas(summary.cancelled) },
        { label: "In-Process with Customer Care", accessor: formatNumberWithCommas(summary.in_process_with_customercare) },
        { label: "Orders with Exceptions", accessor: formatNumberWithCommas(summary.order_with_exception) },
    ];

    const foBreakupData = [
        { label: "Single FO", accessor: formatNumberWithCommas(summary.orders_with_single_fo) },
        { label: "Split-Orders with Multiple FOs", accessor: formatNumberWithCommas(summary.multi_fo_c) },
    ];

    const fulfillmentData = [
        {
            label: <span style={{ fontWeight: "bold" }}>Total Parcels to Fulfill</span>,
            accessor: <span style={{ fontWeight: "bold" }}>{ formatNumberWithCommas(summary.total_fo_to_fulfil) }</span>
        },
        ...fulfilment_data.map(row => ({
            label: row.status.trim(),
            accessor: formatNumberWithCommas(row.value)
        })),
        { label: "Reconciliation", accessor: formatNumberWithCommas(summary.reconciliation) },
    ];

    return (
        <div className="flex flex-wrap md:flex-nowrap gap-6 p-2">
            <ExecutiveSummaryTable
                title="Reconciliation CC vs OMS"
                data={reconciliationData}
                totals={["Total - Orders in OMS", formatNumberWithCommas(summary.total_order_oms) ]}
            />
            <ExecutiveSummaryTable
                title="Breakup of Orders into FO (Single/Multiple)"
                data={foBreakupData}
                totals={["Total FO's to Fulfill", formatNumberWithCommas(summary.total_fo_to_fulfil) ]}
            />
            <ExecutiveSummaryTable
                title="Orders Fulfillment Summary"
                data={fulfillmentData}
                totals={[]}
            />
        </div>
    );
};

export default ExecutiveForm;
