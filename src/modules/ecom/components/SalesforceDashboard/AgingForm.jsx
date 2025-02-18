import React, { useEffect, useState } from "react";
import AgingPendingTable from "./AgingPendingTable.jsx";
import { fetchPendingOrders } from "../../services/salesforcedashboard_services.js";

const AgingFormComponent = () => {
    const [pendingOrdersData, setPendingOrdersData] = useState(null);

    useEffect(() => {
        const getPendingOrders = async () => {
            try {
                const data = await fetchPendingOrders();
                setPendingOrdersData(data); // Set data after fetching
            } catch (error) {
                console.error("Error fetching pending orders", error);
            }
        };
        getPendingOrders();
    }, []);

    if (!pendingOrdersData) {
        return <div>Loading...</div>;
    }


    const tables = [
        {
            title: "Pending Orders before assigning Fulfillment Order",
            headers: ["Category", "1-3 Days", "4-5 Days", "6-10 Days","11-20 Days", "Plus 20 Days", "Total"],
            accessor: pendingOrdersData.before_fulfilment.map(item => ({
                reason: item.reason,
                days_1_3: item.days_1_3,
                days_4_5: item.days_4_5,
                days_6_10: item.days_6_10,
                days_11_20: item.days_11_20,
                days_20_plus: item.days_20_plus,
                total: item.total,
            })),
            totals: [
                "Total",
                pendingOrdersData.before_fulfilment.reduce((acc, item) => acc + item.days_1_3, 0),
                pendingOrdersData.before_fulfilment.reduce((acc, item) => acc + item.days_4_5, 0),
                pendingOrdersData.before_fulfilment.reduce((acc, item) => acc + item.days_6_10, 0),
                pendingOrdersData.before_fulfilment.reduce((acc, item) => acc + item.days_11_20, 0),
                pendingOrdersData.before_fulfilment.reduce((acc, item) => acc + item.days_20_plus, 0),
                pendingOrdersData.before_fulfilment.reduce((acc, item) => acc + item.total, 0),
            ]
        },
        {
            title: "Pending @ Warehouse level",
            headers: ["Category", "1-3 Days", "4-5 Days", "6-10 Days","11-20 Days", "Plus 20 Days", "Total"],
            accessor: pendingOrdersData.warehouse_level.map(item => ({
                reason: item.reason,
                days_1_3: item.days_1_3,
                days_4_5: item.days_4_5,
                days_6_10: item.days_6_10,
                days_11_20: item.days_11_20,
                days_20_plus: item.days_20_plus,
                total: item.total,
            })),
            totals: [
                "Total",
                pendingOrdersData.warehouse_level.reduce((acc, item) => acc + item.days_1_3, 0),
                pendingOrdersData.warehouse_level.reduce((acc, item) => acc + item.days_4_5, 0),
                pendingOrdersData.warehouse_level.reduce((acc, item) => acc + item.days_6_10, 0),
                pendingOrdersData.warehouse_level.reduce((acc, item) => acc + item.days_11_20, 0),
                pendingOrdersData.warehouse_level.reduce((acc, item) => acc + item.days_20_plus, 0),
                pendingOrdersData.warehouse_level.reduce((acc, item) => acc + item.total, 0),
            ]
        },
        {
            title: "Pending Liability @ Courier",
            headers: ["Category", "1-3 Days", "4-5 Days", "6-10 Days", "11-20 Days", "Plus 20 Days", "Total"],
            accessor: pendingOrdersData.liability_level.map(item => ({
                reason: item.reason,
                days_1_3: item.days_1_3,
                days_4_5: item.days_4_5,
                days_6_10: item.days_6_10,
                days_11_20: item.days_11_20,
                days_20_plus: item.days_20_plus,
                total: item.total,
            })),
            totals: [
                "Total",
                pendingOrdersData.liability_level.reduce((acc, item) => acc + item.days_1_3, 0),
                pendingOrdersData.liability_level.reduce((acc, item) => acc + item.days_4_5, 0),
                pendingOrdersData.liability_level.reduce((acc, item) => acc + item.days_6_10, 0),
                pendingOrdersData.liability_level.reduce((acc, item) => acc + item.days_11_20, 0),
                pendingOrdersData.liability_level.reduce((acc, item) => acc + item.days_20_plus, 0),
                pendingOrdersData.liability_level.reduce((acc, item) => acc + item.total, 0),
            ]
        },
        {
            title: "Return %age Performance",
            headers: ["Courier Name", "Total Picked", "Returned", "Return %"],
            accessor: pendingOrdersData.courier_level.map(item => ({
                courier_name: item.courier_name,
                total_picked: item.total_picked,
                returned: item.returned,
                returned_per: item.returned_per,
            })),
            totals: [
                "Total",
                pendingOrdersData.courier_level.reduce((acc, item) => acc + item.total_picked, 0),
                pendingOrdersData.courier_level.reduce((acc, item) => acc + item.returned, 0),
                `${(
                    (pendingOrdersData.courier_level.reduce((acc, item) => acc + item.returned, 0) /
                        pendingOrdersData.courier_level.reduce((acc, item) => acc + item.total_picked, 0)) * 100
                ).toFixed(2)}%`
            ]
        }
    ];

    return (
        <div className="grid grid-cols-2 gap-4 mt-4">
            {tables.map((table, index) => (
                <AgingPendingTable key={index} title={table.title} headers={table.headers} data={table.accessor} totals={table.totals} />
            ))}
        </div>
    );
};

export default AgingFormComponent;
