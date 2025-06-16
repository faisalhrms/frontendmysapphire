import React from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { formatNumberWithCommas } from "@helpers/formatters.js";
import ReportSyncTime from "@components/reports/ReportSyncTime.jsx";

const SalesForceOrderReconTable = ({ data, isLoading, isActive }) => {
    if (!isActive) {
        return null;
    }
    if (isLoading) {
        return <LoadingSpinner />;
    }
    return (
        <>
            <ReportSyncTime />
            <div className="grid grid-cols-12 gap-x-6">
                <div className='xl:col-span-4 col-span-12'></div>
                <div className='xl:col-span-4 col-span-12'>
                    <div className="p-2 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="text-white bg-[#383853]">
                                <th colSpan="6"
                                    className="bg-blue-300 border border-gray-400 p-2 text-center">Order Summary Recon
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                <>
                                    <tr>
                                        <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-left font-bold">
                                            Total Orders
                                        </td>
                                        <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">
                                            {formatNumberWithCommas(data?.no_fo_result)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-left font-bold">
                                            Equals FO
                                        </td>
                                        <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">
                                            {formatNumberWithCommas(data?.equals_result)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-left font-bold">
                                            Partial FO
                                        </td>
                                        <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">
                                            {formatNumberWithCommas(data?.fo_result)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-left font-bold">
                                            No FO
                                        </td>
                                        <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">
                                            {formatNumberWithCommas(data?.no_fo_result)}
                                        </td>
                                    </tr>
                                </>
                            }

                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='xl:col-span-4 col-span-12'></div>
            </div>
        </>
    )
};

export default SalesForceOrderReconTable;