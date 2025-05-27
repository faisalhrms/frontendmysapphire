// import React from "react";
// import LoadingSpinner from "@components/LoadingSpinner";
//
// const formatNumber = (num) =>
//     num ? num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : "N/A";
//
// const formatPercentage = (value) => {
//     const num = parseFloat(value);
//     return {
//         value: `${num > 0 ? "" : "-"}${Math.abs(num)}%`,
//         isNegative: num < 0,
//     };
// };
//
// const defaultHeaders = [
//     { label: "Group", accessor: "source_group", align: "left" },
//     { label: "Orders", accessor: "orders", align: "right" },
//     { label: "Merchandise Total", accessor: "merchandise_total", align: "right" },
//     { label: "Avg Merchandise Total Per Order", accessor: "avg_merchandise_total", align: "right" },
//     { label: "Items Per Order", accessor: "avg_items_per_order", align: "right" },
// ];
//
// const AnalysisTable = ({ title, headers = defaultHeaders, data = [], loading }) => {
//     return (
//         <div className="p-4 bg-white shadow-lg rounded-lg mb-6 dark:text-gray-200 dark:bg-bodybg">
//             <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-lg font-semibold">{title || "Commerce Cloud Order"}</h2>
//             </div>
//
//             <div className="w-full flex justify-center items-center">
//                 {loading ? (
//                     <LoadingSpinner />
//                 ) : (
//                     <table className="w-full table-fixed border-collapse dark:text-gray-200 dark:bg-bodybg ">
//                         <thead className="bg-gray-100 dark:text-gray-200 dark:bg-bodybg">
//                         <tr className="bg-[#383853] text-white Traffic Conversion">
//                             {headers.map((header, index) => (
//                                 <th
//                                     key={index}
//                                     className="border p-3 text-center font-semibold dark:text-gray-200 dark:bg-bodybg"
//                                 >
//                                     {header.label}
//                                 </th>
//                             ))}
//                         </tr>
//                         </thead>
//
//                         <tbody>
//                         {data.length > 0 ? (
//                             data.map((row, rowIndex) => (
//                                 <tr key={rowIndex} className="border hover:bg-gray-50 dark:hover:bg-gray-700">
//                                     {headers.map((header, colIndex) => (
//                                         <td
//                                             key={colIndex}
//                                             className={`border px-4 py-2 ${
//                                                 header.align === "right" ? "text-right" : "text-left"
//                                             } dark:text-gray-200`}
//                                         >
//                                             {header.accessor === "orderConversion"
//                                                 ? formatPercentage(row[header.accessor]).value
//                                                 : formatNumber(row[header.accessor])}
//                                         </td>
//                                     ))}
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan={headers.length} className="p-3 text-center text-gray-500">
//                                     No Data Available
//                                 </td>
//                             </tr>
//                         )}
//                         </tbody>
//                     </table>
//                 )}
//             </div>
//         </div>
//     );
// };
//
// export default AnalysisTable;
import React from "react";
import LoadingSpinner from "@components/LoadingSpinner";

const formatNumber = (num) =>
    num !== null && num !== undefined
        ? num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })
        : "N/A";

const formatPercentage = (value) => {
    const num = parseFloat(value);
    return {
        value: `${num > 0 ? "" : "-"}${Math.abs(num)}%`,
        isNegative: num < 0,
    };
};

const defaultHeaders = [
    { label: "Group", accessor: "source_group", align: "left" },
    { label: "Orders", accessor: "orders", align: "right" },
    { label: "Merchandise Total", accessor: "merchandise_total", align: "right" },
    { label: "Avg Merchandise Total Per Order", accessor: "avg_merchandise_total", align: "right" },
    { label: "Items Per Order", accessor: "avg_items_per_order", align: "right" },
];

const AnalysisTable = ({ title, headers = defaultHeaders, data = [], loading }) => {
    // Calculate totals for numeric columns
    const totals = data.reduce(
        (acc, row) => {
            headers.forEach(({ accessor }) => {
                if (accessor === "source_group") return;
                const val = Number(row[accessor]);
                if (!isNaN(val)) {
                    acc[accessor] = (acc[accessor] || 0) + val;
                }
            });
            return acc;
        },
        {}
    );

    return (
        <div className="p-4 bg-white shadow-lg rounded-lg mb-6 dark:text-gray-200 dark:bg-bodybg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{title || "Commerce Cloud Order"}</h2>
            </div>

            <div className="w-full flex justify-center items-center">
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <table className="w-full table-fixed border-collapse dark:text-gray-200 dark:bg-bodybg">
                        <thead className="bg-gray-100 dark:text-gray-200 dark:bg-bodybg">
                        <tr className="bg-[#383853] text-white Traffic Conversion">
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="border p-3 text-center font-semibold dark:text-gray-200 dark:bg-bodybg"
                                >
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                        </thead>

                        <tbody>
                        {data.length > 0 ? (
                            <>
                                {data.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="border hover:bg-gray-50 dark:hover:bg-gray-700">
                                        {headers.map((header, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className={`border px-4 py-2 ${
                                                    header.align === "right" ? "text-right" : "text-left"
                                                } dark:text-gray-200`}
                                            >
                                                {header.accessor === "orderConversion"
                                                    ? formatPercentage(row[header.accessor]).value
                                                    : formatNumber(row[header.accessor])}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                <tr className="border font-semibold bg-[#949eb7]">
                                    {headers.map((header, colIndex) => {
                                        let displayValue;

                                        if (header.accessor === "source_group") {
                                            displayValue = "Total";
                                        } else if (header.accessor === "avg_merchandise_total") {
                                            const avg =
                                                totals.orders && totals.merchandise_total
                                                    ? totals.merchandise_total / totals.orders
                                                    : 0;
                                            displayValue = formatNumber(avg);
                                        } else if (header.accessor === "avg_items_per_order") {
                                            const avg =
                                                totals.orders && totals.total_qty ? totals.total_qty / totals.orders : 0;
                                            displayValue = formatNumber(avg);
                                        } else {
                                            displayValue = formatNumber(totals[header.accessor]);
                                        }

                                        return (
                                            <td
                                                key={colIndex}
                                                className={`border px-4 py-2 ${
                                                    header.align === "right" ? "text-right" : "text-left"
                                                }`}
                                            >
                                                {displayValue}
                                            </td>
                                        );
                                    })}
                                </tr>


                            </>
                        ) : (
                            <tr>
                                <td colSpan={headers.length} className="p-3 text-center text-gray-500">
                                    No Data Available
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

export default AnalysisTable;
