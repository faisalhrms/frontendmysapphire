import React from 'react';

const SummaryTable = ({ data,getGrowthColor }) => {
    const sales_summary = data?.sales_summary;
    return (
        <div className="p-4 bg-white mt-4 mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
            <div className="mb-6">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="text-white bg-[#383853]">
                        <th colSpan="7" className="bg-blue-300 border border-gray-400 p-2 text-center">Full Price
                        </th>
                    </tr>
                    <tr className="text-white bg-[#383853]">
                        <th colSpan="2" className="bg-blue-300 border border-gray-400 p-2 text-center">
                        </th>
                        <th colSpan="2" className="bg-blue-300 border border-gray-400 p-2 text-center">Current
                            Year
                        </th>
                        <th colSpan="2" className="bg-blue-300 border border-gray-400 p-2 text-center">Last Year
                        </th>
                        <th className="bg-blue-300 border border-gray-400 p-2 text-center">Growth</th>
                    </tr>
                    <tr className="border border-gray-400 text-white bg-[#4d5875]">
                        <th className="bg-blue-200 p-2 text-center"></th>
                        <th className="bg-blue-200 p-2 text-center"></th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">
                            Last Day ({sales_summary?.this_year?.day})
                        </th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">MTD</th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">
                            Last Day ({sales_summary?.last_year?.day})
                        </th>

                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">MTD</th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">MTD</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data?.sales_summary?.data?.map((row, index) => (
                        <tr
                            key={index}
                            className={`border border-gray-400 p-2 whitespace-nowrap text-black
    ${row.category === "Total"
                                ? "bg-gray-200 font-bold dark:text-gray-200 dark:bg-bodybg"
                                : "dark:text-gray-200 dark:bg-bodybg"}
  `}
                        >
                            <td className="font-bold p-2"></td>
                            <td className="font-bold p-2">{row?.category}</td>
                            <td className="border border-gray-400 p-2 text-right">{row?.this_year?.last_day}</td>
                            <td className="border border-gray-400 p-2 text-right">{row?.this_year?.mtd}</td>
                            <td className="border border-gray-400 p-2 text-right">{row?.last_year?.last_day}</td>
                            <td className="border border-gray-400 p-2 text-right">{row?.last_year?.mtd}</td>
                            <td className={`border border-gray-400 font-bold p-2 text-center ${getGrowthColor(row?.growth)}`}>
                                {row?.growth}%
                            </td>
                        </tr>

                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default SummaryTable;