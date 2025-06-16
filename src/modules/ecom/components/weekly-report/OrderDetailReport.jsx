import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";
import {formatNumberWithCommas} from "@helpers/formatters.js";

const OrderDetailReport = ({data, isLoading, isActive}) => {
    if (!isActive) {
        return null
    }
    if (isLoading) {
        return <LoadingSpinner />;
    }
    return (
        <>
            <div className="p-4 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
                <div className="mb-6 overflow-auto max-h-[800px]"

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
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Minutes
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Order Count
                            </th>
                            <th className="bg-blue-200 border border-gray-300 p-2 text-center">Revenue Amount
                            </th>

                        </tr>
                        </thead>
                        <tbody>
                        {data && data.length > 0 &&
                            data?.map((item, sourceIndex) => (
                                <React.Fragment key={`source-${sourceIndex}`}>
                                    <tr className={`dark:text-gray-200 dark:bg-bodybg text-black ${item.hour === 'Total' ? 'bg-[#949eb7] font-bold' : ''}`}>
                                        <td className='border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-center text-black'>{item.hour}</td>
                                        <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{item.minute_chunk}</td>
                                        <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black'>{item.order_count}</td>
                                        <td className='border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg text-black font-bold'>{formatNumberWithCommas(item.revenue_amount) }</td>


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

export default OrderDetailReport;
