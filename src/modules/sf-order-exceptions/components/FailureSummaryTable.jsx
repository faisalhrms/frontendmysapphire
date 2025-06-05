import React from 'react';
import {formatNumberWithCommas} from "@helpers/formatters.js";

const FailureSummaryTable = ({ title, data }) => {
    return (
        <div className='xl:col-span-3 col-span-12'>
            <table className="w-full border-collapse">
                <thead>
                <tr className="text-white bg-[#383853]">
                    <th colSpan="2" className="bg-blue-300 border border-gray-400 p-2 text-center">{title}</th>
                </tr>
                <tr className="text-white bg-[#383853]">
                    <th className="bg-blue-300 border border-gray-400 p-2 text-center">Month</th>
                    <th className="bg-blue-300 border border-gray-400 p-2 text-center">Count</th>
                </tr>
                </thead>
                <tbody>
                {data?.map((row, index) => (
                    <tr
                        key={index}
                        className={row.month === "Grand Total" ? "font-bold bg-[#949eb7] dark:text-gray-200 dark:bg-bodybg text-black" : ""}
                    >
                        <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black">
                            {row?.month}
                        </td>
                        <td className="border border-gray-400 p-2 whitespace-nowrap dark:text-gray-200 dark:bg-bodybg text-black text-right">
                            {formatNumberWithCommas(row?.total)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default FailureSummaryTable;
