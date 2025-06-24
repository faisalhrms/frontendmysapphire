import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";
import ReportSyncTime from "@components/reports/ReportSyncTime.jsx";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const OrderDetailReport = ({ data, isLoading, isActive }) => {
    if (!isActive) return null;
    if (isLoading) return <LoadingSpinner />;

    return (
        <>
            <ReportSyncTime syncType='cc_orders' />
            <div className="flex justify-center items-center">
                <div className="w-full max-w-3xl p-4 bg-white rounded-lg mb-4">
                    <div className="h-[600px] overflow-y-auto bg-white shadow-md dark:text-gray-200 dark:bg-bodybg">
                        <table className="w-full border-collapse">
                            <thead className="sticky top-0 z-20">
                            <tr className="text-white" style={{backgroundColor: "#383853"}}>
                                <th className="border border-gray-300 p-2 text-left">Time</th>
                                <th className="border border-gray-300 p-2 text-center">Order Count</th>
                                <th className="border border-gray-300 p-2 text-center">Revenue Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data && data.length > 0 && (() => {
                                const first = data[0];

                                const formatTime = (hour, minute) => {
                                    const pad = (n) => String(Math.floor(n)).padStart(2, '0');
                                    return `${pad(hour)}:${pad(minute)}`;
                                };

                                return (
                                    <tr key="first-sync"
                                        className="text-black dark:text-gray-200 dark:bg-bodybg font-semibold">
                                        <td className="border border-gray-300 p-2 whitespace-nowrap text-left flex items-center space-x-1">
                                            <svg className="w-4 h-4 text-gray-500 mr-1" fill="none"
                                                 stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                            <span>{formatTime(first.hour, first.minute_chunk)} → Last Sync</span>
                                        </td>
                                        <td className="border border-gray-300 p-2 text-right">{first.order_count}</td>
                                        <td className="border border-gray-300 p-2 text-right font-bold">
                                            {formatNumberWithCommas(Math.floor(first.revenue_amount))}
                                        </td>
                                    </tr>
                                );
                            })()}

                            {data && data.length > 1 && data.slice(1).map((item, index) => {
                                const prevItem = data[index];

                                const formatTime = (hour, minute) => {
                                    const pad = (n) => String(Math.floor(n)).padStart(2, '0');
                                    return `${pad(hour)}:${pad(minute)}`;
                                };

                                const fromTime = formatTime(item.hour, item.minute_chunk);
                                const toTime = formatTime(prevItem.hour, prevItem.minute_chunk);

                                return (
                                    <tr key={`range-${index}`} className="dark:text-gray-200 dark:bg-bodybg text-black">
                                        <td className="border border-gray-300 p-2 whitespace-nowrap text-center flex items-center space-x-1">
                                            <svg className="w-4 h-4 text-gray-500 mr-1" fill="none"
                                                 stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                            <span>{fromTime} → {toTime}</span>
                                        </td>
                                        <td className="border border-gray-300 p-2 text-right">{item.order_count}</td>
                                        <td className="border border-gray-300 p-2 text-right font-bold">
                                            {formatNumberWithCommas(Math.floor(item.revenue_amount))}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderDetailReport;
