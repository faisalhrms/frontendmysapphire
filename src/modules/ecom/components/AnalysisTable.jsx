import React from "react";
import LoadingSpinner from "@components/LoadingSpinner";

const formatNumber = (num) =>
    num ? num.toLocaleString(undefined, { minimumFractionDigits: 2 }) : "N/A";

const formatPercentage = (value) => {
    const num = parseFloat(value);
    return {
        value: `${num > 0 ? "" : "-"}${Math.abs(num)}%`,
        isNegative: num < 0,
    };
};

const AnalysisTable = ({ title, headers = [], data = [], loading }) => {
    return (
        <div className="p-4 bg-white shadow-lg rounded-lg mb-6 dark:text-gray-200 dark:bg-bodybg">

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{title || "Commerce Cloud Order"}</h2>
            </div>


            <div className="w-full flex justify-center items-center">
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <table className="w-full table-fixed border-collapse">
                        {/* Table Head */}
                        <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            {headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="border p-3 text-center font-semibold dark:text-gray-300"
                                >
                                    {header.label}
                                </th>
                            ))}
                        </tr>
                        </thead>


                        <tbody>
                        {data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className="border hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
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
                            ))
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
