import React, { useEffect, useState } from "react";
import ExecutiveSummaryTable from "./ExecutiveSummaryTable.jsx";
import { fetchExecutiveSummary } from "../../services/salesforcedashboard_services.js";

const ExecutiveForm = () => {
    const [summaryData, setSummaryData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchExecutiveSummary();
                setSummaryData(data || {});
            } catch (error) {
                console.error("Error fetching executive summary:", error);
            }
        };
        fetchData();
    }, []);


    const reconciliationData = [
        { label: "Total Orders CC", accessor: summaryData.total_orders_cc || "28446" },
        { label: "Total Orders Summary", accessor: summaryData.total_orders_summary || "28437" },
        {
            label: <span style={{ color: "red", fontWeight: "bold" }}>Missing in OMS</span>,
            accessor: (
                <div style={{ padding: "5px", borderRadius: "4px", textAlign: "right" }}>
                    <span style={{ color: "red"}}>{summaryData.missing_oms || "9"}</span>
                </div>
            )
        },
        { label: "", accessor: "" },
        { label: "Orders with Single FO", accessor: summaryData.orders_with_single_fo || "28260" },
        { label: "Orders with Multiple FO", accessor: summaryData.orders_with_multiple_fo || "135" },
        { label: "Cancelled", accessor: summaryData.cancelled || "69" },
        { label: "In-Process with Customer Care", accessor: summaryData.in_process_with_customercare || "4" },
        { label: "Orders with Exception", accessor: summaryData.order_with_exception || "17" },
    ];


    const foBreakupData = [
        { label: "Orders with Single FO", accessor: summaryData.orders_with_single_fo || "28260" },
        { label: "Multi FO Count", accessor: summaryData.multi_fo_c || "135" },
    ];

    const fulfillmentData = [
        {
            label: <span style={{ fontWeight: "bold" }}>Total Parcels to Fulfill</span>,
            accessor: summaryData.total_fo_to_fulfil
                ? <span style={{ fontWeight: "bold" }}>{String(summaryData.total_fo_to_fulfil)}</span>
                : "28486"
        },
        { label: "Un-Approved FO's ", accessor: String(summaryData["Un-Approved FOs"] || "499") },
        { label: "Approved for Fulfillment ", accessor: String(summaryData["Approved FOs"] || "2041") },
        { label: "Shipped in OMS but unpicked ", accessor: String(summaryData["Shipped in OMS But not in courier_tracking"] || "642") },
        { label: "In-Transit with Courier", accessor: String(summaryData["In transit"] || "7030") },
        { label: "Delivered to Customers", accessor: String(summaryData["Deliverd"] || "19363") },

        { label: "Reconciliation", accessor: String(summaryData.reconciliation || "-285") }
    ];


    return (
        <div className="flex flex-wrap md:flex-nowrap gap-6 p-2">
            <ExecutiveSummaryTable
                title="Reconciliation CC vs OMS"
                data={reconciliationData}
                totals={["Total - Orders in OMS", summaryData.total_order_oms || "28486"]}
            />

            <ExecutiveSummaryTable
                title="Breakup of Orders into FO (Single/Multiple)"
                data={foBreakupData}
                totals={["Total FO's to Fulfill", summaryData.total_fo_to_fulfil || "28486"]}
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
