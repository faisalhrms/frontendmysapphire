import React from 'react';
import {formatNumberWithCommas} from "@helpers/formatters.js";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import TbodyShimmer from "@components/TbodyShimmer.jsx";
import AnimatedMascot from "@components/AnimatedMascot.jsx";

const ExecutiveSummaryTable = ({ type = 'rco', title, filters, rows = 4 }) => {
    const { data, isLoading } = useFetchWithFilters(
        `/ecom/pending-liabilities/executive-summary/${type}/`, filters, {refetchOnWindowFocus: false}
    )
    return (
        <div className="p-2 bg-white mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg relative">
            {isLoading && <AnimatedMascot />}
            <div className="overflow-auto">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="text-white bg-[#383853]">
                        <th colSpan="2" className="bg-blue-300 border border-gray-400 p-2 text-center font-normal">{title}</th>
                    </tr>
                    </thead>
                    {isLoading ? (
                        <TbodyShimmer rows={rows} columns={2} />
                    ) : (
                        <tbody>
                        {data?.map((row, index) => (
                            <tr key={index} className={`dark:text-gray-200 dark:bg-bodybg text-black ${row?.classes}`}>
                                <td className="border border-gray-400 p-2 whitespace-nowrap">
                                    {row?.label}
                                </td>
                                <td className="border border-gray-400 p-2 whitespace-nowrap text-right font-bold">
                                    {formatNumberWithCommas(row?.value)}
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

export default ExecutiveSummaryTable;
