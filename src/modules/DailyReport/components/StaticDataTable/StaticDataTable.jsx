// import React from "react";
//
// const isObject = (val) =>
//     val !== null && typeof val === "object" && !Array.isArray(val);
//
// const StaticDataTable = ({ data }) => {
//     if (!Array.isArray(data) || data.length === 0) {
//         return <p className="p-4 text-gray-500">No data available</p>;
//     }
//
//     const firstRow = data[0];
//
//     // Build header meta
//     const topHeaders = [];
//     const subHeaders = [];
//
//     Object.entries(firstRow).forEach(([key, val]) => {
//         if (isObject(val)) {
//             const subs = Object.keys(val);
//             topHeaders.push({ label: key, colSpan: subs.length, rowSpan: 1 });
//             subs.forEach((sub) => subHeaders.push({ parent: key, label: sub }));
//         } else {
//             topHeaders.push({ label: key, colSpan: 1, rowSpan: 2 });
//         }
//     });
//
//     // Flatten rows in matching order
//     const rows = data.map((row) =>
//         Object.entries(row).flatMap(([key, val]) =>
//             isObject(val) ? Object.values(val) : [val]
//         )
//     );
//
//     return (
//         <div className="overflow-x-auto">
//             <table className="min-w-full table-fixed border-collapse border border-gray-200">
//                 <thead>
//                 {/* Top headers */}
//                 <tr className="bg-gray-800 text-white">
//                     {topHeaders.map(({ label, colSpan, rowSpan }, idx) => (
//                         <th
//                             key={label}
//                             colSpan={colSpan}
//                             rowSpan={rowSpan}
//                             className={`border border-gray-200 px-4 py-1 text-center text-sm font-semibold uppercase whitespace-nowrap ${
//                                 idx === 0
//                                     ? "sticky left-0 z-30 bg-gray-800"
//                                     : ""
//                             }`}
//                         >
//                             {label.replace(/_/g, " ")}
//                         </th>
//                     ))}
//                 </tr>
//
//                 {/* Sub-headers: only nested columns */}
//                 {subHeaders.length > 0 && (
//                     <tr className="bg-gray-700 text-white">
//                         {subHeaders.map(({ parent, label }, idx) => (
//                             <th
//                                 key={`${parent}.${label}`}
//                                 className={`border border-gray-200 px-4 py-1 text-center text-xs font-medium uppercase whitespace-nowrap ${
//                                     idx === 0 && topHeaders[0].rowSpan === 2
//                                         ? ""
//                                         : ""
//                                 }`}
//                             >
//                                 {label.replace(/_/g, " ")}
//                             </th>
//                         ))}
//                     </tr>
//                 )}
//                 </thead>
//
//                 <tbody>
//                 {rows.map((cells, rowIndex) => (
//                     <tr
//                         key={rowIndex}
//                         className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                     >
//                         {cells.map((cell, colIndex) => (
//                             <td
//                                 key={colIndex}
//                                 className={`border border-gray-200 px-4 py-1 text-sm text-gray-800 whitespace-nowrap ${
//                                     colIndex === 0
//                                         ? `sticky left-0 z-10 ${
//                                             rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
//                                         }`
//                                         : ""
//                                 }`}
//                             >
//                                 {cell}
//                             </td>
//                         ))}
//                     </tr>
//                 ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };
//
// export default StaticDataTable;

import React from "react";

const StaticDataTable =({data})=>{
    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed border-collapse border border-gray-200">
                    <thead className="sticky top-0 z-10 text-white text-xs sm:text-sm"
                           style={{backgroundColor: '#0b3588'}}>
                    {/* Group Headers */}
                    <tr>
                        <th
                            rowSpan={2}
                            className="border border-gray-400 p-2 sticky left-0 z-10"
                            style={{minWidth: '100px'}}
                        >
                            Store Name
                        </th>
                        <th
                            colSpan={3}
                            className="border border-gray-400 py-2 px-2 text-center"
                        >
                            Current Year FY2025
                        </th>
                        <th rowSpan={2}
                            className="border border-gray-400 py-2 px-2 text-center">FP % of Total
                        </th>
                        <th rowSpan={2}
                            className="border border-gray-400 py-2 px-2 text-center">GP %
                        </th>
                        <th
                            colSpan={3}
                            className="border border-gray-400 py-2 px-2 text-center"
                        >
                            Gross Profit Rs
                        </th>

                        <th
                            colSpan={2}
                            className="border border-gray-400 py-2 px-2 text-center"
                        >
                            FP Growth from LY
                        </th>
                        <th
                            colSpan={2}
                            className="border border-gray-400 py-2 px-2 text-center"
                        >
                            Total Growth from LY
                        </th>
                        <th
                            colSpan={4}
                            className="border border-gray-400 py-2 px-2 text-center"
                        >
                            Traffic Growth
                        </th>
                    </tr>

                    {/* Sub-headers */}
                    <tr>
                        {/* Current Year */}
                        <th className="border border-gray-400 py-2 px-2 text-center">Full Price</th>
                        <th className="border border-gray-400 py-2 px-2 text-center">Discounted</th>
                        <th className="border border-gray-400 py-2 px-2 text-center">Total</th>

                        {/* Gross Profit */}

                        <th className="border border-gray-400 py-2 px-2 text-center">CY</th>
                        <th className="border border-gray-400 py-2 px-2 text-center">LY</th>
                        <th className="border border-gray-400 py-2 px-2 text-center">Growth</th>
                        {/* FP Growth */}
                        <th className="border border-gray-400 py-2 px-2 text-center">Qty</th>
                        <th className="border border-gray-400 py-2 px-2 text-center">Value</th>
                        {/* Total Growth */}
                        <th className="border border-gray-400 py-2 px-2 text-center">Qty</th>
                        <th className="border border-gray-400 py-2 px-2 text-center">Value</th>
                        {/* Traffic Growth */}
                        <th className="border border-gray-400 py-2 px-2 text-center">Footfall CY</th>
                        <th className="border border-gray-400 py-2 px-2 text-center">Conv %</th>
                        <th className="border border-gray-400 py-2 px-2 text-center">FF Growth</th>
                        <th className="border border-gray-400 py-2 px-2 text-center">Conv % Growth</th>
                    </tr>
                    </thead>
                </table>
            </div>


        </>
    )
}
export default StaticDataTable;