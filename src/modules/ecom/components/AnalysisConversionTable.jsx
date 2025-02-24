import React, { useState, useEffect } from "react";
import { fetchAnalysisForm } from "../services/ecom_services.js";

const AnalysisConversionTable = () => {
    const [data, setData] = useState([]);
    const [sortOrder, setSortOrder] = useState("desc");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetchAnalysisForm();
                if (response?.cc_source_code) {
                    const formattedData = response.cc_source_code.map(item => ({
                        group: item.source_group,
                        site: item.site,
                        activations: item.activations,
                        orders: item.orders,
                        merchandiseTotal: `PKR${item.merchandise_total.toLocaleString()}`,
                        avgPerUsage: `PKR${item.avg_mer_total_per_usage}`,
                        avgPerOrder: `PKR${item.avg_merchandise_total_per_order}`,
                        itemsPerOrder: item.avg_items_per_order,
                        conversion: `${item.order_conversion}%`,
                    }));
                    setData(formattedData);
                }
            } catch (error) {
                console.error("Error fetching source code analysis data:", error);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const sortedData = [...data].sort((a, b) => {
        return sortOrder === "asc" ? a.orders - b.orders : b.orders - a.orders;
    });

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Conversion of Source Codes</h2>
            </div>

            <div className="overflow-x-auto">
                {loading ? (
                    <p className="text-center text-gray-600">Loading data...</p>
                ) : (
                    <table className="w-full border border-gray-200">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2 text-center">Group</th>
                            <th className="border p-2 text-center">Site</th>
                            <th className="border p-2 text-center">Activation</th>
                            <th
                                className="border p-2 text-center cursor-pointer"
                                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                            >
                                Orders {sortOrder === "asc" ? "▲" : "▼"}
                            </th>
                            <th className="border p-2 text-center">Merchandise Total</th>
                            <th className="border p-2 text-center">Avg Merchandise Total Per Using</th>
                            <th className="border p-2 text-center">Avg Merchandise Total Per Order</th>
                            <th className="border p-2 text-center">Items Per Order</th>
                            <th className="border p-2 text-center">Order Conversion</th>
                        </tr>
                        </thead>
                        <tbody>
                        {sortedData.length > 0 ? (
                            sortedData.map((row, index) => (
                                <tr key={index} className="border hover:bg-gray-50">
                                    <td className="border p-2 text-start">{row.group}</td>
                                    <td className="border p-2 text-right whitespace-nowrap">{row.site}</td>
                                    <td className="border p-2 text-right">{row.activations.toLocaleString()}</td>
                                    <td className="border p-2 text-right">{row.orders.toLocaleString()}</td>
                                    <td className="border p-2 text-right">{row.merchandiseTotal}</td>
                                    <td className="border p-2 text-right">{row.avgPerUsage}</td>
                                    <td className="border p-2 text-right">{row.avgPerOrder}</td>
                                    <td className="border p-2 text-right">{row.itemsPerOrder}</td>
                                    <td className="border p-2 text-right">{row.conversion}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center p-4">
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
