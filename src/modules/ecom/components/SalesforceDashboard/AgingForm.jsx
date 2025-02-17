
import React from "react";
import AgingPendingTable from "./AgingPendingTable.jsx";

const AgingFormComponent = () => {
    const tables = [
        {
            title: " Pending Orders before assigning Fulfillment Order",
            headers: ["Category", "1-3 Days", "4-5 Days", "11-20 Days", "Total"],
            data: [
                { category: "In-Process with CC", days1to3: "1", days4to5: "1", days11to20: "3", total: "5" },
                { category: "Other Exceptions (CN issue etc)", days1to3: "1", days4to5: "3", days11to20: "", total: "4" },
            ],
            totals: ["Total", "", "", "", "9"]
        },
        {
            title: "Pending @ Warehouse level",
            headers: ["Category", "1-3 Days", "6-10 Days", "Total"],
            data: [
                { category: "Un-Approved Orders", days1to3: "1", days6to10: "1", total: "2" },
                { category: "Approved Orders", days1to3: "899", days6to10: "1", total: "900" },
            ],
            totals: ["Total", "", "", "902"]
        },
        {
            title: "Pending Liability @ Courier",
            headers: ["Category", "1-3 Days", "4-5 Days", "6-10 Days", "11-20 Days", "Plus 20 Days", "Total"],
            data: [
                { category: "Dispatched but Not Picked", days1to3: "593", days4to5: "", days6to10: "", days11to20: "", plus20days: "", total: "593" },
                { category: "In-Transit with Courier", days1to3: "3310", days4to5: "526", days6to10: "803", days11to20: "1050", plus20days: "14", total: "5703" },
            ],
            totals: ["Total", "", "", "", "", "", "6296"]
        },
        {
            title: " Return %age Performance",
            headers: ["Courier Name", "Total Picked", "Returned", "Return %"],
            data: [
                { category: "Call Courier", totalPicked: "16,071", returned: "", returnPercentage: "" },
                { category: "FastX", totalPicked: "1,175", returned: "36", returnPercentage: "3.06%" },
                { category: "qwqer", totalPicked: "1,241", returned: "160", returnPercentage: "12.89%" },
            ],
            totals: ["Total", "18,487", "196", "1.06%"]
        }
    ];

    return (
        <div className="grid grid-cols-2 gap-4 mt-4">
            {tables.map((table, index) => (
                <AgingPendingTable key={index} title={table.title} headers={table.headers} data={table.data} totals={table.totals} />
            ))}
        </div>
    );
};

export default AgingFormComponent;
