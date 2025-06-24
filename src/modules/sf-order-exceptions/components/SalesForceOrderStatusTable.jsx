import React from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { formatNumberWithCommas } from "@helpers/formatters.js";
import ReportSyncTime from "@components/reports/ReportSyncTime.jsx";

const SalesForceOrderStatusTable = ({ data, isLoading, isActive }) => {
    if (!isActive) {
        return null;
    }
    if (isLoading) {
        return <LoadingSpinner />;
    }
    return (
        <>
            <ReportSyncTime />
            <div className="p-2 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="text-white bg-[#383853]">
                        <th colSpan="4" className="bg-blue-300 border border-gray-400 p-2 text-center">
                            FO Status Summary
                        </th>
                    </tr>
                    <tr className="text-white bg-[#383853]">
                        <th className="bg-blue-300 border border-gray-400 p-2 text-center">Status</th>
                        <th className="bg-blue-300 border border-gray-400 p-2 text-center">FO Count</th>
                        <th className="bg-blue-300 border border-gray-400 p-2 text-center">Quantity</th>
                        <th className="bg-blue-300 border border-gray-400 p-2 text-center">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data?.order_status_summary?.map((row, index) => (
                        <tr
                            key={index}
                            className={
                                row.status === "Grand Total"
                                    ? "font-bold bg-[#949eb7] dark:text-gray-200 dark:bg-bodybg text-black"
                                    : "font-bold"
                            }
                        >
                            <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black">
                                {row?.status}
                            </td>
                            <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">
                                {formatNumberWithCommas(row?.orders)}
                            </td>
                            <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">
                                {formatNumberWithCommas(row?.qty)}
                            </td>
                            <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">
                                {formatNumberWithCommas(row?.amount)}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default SalesForceOrderStatusTable;