
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";
import ReportSyncTime from "@components/reports/ReportSyncTime.jsx";
import {formatNumberWithCommas} from "@helpers/formatters.js";

const OrderDetailReport = ({ data, isLoading, isActive }) => {
    if (!isActive) {
        return null;
    }

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <ReportSyncTime syncType='cc_orders'/>
            <div className="flex justify-center items-center">
                <div className="w-full max-w-4xl p-4 bg-white rounded-lg mb-4">
                    <div className="h-[600px] overflow-y-auto bg-white  shadow-md dark:text-gray-200 dark:bg-bodybg">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 z-20">
                            <tr className="text-white" style={{ backgroundColor: "#383853" }}>
                                <th className="border border-gray-400 p-2 text-center">Time</th>
                                <th className="border border-gray-300 p-2 text-center">Order Count</th>
                                <th className="border border-gray-300 p-2 text-center">Revenue Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data && data.length > 0 &&
                                data.map((item, sourceIndex) => (
                                    <tr key={`source-${sourceIndex}`}
                                        className={`dark:text-gray-200 dark:bg-bodybg text-black ${item.hour === 'Total' ? 'bg-[#949eb7] font-bold' : ''}`}>
                                        <td className='border border-gray-400 p-2 whitespace-nowrap text-center'>
                                            {item.hour}:{item.minute_chunk}
                                        </td>
                                        <td className='border border-gray-300 p-2 text-right'>{item.order_count}</td>
                                        <td className='border border-gray-300 p-2 text-right font-bold'>
                                            {formatNumberWithCommas(Math.floor(item.revenue_amount))}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderDetailReport;