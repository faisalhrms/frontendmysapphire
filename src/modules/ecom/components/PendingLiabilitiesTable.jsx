import React from 'react';
import {formatNumberWithCommas} from "@helpers/formatters.js";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import TbodyShimmer from "@components/TbodyShimmer.jsx";

const PendingLiabilitiesTable = ({ block = 1, title, filters, rows = 4 }) => {
    const { data, isLoading } = useFetchWithFilters(
        `/ecom/pending-liabilities/agings/${block}/`, filters, {refetchOnWindowFocus: false}
    )
    return (
        <div className="p-2 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
            <div className="overflow-auto">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="text-white bg-[#383853]">
                        <th colSpan="7" className="border border-gray-400 p-2 text-center font-normal">{title}</th>
                    </tr>
                    <tr className='bg-gray-700 text-white'>
                        <th className='border border-gray-400 p-2 text-center font-light'>Status</th>
                        <th className='border border-gray-400 p-2 text-center font-light'>1 - 3 Days (Normal)</th>
                        <th className='border border-gray-400 p-2 text-center font-light'>4 - 5 Days</th>
                        <th className='border border-gray-400 p-2 text-center font-light'>6 - 10 Days</th>
                        <th className='border border-gray-400 p-2 text-center font-light'>11 - 20 Days</th>
                        <th className='border border-gray-400 p-2 text-center font-light'>Plus 20 Days</th>
                        <th className='border border-gray-400 p-2 text-center font-light'>Total</th>
                    </tr>
                    </thead>
                    {isLoading ? (
                        <TbodyShimmer rows={rows} columns={7} />
                    ) : (
                        <tbody>
                        {data?.map((row, index) => (
                            <tr key={index} className={`dark:text-gray-200 dark:bg-bodybg text-black ${row?.classes}`}>
                                <td className="border border-gray-400 p-2 whitespace-nowrap">
                                    {row?.status}
                                </td>
                                <td className="border border-gray-400 p-2 whitespace-nowrap text-right">
                                    {formatNumberWithCommas(row?.days_1_3)}
                                </td>
                                <td className="border border-gray-400 p-2 whitespace-nowrap text-right">
                                    {formatNumberWithCommas(row?.days_4_5)}
                                </td>
                                <td className="border border-gray-400 p-2 whitespace-nowrap text-right">
                                    {formatNumberWithCommas(row?.days_6_10)}
                                </td>
                                <td className="border border-gray-400 p-2 whitespace-nowrap text-right">
                                    {formatNumberWithCommas(row?.days_11_20)}
                                </td>
                                <td className="border border-gray-400 p-2 whitespace-nowrap text-right">
                                    {formatNumberWithCommas(row?.days_20_plus)}
                                </td>
                                <td className="border border-gray-400 p-2 whitespace-nowrap text-right bg-gray-700 text-white">
                                    {formatNumberWithCommas(row?.total)}
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

export default PendingLiabilitiesTable;
