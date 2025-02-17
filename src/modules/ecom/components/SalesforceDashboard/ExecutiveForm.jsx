// import React, { useEffect, useState } from "react";
// import ExecutiveSummaryTable from "./ExecutiveSummaryTable.jsx";
// import { fetchExecutiveSummary } from "../../services/salesforcedashboard_services.js"
//
// const ExecutiveForm = () => {
//     const [summaryData, setSummaryData] = useState({});
//
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const data = await fetchExecutiveSummary();
//                 setSummaryData(data || {});
//             } catch (error) {
//                 console.error("Error fetching executive summary:", error);
//             }
//         };
//         fetchData();
//     }, []);
//     const reconciliationHeaders = ["Category", "Count"];
//     const reconciliationData = [
//         { label: "Total Orders CC", accessor: summaryData.total_orders_cc || "28446" },
//         { label: "Total Orders Summary", accessor: summaryData.total_orders_summary || "28437" },
//         {
//             label: <span style={{ color: "red", fontWeight: "bold"  }}>Missing in OMS</span>,
//             accessor: (
//                 <div style={{ backgroundColor: "red", padding: "5px", borderRadius: "4px", textAlign: "center" }}>
//                     <span style={{ color: "black",fontWeight: "bold"  }}>{summaryData.missing_oms || "9"}</span>
//                 </div>
//             )
//         },
//         { label: "", accessor: "" },
//         { label: "Orders with Single FO", accessor: summaryData.orders_with_single_fo || "28260" },
//         { label: "Orders with Multiple FO", accessor: summaryData.orders_with_multiple_fo || "135" },
//         { label: "Cancelled", accessor: summaryData.cancelled || "69" },
//         { label: "In-Process with Customer Care", accessor: summaryData.in_process_with_customercare || "4" },
//         { label: "Orders with Exception", accessor: summaryData.order_with_exception || "17" },
//     ];
//     const foBreakupHeaders = ["Type", "Count"];
//     const foBreakupData = [
//         { label: "Orders with Single FO", accessor: summaryData.orders_with_single_fo || "28260" },
//         { label: "Multi FO Count", accessor: summaryData.multi_fo_c || "135" },
//     ];
//     const fulfillmentHeaders = ["Status", "Count"];
//     const fulfillmentData = [
//         {
//             label: <span style={{ fontWeight: "bold" }}>Total Parcels to Fulfill</span>,
//             accessor: <span style={{ fontWeight: "bold" }}>20,178</span>
//         },
//
//         { label: "Un-Approved FO's (Note-2)", accessor: "2" },
//         { label: "Approved for Fulfillment (Note-2)", accessor: "900" },
//         { label: "Shipped in OMS but unpicked (Note-3)", accessor: "593" },
//         { label: "In-Transit with Courier (Note-3)", accessor: "5703" },
//         { label: "Delivered to Customers", accessor: "12,784" },
//         { label: "Returns by Courier", accessor: "196" },
//     ];
//
//     return (
//         <div className="flex flex-wrap md:flex-nowrap gap-6 p-2">
//             <ExecutiveSummaryTable
//                 title="Reconciliation CC vs OMS"
//                 headers={reconciliationHeaders}
//                 data={reconciliationData}
//                 totals={["Total - Orders in OMS", summaryData.total_order_oms || "28486"]}
//             />
//             <ExecutiveSummaryTable
//                 title="Breakup of Orders into FO (Single/Multiple)"
//                 headers={foBreakupHeaders}
//                 data={foBreakupData}
//                 totals={["Total FO's to Fulfill", summaryData.total_fo_to_fulfil || "28486"]}
//             />
//             <ExecutiveSummaryTable
//                 title="Orders Fulfillment Summary"
//                 headers={fulfillmentHeaders}
//                 data={fulfillmentData}
//                 totals={[]}
//             />
//         </div>
//     );
// };
//
// export default ExecutiveForm;
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
                <div style={{ backgroundColor: "red", padding: "5px", borderRadius: "4px", textAlign: "center" }}>
                    <span style={{ color: "black", fontWeight: "bold" }}>{summaryData.missing_oms || "9"}</span>
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

    // FO Breakup Data (Without Headers)
    const foBreakupData = [
        { label: "Orders with Single FO", accessor: summaryData.orders_with_single_fo || "28260" },
        { label: "Multi FO Count", accessor: summaryData.multi_fo_c || "135" },
    ];


    const fulfillmentData = [
        {
            label: <span style={{ fontWeight: "bold" }}>Total Parcels to Fulfill</span>,
            accessor: <span style={{ fontWeight: "bold" }}>20,178</span>
        },
        { label: "Un-Approved FO's (Note-2)", accessor: "2" },
        { label: "Approved for Fulfillment (Note-2)", accessor: "900" },
        { label: "Shipped in OMS but unpicked (Note-3)", accessor: "593" },
        { label: "In-Transit with Courier (Note-3)", accessor: "5703" },
        { label: "Delivered to Customers", accessor: "12,784" },
        { label: "Returns by Courier", accessor: "196" },
        { label: " Reconciliation ", accessor: "0" },
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
