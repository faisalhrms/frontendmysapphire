import React from 'react';

const AClassIslamicOnline = ({ data, getGrowthColor}) => {
    if (!data || !data.sales_summary) {
        return null;
    }

    const { sales_summary } = data;
    const { this_year, last_year } = sales_summary;
    return (
        <div className="p-4 bg-white mt-4 mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
            <div className="mb-6">
                <table className="w-full border-collapse">
                    <thead>
                    <tr  className="text-white bg-[#383853]">
                        <th colSpan="7" className="bg-blue-300 border border-gray-400 p-2 text-center">
                            Full Price
                        </th>
                    </tr>
                    <tr className="text-white bg-[#383853]">
                        <th colSpan="2" className="bg-blue-300 border border-gray-400 p-2 text-center"></th>
                        <th colSpan="2" className="bg-blue-300 border border-gray-400 p-2 text-center">Current Year</th>
                        <th colSpan="2" className="bg-blue-300 border border-gray-400 p-2 text-center">Last Year</th>
                        <th className="bg-blue-300 border border-gray-400 p-2 text-center">Growth</th>
                    </tr>
                    <tr className="border border-gray-400 text-white bg-[#4d5875]">
                        <th className="bg-blue-200 p-2 text-center"></th>
                        <th className="bg-blue-200 p-2 text-center"></th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">
                            Last Day ({this_year.day})
                        </th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">MTD</th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">
                            Last Day ({last_year.day})
                        </th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">MTD</th>
                        <th className="bg-blue-200 border border-gray-400 p-2 text-center">MTD</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sales_summary?.data?.map((item, index) => (
                        <tr
                            key={index}
                            className={`border border-gray-400 ${
                                index === 0 ? 'bg-gray-200 font-bold' : ''
                            } dark:text-gray-200 dark:bg-bodybg text-black`}
                        >
                            <td className="p-2"></td>
                            <td className="p-2 font-bold">{item.category}</td>
                            <td className="border border-gray-400 p-2 text-right dark:text-gray-200 dark:bg-bodybg  text-black">{item.this_year.last_day}</td>
                            <td className="border border-gray-400 p-2 text-right text-black dark:text-gray-200 dark:bg-bodybg">{item.this_year.mtd}</td>
                            <td className="border border-gray-400 p-2 text-right text-black dark:text-gray-200 dark:bg-bodybg">{item.last_year.last_day}</td>
                            <td className="border border-gray-400 p-2 text-right text-black dark:text-gray-200 dark:bg-bodybg">{item.last_year.mtd}</td>
                            <td className={`border border-gray-400 p-2 font-bold text-center  ${getGrowthColor(item.growth)}`}>
                                {item.growth}%
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AClassIslamicOnline;
