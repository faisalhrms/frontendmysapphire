import React, { useEffect, useState } from "react";
import AgingPendingTable from "./AgingPendingTable.jsx";
import { fetchPendingOrders } from "../../services/salesforcedashboard_services.js";
import {formatNumberWithCommas} from "@helpers/formatters.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const AgingFormComponent = () => {
    const [pendingOrdersData, setPendingOrdersData] = useState(null);

    useEffect(() => {
        const getPendingOrders = async () => {
            try {
                const data = await fetchPendingOrders();
                setPendingOrdersData(data);
            } catch (error) {
                console.error("Error fetching pending orders", error);
            }
        };
        getPendingOrders();
    }, []);

    if (!pendingOrdersData) {
        return <LoadingSpinner />;
    }


    const tables = [
        {
            title: "Pending Orders before assigning Fulfillment Order",
            headers: ["", "1-3 Days", "4-5 Days", "6-10 Days","11-20 Days", "Plus 20 Days", "Total"],
            accessor: pendingOrdersData.before_fulfilment.map(item => ({
                reason: item.reason,
                days_1_3: formatNumberWithCommas(item.days_1_3),
                days_4_5: formatNumberWithCommas(item.days_4_5),
                days_6_10: formatNumberWithCommas(item.days_6_10),
                days_11_20: formatNumberWithCommas(item.days_11_20),
                days_20_plus: formatNumberWithCommas(item.days_20_plus),
                total: formatNumberWithCommas(item.total),
            }))
        },
        {
            title: "Pending @ Warehouse level",
            headers: ["", "1-3 Days", "4-5 Days", "6-10 Days","11-20 Days", "Plus 20 Days", "Total"],
            accessor: pendingOrdersData.warehouse_level.map(item => ({
                reason: item.reason,
                days_1_3: formatNumberWithCommas(item.days_1_3),
                days_4_5: formatNumberWithCommas(item.days_4_5),
                days_6_10: formatNumberWithCommas(item.days_6_10),
                days_11_20: formatNumberWithCommas(item.days_11_20),
                days_20_plus: formatNumberWithCommas(item.days_20_plus),
                total: formatNumberWithCommas(item.total),
            }))
        },
        {
            title: "Pending Liability @ Courier",
            headers: ["", "1-3 Days", "4-5 Days", "6-10 Days", "11-20 Days", "Plus 20 Days", "Total"],
            accessor: pendingOrdersData.liability_level.map(item => ({
                reason: item.reason,
                days_1_3: formatNumberWithCommas(item.days_1_3),
                days_4_5: formatNumberWithCommas(item.days_4_5),
                days_6_10: formatNumberWithCommas(item.days_6_10),
                days_11_20: formatNumberWithCommas(item.days_11_20),
                days_20_plus: formatNumberWithCommas(item.days_20_plus),
                total: formatNumberWithCommas(item.total),
            }))
        },
        {
            title: "Return %age Performance",
            headers: ["Courier Name", "Total Picked", "Returned", "Return %"],
            accessor: pendingOrdersData.courier_level.map(item => ({
                courier_name: item.courier_name,
                total_picked: formatNumberWithCommas(item.total_picked),
                returned: formatNumberWithCommas(item.returned),
                returned_per: formatNumberWithCommas(item.returned_per),
            })),
            totals: [
                "Total",
                formatNumberWithCommas(pendingOrdersData.courier_level.reduce((acc, item) => acc + item.total_picked, 0)),
                formatNumberWithCommas(pendingOrdersData.courier_level.reduce((acc, item) => acc + item.returned, 0)),
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
