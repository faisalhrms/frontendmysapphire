import React, { useState, useEffect } from "react";
import { fetchAnalysisForm } from "../services/ecom_services.js";

const AnalysisConversionTable = ({ filters }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
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
                        merchandiseTotal: `${item.merchandise_total.toLocaleString()}`,
                        avgPerUsage: `${item.avg_mer_total_per_usage}`,
                        avgPerOrder: `${item.avg_merchandise_total_per_order}`,
                        itemsPerOrder: item.avg_items_per_order,
                        conversion: `${item.order_conversion}%`,
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

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg mb-6 dark:text-gray-200 dark:bg-bodybg">
            <div className="flex justify-between items-center mb-4 dark:text-gray-200 dark:bg-bodybg">
                <h2 className="text-lg font-semibold dark:text-gray-200 dark:bg-bodybg">
                    Traffic Conversion
                </h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mb-4 dark:text-gray-200 dark:bg-bodybg">
                {loading ? (
                    <p className="text-center text-gray-600 dark:text-gray-200 dark:bg-bodybg">
                        Loading data...
                    </p>
                ) : (
                    <table className="w-full border border-gray-200 dark:text-gray-200 dark:bg-bodybg">
                        <thead className="bg-gray-100 dark:text-gray-200 dark:bg-bodybg">
                        <tr style={{backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white"}}>
                            <th className="border p-2 text-center dark:text-gray-200 dark:bg-bodybg">
                                Group
                            </th>
                            <th className="border p-2 text-center dark:text-gray-200 dark:bg-bodybg">
                                Site
                            </th>
                            <th className="border p-2 text-center dark:text-gray-200 dark:bg-bodybg">
                                Activation
                            </th>
                            <th className="border p-2 text-center dark:text-gray-200 dark:bg-bodybg">
                                Orders
                            </th>
                            <th className="border p-2 text-center dark:text-gray-200 dark:bg-bodybg">
                                Merchandise Total
                            </th>
                            <th className="border p-2 text-center dark:text-gray-200 dark:bg-bodybg">
                                Avg Merchandise Per Usage
                            </th>
                            <th className="border p-2 text-center dark:text-gray-200 dark:bg-bodybg">
                                Avg Merchandise Per Order
                            </th>
                            <th className="border p-2 text-center dark:text-gray-200 dark:bg-bodybg">
                                Items Per Order
                            </th>
                            <th className="border p-2 text-center dark:text-gray-200 dark:bg-bodybg">
                                Order Conversion
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.length > 0 ? (
                            data.map((row, index) => (
                                <tr
                                    key={index}
                                    className="border hover:bg-gray-50 dark:text-gray-200 dark:bg-bodybg"
                                >
                                    <td className="border p-2 text-start dark:text-gray-200 dark:bg-bodybg ">
                                        {row.group}
                                    </td>
                                    <td className="border p-2 text-left dark:text-gray-200 dark:bg-bodybg">
                                        {row.site}
                                    </td>
                                    <td className="border p-2 text-right dark:text-gray-200 dark:bg-bodybg">
                                        {row.activations.toLocaleString()}
                                    </td>
                                    <td className="border p-2 text-right dark:text-gray-200 dark:bg-bodybg">
                                        {row.orders.toLocaleString()}
                                    </td>
                                    <td className="border p-2 text-right dark:text-gray-200 dark:bg-bodybg">
                                        {row.merchandiseTotal}
                                    </td>
                                    <td className="border p-2 text-right dark:text-gray-200 dark:bg-bodybg">
                                        {row.avgPerUsage}
                                    </td>
                                    <td className="border p-2 text-right dark:text-gray-200 dark:bg-bodybg">
                                        {row.avgPerOrder}
                                    </td>
                                    <td className="border p-2 text-right dark:text-gray-200 dark:bg-bodybg">
                                        {row.itemsPerOrder}
                                    </td>
                                    <td className="border p-2 text-right dark:text-gray-200 dark:bg-bodybg">
                                        {row.conversion}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="9"
                                    className="text-center p-4 dark:text-gray-200 dark:bg-bodybg"
                                >
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
