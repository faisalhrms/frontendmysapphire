import React from 'react';
import {formatNumberWithCommas} from "@helpers/formatters.js";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import TbodyShimmer from "@components/TbodyShimmer.jsx";

const PendingLiabilitiesReturnAgeTable = ({ block = 5, title = 'Return %age Performance', filters, rows = 4 }) => {
    const { data, isLoading } = useFetchWithFilters(
        `/ecom/pending-liabilities/agings/${block}/`, filters, {refetchOnWindowFocus: false}
    )
    return (
        <div className="p-2 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
            <div className="overflow-auto">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="text-white bg-[#383853]">
                        <th colSpan="5" className="border border-gray-400 p-2 text-center font-normal">{title}</th>
                    </tr>
                    <tr className='bg-gray-700 text-white'>
                        <th className='border border-gray-400 p-2 text-center font-light'>Courier</th>
                        <th className='border border-gray-400 p-2 text-center font-light'>Total Picked</th>
                        <th className='border border-gray-400 p-2 text-center font-light'>Returned</th>
                        <th className='border border-gray-400 p-2 text-center font-light'>Return %age</th>
                        <th className='border border-gray-400 p-2 text-center font-light'>Allocation%</th>
                    </tr>
                    </thead>
                    {isLoading ? (
                        <TbodyShimmer rows={rows} columns={5} />
                    ) : (
                        <tbody>
                        {data?.map((row, index) => (
                            <tr key={index} className={`dark:text-gray-200 dark:bg-bodybg text-black ${row?.classes}`}>
                                <td className="border border-gray-400 p-2 whitespace-nowrap">
                                    {row?.status}
                                </td>
                                <td className="border border-gray-400 p-2 whitespace-nowrap text-right font-bold">
                                    {formatNumberWithCommas(row?.call_c_picked)}
                                </td>
                                <td className="border border-gray-400 p-2 whitespace-nowrap text-right font-bold">
                                    {formatNumberWithCommas(row?.call_c_returned)}
                                </td>
                                <td className="border border-gray-400 p-2 whitespace-nowrap text-right font-bold">
                                    {row?.return_percentage}%
                                </td>
                                <td className="border border-gray-400 p-2 whitespace-nowrap text-right font-bold bg-pink/30">
                                    {row?.allocation_percent}%
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    )}
                </table>
            </div>
        </div>
    );
};

export default PendingLiabilitiesReturnAgeTable;
