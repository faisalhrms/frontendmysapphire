import React from "react";

const formatNumber = (num) => num?.toLocaleString() || "N/A";
const formatPercentage = (value) => {
    const num = parseFloat(value);
    return { value: `${num > 0 ? "" : "-"}${Math.abs(num)}%`, isNegative: num < 0 };
};
const getStatusBadge = (status) => {
    switch (status) {
        case "Success":
            return <span className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-200 rounded-lg">Success</span>;
        case "Processing":
            return <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-200 rounded-lg">Processing</span>;
        case "Declined":
            return <span className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-200 rounded-lg">Declined</span>;
        default:
            return <span className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-lg">Pending</span>;
    }
};
const Table = ({ title, headers = [], data = [] }) => {
    return (
        <div className="w-full md:w-1/2 px-2">

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">


                <div className="p-4 text-lg font-semibold text-gray-900 dark:text-gray-200 dark:bg-bodybg border-b bg-gray-100 dark:border-gray-700">{title}</div>


                <div className="overflow-x-auto">
                    <table className="w-full text-sm  text-left border-collapse">


                        <thead className="bg-gray-200  dark:border-gray-700  dark:text-gray-200 dark:bg-bodybg  text-gray-700 uppercase">
                        <tr className="border">
                            <th className="p-2 border dark:border-gray-700 border-gray-400 dark:text-gray-200 dark:bg-bodybg"></th>
                            <th colSpan="3" className="p-2  dark:border-gray-700 text-center border border-gray-400 dark:text-gray-200 dark:bg-bodybg">CY</th>
                            <th colSpan="3" className="p-2 dark:border-gray-700 text-center border border-gray-400 dark:text-gray-200 dark:bg-bodybg">LY</th>
                            <th colSpan="3" className="p-2 dark:border-gray-700 text-center border border-gray-400 dark:text-gray-200 dark:bg-bodybg">YoY%</th>
                        </tr>
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index} className="p-3 border border-gray-300 dark:border-gray-700">{header.label}</th>
                            ))}
                        </tr>
                        </thead>


                        <tbody className="text-gray-800 dark:text-gray-200 dark:bg-bodybg">
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border border-gray-300 dark:border-gray-700 transition hover:bg-gray-100">
                                    <td className="p-2 border border-gray-400 font-semibold dark:border-gray-700">{row.period}</td>
                                    <td className="p-2 border border-gray-400 dark:border-gray-700">{formatNumber(row.cy?.orders)}</td>
                                    <td className="p-2 border border-gray-400 dark:border-gray-700">{formatNumber(row.cy?.qty)}</td>
                                    <td className="p-2 border border-gray-400 dark:border-gray-700">{formatNumber(row.cy?.value)}</td>
                                    <td className="p-2 border border-gray-400 dark:border-gray-700">{formatNumber(row.ly?.orders)}</td>
                                    <td className="p-2 border border-gray-400 dark:border-gray-700">{formatNumber(row.ly?.qty)}</td>
                                    <td className="p-2 border border-gray-400 dark:border-gray-700">{formatNumber(row.ly?.value)}</td>
                                    <td className={`p-2 border border-gray-400  dark:border-gray-700 ${row.yoy?.orders < 0 ? 'text-red-600' : ''}`}>
                                        {formatPercentage(row.yoy?.orders).value}
                                    </td>
                                    <td className={`p-2 border border-gray-400 dark:border-gray-700 ${row.yoy?.qty < 0 ? 'text-red-600' : ''}`}>
                                        {formatPercentage(row.yoy?.qty).value}
                                    </td>
                                    <td className={`p-2 border border-gray-400 dark:border-gray-700 ${row.yoy?.value < 0 ? 'text-red-600' : ''}`}>
                                        {formatPercentage(row.yoy?.value).value}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={headers.length} className="p-4 text-center text-gray-500">
                                    No Data Available
                                </td>
                            </tr>
                        )}
                        </tbody>

                    </table>
                </div>
            </div>
        </div>
    );
};

export default Table;
