import React, { useState, useEffect } from "react";
import { fetchAnalysisForm } from "../services/ecom_services.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const formatNumber = (num) =>
    num !== null && num !== undefined
        ? num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
        : "0";

const formatFloat = (num) =>
    num !== null && num !== undefined
        ? num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : "0";

const formatPercentage = (num) =>
    num !== null && num !== undefined ? `${num.toFixed(2)}%` : "0";

const AnalysisConversionTable = ({ filters }) => {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setData([]);

            try {
                const response = await fetchAnalysisForm(filters);
                if (response?.cc_source_code) {
                    const formattedData = response.cc_source_code.map((item) => ({
                        group: item.source_group,
                        site: item.site,
                        activations: item.activations,
                        orders: item.orders,
                        merchandiseTotal: item.merchandise_total,
                        avgPerUsage: item.avg_mer_total_per_usage,
                        avgPerOrder: item.avg_merchandise_total_per_order,
                        itemsPerOrder: item.avg_items_per_order,
                        total_qty: item.total_qty,
                        conversion: Number(item.order_conversion),
                    }));
                    setData(formattedData);
                } else {
                    setData([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            setLoading(false);
        };

        if (filters?.date_from && filters?.date_to) {
            fetchData();
        }
    }, [JSON.stringify(filters)]);

    const totals = data.reduce((acc, row) => {
        acc.activations = (acc.activations || 0) + (Number(row.activations) || 0);
        acc.orders = (acc.orders || 0) + (Number(row.orders) || 0);
        acc.merchandiseTotal = (acc.merchandiseTotal || 0) + (Number(row.merchandiseTotal) || 0);
        acc.avgPerUsage = (acc.avgPerUsage || 0) + (Number(row.avgPerUsage) || 0);
        acc.avgPerOrder = (acc.avgPerOrder || 0) + (Number(row.avgPerOrder) || 0);
        acc.itemsPerOrder = (acc.itemsPerOrder || 0) + (Number(row.itemsPerOrder) || 0);
        acc.total_qty = (acc.total_qty || 0) + (Number(row.total_qty) || 0);
        acc.conversion = (acc.conversion || 0) + (Number(row.conversion) || 0);
        return acc;
    }, {});

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg mb-6 dark:text-gray-200 dark:bg-bodybg">
            <div className="flex justify-between items-center mb-4 dark:text-gray-200 dark:bg-bodybg">
                <h2 className="text-lg font-semibold dark:text-gray-200 dark:bg-bodybg">Traffic Conversion</h2>
            </div>

            <div className="overflow-x-auto mb-4 dark:text-gray-200 dark:bg-bodybg">
                {loading ? (
                    <div className="text-center text-gray-600 dark:text-gray-200 dark:bg-bodybg">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <table className="w-full border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                        <thead className="bg-gray-100 dark:text-gray-200 dark:bg-bodybg">
                        <tr className="bg-[#383853] text-white">
                            <th className="border p-2 text-center dark:text-gray-200 dark:bg-bodybg min-w-[120px]">Group</th>
                            <th className="border p-2 text-center dark:text-gray-200 dark:bg-bodybg">Site</th>
                            <th className="border p-2 text-center dark:text-gray-200 dark:bg-bodybg">Activation</th>
                            <th className="border p-2 text-center dark:text-gray-200 dark:bg-bodybg">Orders</th>
                            <th className="border p-2 text-center dark:text-gray-200 dark:bg-bodybg">Merchandise Total</th>
                            <th className="border p-2 text-center dark:text-gray-200 dark:bg-bodybg">Avg Merchandise Per Usage</th>
                            <th className="border p-2 text-center dark:text-gray-200 dark:bg-bodybg">Avg Merchandise Per Order</th>
                            <th className="border p-2 text-center dark:text-gray-200 dark:bg-bodybg">Items Per Order</th>
                            <th className="border p-2 text-center dark:text-gray-200 dark:bg-bodybg">Order Conversion</th>
                        </tr>
                        </thead>

                        <tbody>
                        {data.length > 0 ? (
                            <>
                                {data.map((row, index) => (
                                    <tr key={index} className="border hover:bg-gray-50 dark:text-gray-200 dark:bg-bodybg">
                                        <td className="border p-2 text-start dark:text-gray-200 dark:bg-bodybg">{row.group}</td>
                                        <td className="border p-2 text-left dark:text-gray-200 dark:bg-bodybg">{row.site}</td>
                                        <td className="border p-2 text-right dark:text-gray-200 dark:bg-bodybg">{row.activations.toLocaleString()}</td>
                                        <td className="border p-2 text-right dark:text-gray-200 dark:bg-bodybg">{row.orders.toLocaleString()}</td>
                                        <td className="border p-2 text-right dark:text-gray-200 dark:bg-bodybg">{row.merchandiseTotal.toLocaleString()}</td>
                                        <td className="border p-2 text-right dark:text-gray-200 dark:bg-bodybg">{row.avgPerUsage}</td>
                                        <td className="border p-2 text-right dark:text-gray-200 dark:bg-bodybg">{row.avgPerOrder}</td>
                                        <td className="border p-2 text-right dark:text-gray-200 dark:bg-bodybg">
                                            {row.orders && row.total_qty
                                                ? (row.total_qty / row.orders).toFixed(2)
                                                : "0"}
                                        </td>
                                        <td className="border p-2 text-right dark:text-gray-200 dark:bg-bodybg">
                                            {row.conversion ? `${row.conversion.toFixed(2)}%` : "0"}
                                        </td>
                                    </tr>
                                ))}

                                <tr className="border font-semibold bg-[#949eb7] dark:text-gray-200">
                                    <td className="border p-2 text-start">Total</td>
                                    <td className="border p-2 text-left"></td>
                                    <td className="border p-2 text-right">{formatNumber(totals.activations)}</td>
                                    <td className="border p-2 text-right">{formatNumber(totals.orders)}</td>
                                    <td className="border p-2 text-right">{formatNumber(totals.merchandiseTotal)}</td>
                                    <td className="border p-2 text-right">
                                        {totals.activations && totals.merchandiseTotal
                                            ? formatFloat(totals.merchandiseTotal / totals.activations)
                                            : 0}
                                    </td>
                                    <td className="border p-2 text-right">
                                        {totals.orders && totals.merchandiseTotal
                                            ? formatFloat(totals.merchandiseTotal / totals.orders)
                                            : 0}
                                    </td>
                                    <td className="border p-2 text-right">
                                        {totals.orders && totals.total_qty
                                            ? formatFloat(totals.total_qty / totals.orders)
                                            : 0}
                                    </td>
                                    <td className="border p-2 text-right">
                                        {totals.activations && totals.orders
                                            ? formatPercentage((totals.orders / totals.activations) * 100)
                                            : 0}
                                    </td>
                                </tr>
                            </>
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center p-4 dark:text-gray-200 dark:bg-bodybg">
                                    No data available
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AnalysisConversionTable;
