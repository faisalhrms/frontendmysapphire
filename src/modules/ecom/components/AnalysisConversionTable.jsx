// import React, { useState, useEffect } from "react";
// import { fetchAnalysisForm } from "../services/ecom_services.js";
//
//
// const AnalysisConversionTable = ({ filters }) => {
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(false);
//
//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             try {
//                 const response = await fetchAnalysisForm(filters);
//                 if (response?.cc_source_code) {
//                     const formattedData = response.cc_source_code.map((item) => ({
//                         group: item.source_group,
//                         site: item.site,
//                         activations: item.activations,
//                         orders: item.orders,
//                         merchandiseTotal: `${item.merchandise_total.toLocaleString()}`,
//                         avgPerUsage: `${item.avg_mer_total_per_usage}`,
//                         avgPerOrder: `${item.avg_merchandise_total_per_order}`,
//                         itemsPerOrder: item.avg_items_per_order,
//                         conversion: `${item.order_conversion}%`,
//                     }));
//                     setData(formattedData);
//                 }
//             } catch (error) {
//                 console.error("Error fetching source code analysis data:", error);
//             }
//             setLoading(false);
//         };
//
//         if (filters.date_from && filters.date_to) {
//             fetchData();
//         }
//     }, [filters]);
//
//
//
//     return (
//         <div className="p-4 bg-white shadow-lg rounded-lg mb-6">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-semibold">Traffic Conversion</h2>
//             </div>
//
//             {/* Table */}
//             <div className="overflow-x-auto mb-4">
//                 {loading ? (
//                     <p className="text-center text-gray-600">Loading data...</p>
//                 ) : (
//                     <table className="w-full border border-gray-200">
//                         <thead className="bg-gray-100">
//                         <tr>
//                             <th className="border p-2 text-center">Group</th>
//                             <th className="border p-2 text-center">Site</th>
//                             <th className="border p-2 text-center">Activation</th>
//                             <th className="border p-2 text-center">Orders</th>
//                             <th className="border p-2 text-center">Merchandise Total</th>
//                             <th className="border p-2 text-center">Avg Merchandise Per Usage</th>
//                             <th className="border p-2 text-center">Avg Merchandise Per Order</th>
//                             <th className="border p-2 text-center">Items Per Order</th>
//                             <th className="border p-2 text-center">Order Conversion</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {data.length > 0 ? (
//                             data.map((row, index) => (
//                                 <tr key={index} className="border hover:bg-gray-50">
//                                     <td className="border p-2 text-start">{row.group}</td>
//                                     <td className="border p-2 text-right">{row.site}</td>
//                                     <td className="border p-2 text-right">{row.activations.toLocaleString()}</td>
//                                     <td className="border p-2 text-right">{row.orders.toLocaleString()}</td>
//                                     <td className="border p-2 text-right">{row.merchandiseTotal}</td>
//                                     <td className="border p-2 text-right">{row.avgPerUsage}</td>
//                                     <td className="border p-2 text-right">{row.avgPerOrder}</td>
//                                     <td className="border p-2 text-right">{row.itemsPerOrder}</td>
//                                     <td className="border p-2 text-right">{row.conversion}</td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="9" className="text-center p-4">No data available</td>
//                             </tr>
//                         )}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//
//
//         </div>
//     );
// };
//
// export default AnalysisConversionTable;
import React, { useState, useEffect } from "react";
import { fetchAnalysisForm } from "../services/ecom_services.js";

const AnalysisConversionTable = ({ filters }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);



    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetchAnalysisForm(filters); // Fetch data with filters
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
                }
            } catch (error) {
                console.error("Error fetching source code analysis data:", error);
            }
            setLoading(false);
        };

        if (filters.date_from && filters.date_to) {
            fetchData(); // Trigger fetch when filters change
        }
    }, [filters]); // Only re-fetch if filters change

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Traffic Conversion</h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mb-4">
                {loading ? (
                    <p className="text-center text-gray-600">Loading data...</p>
                ) : (
                    <table className="w-full border border-gray-200">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2 text-center">Group</th>
                            <th className="border p-2 text-center">Site</th>
                            <th className="border p-2 text-center">Activation</th>
                            <th className="border p-2 text-center">Orders</th>
                            <th className="border p-2 text-center">Merchandise Total</th>
                            <th className="border p-2 text-center">Avg Merchandise Per Usage</th>
                            <th className="border p-2 text-center">Avg Merchandise Per Order</th>
                            <th className="border p-2 text-center">Items Per Order</th>
                            <th className="border p-2 text-center">Order Conversion</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.length > 0 ? (
                            data.map((row, index) => (
                                <tr key={index} className="border hover:bg-gray-50">
                                    <td className="border p-2 text-start">{row.group}</td>
                                    <td className="border p-2 text-right">{row.site}</td>
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
                                <td colSpan="9" className="text-center p-4">No data available</td>
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
