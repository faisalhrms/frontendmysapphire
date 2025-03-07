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


            <div
                className="p-4 bg-white shadow-lg rounded-lg mb-6 dark:text-gray-200 dark:bg-bodybg">
                <div className="flex justify-between items-center mb-4 dark:text-gray-200 dark:bg-bodybg">
                    <h2 className="text-lg font-semibold dark:text-gray-200 dark:bg-bodybg">Commerce Cloud Order</h2>
                </div>

                <div className="w-full flex justify-center items-center dark:text-gray-200 dark:bg-bodybg">
                    {loading ? (
                        <LoadingSpinner/>
                    ) : (
                        <table className="w-full table-fixed border-collapse dark:text-gray-200 dark:bg-bodybg">
                            <thead className="bg-gray-100 dark:text-gray-200 dark:bg-bodybg">
                            <tr>
                                {headers.map((header, index) => (
                                    <th
                                        key={index}
                                        className="border p-2 text-center dark:text-gray-200 dark:bg-bodybg"
                                    >
                                        {header.label}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody className="border hover:bg-gray-50 dark:text-gray-200 dark:bg-bodybg">
                            {data.length > 0 ? (
                                data.map((row, rowIndex) => (
                                    <tr key={rowIndex}
                                        className="border hover:bg-gray-50 dark:text-gray-200 dark:bg-bodybg">
                                        {headers.map((header, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className={`border p-2 text-start dark:text-gray-200 dark:bg-bodybg ${
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
                                    <td colSpan={headers.length}
                                        className="p-3 text-center text-gray-500 dark:text-gray-200 dark:bg-bodybg">
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
