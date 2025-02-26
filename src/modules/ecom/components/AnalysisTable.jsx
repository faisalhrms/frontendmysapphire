import React from "react";
import LoadingSpinner from "@components/LoadingSpinner";

const formatNumber = (num) => num?.toLocaleString() || "N/A";
const formatPercentage = (value) => {
    const num = parseFloat(value);
    return {
        value: `${num > 0 ? "" : "-"}${Math.abs(num)}%`,
        isNegative: num < 0,
    };
};

const AnalysisTable = ({ title, headers = [], data = [], loading }) => {
    return (
        <div className="bg-white p-4 shadow-md rounded-lg mb-6 dark:text-gray-200 dark:bg-bodybg">
        <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden mt-4 mb-4 dark:text-gray-200 dark:bg-bodybg">
            <div className="p-3 text-lg font-semibold text-gray-900  border-b bg-gray-100 dark:border-gray-700 text-left dark:text-gray-200 dark:bg-bodybg">
                {title}
            </div>

            <div className="w-full flex justify-center items-center dark:text-gray-200 dark:bg-bodybg">
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <table className="w-full table-fixed border-collapse dark:text-gray-200 dark:bg-bodybg">
                        <thead className="bg-gray-200 dark:border-gray-700  text-gray-800 dark:text-gray-200 dark:bg-bodybg">
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="p-2 border border-gray-400 dark:border-gray-700 text-center dark:text-gray-200 dark:bg-bodybg"
                                >
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="text-gray-800 dark:text-gray-200 dark:bg-bodybg">
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border border-gray-300 dark:border-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:bg-bodybg">
                                    {headers.map((header, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className={`border border-gray-400 dark:border-gray-700 px-4 py-2 dark:text-gray-200 dark:bg-bodybg ${
                                                header.align === "right" ? "text-right" : "text-left"
                                            }`}
                                        >
                                            {header.accessor === "orderConversion"
                                                ? formatPercentage(row[header.accessor]).value
                                                : formatNumber(row[header.accessor])}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={headers.length} className="p-3 text-center text-gray-500 dark:text-gray-200 dark:bg-bodybg">
                                    No Data Available
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
        </div>
    );
};

export default AnalysisTable;
