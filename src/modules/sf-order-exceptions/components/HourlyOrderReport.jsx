import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";
import {formatNumberWithCommas} from "@helpers/formatters.js";
import ReportSyncTime from "@components/reports/ReportSyncTime.jsx";

const HourlyOrderReport= ({data, isLoading, isActive}) => {
    if (!isActive) {
        return null
    }
    if (isLoading) {
        return <LoadingSpinner />;
    }
    return (
        <>
            <ReportSyncTime />
            <div className="p-4 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
                <div className="mb-6 overflow-auto max-h-[600px]"

                >
                    <table className="w-full border-collapse">
                        <thead style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 10,
                            backgroundColor: "#383853"
                        }}>
                        <tr className="text-white ">
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Hour</th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Order Landed SFCC
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">OS Created OMS
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">FOS Created
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Courier Allocation
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">D365 Courier Allocation
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Printing
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Print Scanning
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Punching
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Dispatch
                            </th>

                        </tr>
                        </thead>
                        <tbody>
                        {data && data.length > 0 &&
                            data?.map((item, sourceIndex) => (
                                <React.Fragment key={`source-${sourceIndex}`}>
                                    <tr className={`dark:text-gray-200 dark:bg-bodybg text-black ${item.hour === 'Total' ? 'bg-[#949eb7] font-bold' : ''}`}>
                                        <td className='border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-center text-black'>{item.hour}</td>
                                        <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{formatNumberWithCommas(item.order_landed_sfcc)}</td>
                                        <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{formatNumberWithCommas(item.os_created_oms)}</td>
                                        <td className='border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-center text-black'>{formatNumberWithCommas(item.fos_created)}</td>
                                        <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{formatNumberWithCommas(item.courier_allocation)}</td>
                                        <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{formatNumberWithCommas(item.d365_courier_allocation)}</td>
                                        <td className='border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-center text-black'>{formatNumberWithCommas(item.printing)}</td>
                                        <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{formatNumberWithCommas(item.print_scaning)}</td>
                                        <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{formatNumberWithCommas(item.punching)}</td>
                                        <td className='border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-center text-black'>{formatNumberWithCommas(item.dispatch)}</td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default HourlyOrderReport;
