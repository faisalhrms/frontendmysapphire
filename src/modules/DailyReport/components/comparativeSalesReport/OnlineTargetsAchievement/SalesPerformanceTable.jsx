import React from 'react';

const SalesPerformanceTable = ({ data, isLoading }) => {
    if (isLoading) {
        return null;
    }
    const getGrowthColor = (achievement) => {
        return parseFloat(achievement) < 100 ? 'text-red' : 'text-emerald-600';
    };

    return (
        <div className="p-6 bg-white mt-4 rounded-lg dark:text-gray-200 dark:bg-bodybg mb-6">

            <div
                className="overflow-x-auto overflow-y-auto border border-gray-400"
                style={{ maxHeight: '650px' }}
            >
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                    <tr
                        className="text-white bg-[#383853]"
                        style={{ position: 'sticky', top: 0, zIndex: 10 }}
                    >
                        <th className="border p-2"></th>
                        <th colSpan="3" className="border p-2 bg-blue-100">
                            Full Price
                        </th>
                        <th colSpan="3" className="border p-2 bg-yellow-100">
                            Discounted
                        </th>
                    </tr>
                    <tr
                        className="text-white bg-[#4d5875]"
                        style={{ position: 'sticky', top: '38px', zIndex: 10 }}
                    >
                        <th className="border p-2">Date</th>
                        <th className="border p-2">Actual Sales</th>
                        <th className="border p-2">Target Sales</th>
                        <th className="border p-2">Achievement</th>
                        <th className="border p-2">Actual Sales</th>
                        <th className="border p-2">Target Sales</th>
                        <th className="border p-2">Achievement</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((row, index) => {
                        const isTotalRow = row.date === 'Total';
                        const rowClass = isTotalRow ? 'bg-[#949eb7] font-bold' : '';


                        const totalRowStyle = isTotalRow
                            ? { position: 'sticky', bottom: 0, backgroundColor: '#949eb7', zIndex: 5 }
                            : {};

                        return (
                            <tr key={index} className={rowClass} style={totalRowStyle}>
                                <td className="border p-2 text-center border-gray-400 text-black dark:text-gray-200 font-bold dark:bg-bodybg">{row.date}</td>
                                <td className="border border-gray-400 p-2 text-right text-black dark:text-gray-200 dark:bg-bodybg">{row.full_price.actual_sale}</td>
                                <td className="border border-gray-400 p-2 text-right text-black dark:text-gray-200 dark:bg-bodybg">{row.full_price.target_sale}</td>
                                <td
                                    className={`border p-2 text-center font-bold border-gray-400 text-black dark:text-gray-200 dark:bg-bodybg ${getGrowthColor(
                                        row.full_price.achievement
                                    )}`}
                                >
                                    {row.full_price.achievement}%
                                </td>
                                <td className="border border-gray-400 p-2 text-right text-black dark:text-gray-200 dark:bg-bodybg">{row.discounted.actual_sale}</td>
                                <td className="border border-gray-400 p-2 text-right text-black dark:text-gray-200 dark:bg-bodybg">{row.discounted.target_sale}</td>
                                <td
                                    className={`border font-bold border-gray-400 p-2 text-center text-black dark:text-gray-200 dark:bg-bodybg ${getGrowthColor(
                                        row.discounted.achievement
                                    )}`}
                                >
                                    {row.discounted.achievement}%
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesPerformanceTable;
