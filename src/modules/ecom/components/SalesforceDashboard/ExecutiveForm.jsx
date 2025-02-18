
import React, { useEffect, useState } from "react";
import ExecutiveSummaryTable from "./ExecutiveSummaryTable.jsx";
import { fetchExecutiveSummary } from "../../services/salesforcedashboard_services.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const ExecutiveForm = ({ loading }) => {
    const [summaryData, setSummaryData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchExecutiveSummary();
                console.log(data);
                setSummaryData(data);
            } catch (error) {
                console.error("Error fetching executive summary:", error);
            }
        };

        fetchData();
    }, []);

    if (loading || !summaryData) {
        return <LoadingSpinner />;
    }

    const {
        summary = {},
        total_fo_to_fulfil =[] ,
        fulfilment_data = [],
    } = summaryData;

    const reconciliationData = [
        { label: "Commerce Cloud", accessor: summaryData.summary.total_orders_cc },
        { label: "Total - Orders in OMS", accessor: summaryData.summary.total_orders_summary },
        {
            label: <span style={{ color: "red", fontWeight: "bold" }}>Missing in OMS</span>,
            accessor: (
                <div style={{ padding: "5px", borderRadius: "4px", textAlign: "right" }}>
                    <span style={{ color: "red" }}>{summaryData.summary.missing_oms}</span>
                </div>
            ),
        },
        { label: "Orders with Single FOs", accessor: summaryData.summary.orders_with_single_fo },
        { label: "Orders with Multiple FOs", accessor: summaryData.summary.orders_with_multiple_fo },
        { label: "Cancelled in OMS", accessor: summaryData.summary.cancelled },
        { label: "In-Process with Customer Care", accessor: summaryData.summary.in_process_with_customercare },
        { label: "Orders with Exceptions", accessor: summaryData.summary.order_with_exception },
    ];

    const foBreakupData = [
        { label: "Single FO", accessor: summary.orders_with_single_fo },
        { label: "Split-Orders with Multiple FOs", accessor: summaryData.summary.multi_fo_c },
    ];

    const fulfillmentData = [
        {
            label: <span style={{ fontWeight: "bold" }}>Total Parcels to Fulfill</span>,
            accessor: <span style={{ fontWeight: "bold" }}>{String(summaryData.summary.total_fo_to_fulfil)}</span>
        },
        ...fulfilment_data.map(row => ({
            label: row.status.trim(),
            accessor: String(row.value)
        })),
        { label: "Reconciliation", accessor: String(summaryData.summary.reconciliation) },
    ];

    return (
        <div className="flex flex-wrap md:flex-nowrap gap-6 p-2">
            <ExecutiveSummaryTable
                title="Reconciliation CC vs OMS"
                data={reconciliationData}
                totals={["Total - Orders in OMS", summaryData.summary.total_order_oms ]}
            />
            <ExecutiveSummaryTable
                title="Breakup of Orders into FO (Single/Multiple)"
                data={foBreakupData}
                totals={["Total FO's to Fulfill", summaryData.summary.total_fo_to_fulfil ]}
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
