import React from 'react';

const SalesPerformanceTable = () => {

    const salesData = [
        { date: '01-Feb-2025', fullPrice: { actual: 6711630, target: 19598625, achievement: -66 },
            discounted: { actual: 1739470, target: 2100840, achievement: -17 } },
        { date: '26-Feb-2025', fullPrice: { actual: 25476854, target: 19626348, achievement: 130 },
            discounted: { actual: 4222781, target: 2100840, achievement: 101 } }
    ];

    const getGrowthColor = (growth) => {
        return growth < 0 ? 'text-danger' : 'text-success';
    };

    return (
        <div className="p-6 bg-white mt-4  rounded-lg dark:text-gray-200 dark:bg-bodybg">
            <div className="overflow-x-auto border border-gray-400">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                    <tr style={{ backgroundColor: '#0b3588', color: 'white' }}>
                        <th className="border p-2"></th>
                        <th colSpan="3" className="border p-2 bg-blue-100">Full Price</th>
                        <th colSpan="3" className="border p-2 bg-yellow-100">Discounted</th>
                    </tr>
                    <tr style={{ backgroundColor: '#0b3588', color: 'white' }}>
                        <th className="border border-gray-300  p-2"> Date</th>
                        <th className="border border-gray-300  p-2 bg-blue-50">Actual Sales</th>
                        <th className="border border-gray-300  p-2 bg-blue-50">Target Sales</th>
                        <th className="border border-gray-300  p-2 bg-blue-50">Achievement</th>
                        <th className="border border-gray-300  p-2 bg-yellow-50">Actual Sales</th>
                        <th className="border border-gray-300  p-2 bg-yellow-50">Target Sales</th>
                        <th className="border border-gray-300  p-2 bg-yellow-50">Achievement</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr className="font-bold bg-gray-200 dark:text-gray-200 dark:bg-bodybg">
                        <td className="border border-gray-300 p-2 text-center">Total</td>
                        <td className="border border-gray-300 p-2 text-right">
                            {salesData.reduce((sum, row) => sum + row.fullPrice.actual, 0).toLocaleString()}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                            {salesData.reduce((sum, row) => sum + row.fullPrice.target, 0).toLocaleString()}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                            {((salesData.reduce((sum, row) => sum + row.fullPrice.actual, 0) /
                                salesData.reduce((sum, row) => sum + row.fullPrice.target, 0) - 1) * 100).toFixed(0)}%
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                            {salesData.reduce((sum, row) => sum + row.discounted.actual, 0).toLocaleString()}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                            {salesData.reduce((sum, row) => sum + row.discounted.target, 0).toLocaleString()}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                            {((salesData.reduce((sum, row) => sum + row.discounted.actual, 0) /
                                salesData.reduce((sum, row) => sum + row.discounted.target, 0) - 1) * 100).toFixed(0)}%
                        </td>
                    </tr>
                    {salesData.map((row, index) => (

                        <tr key={index}>
                            <td className="border border-gray-300 font-bold p-2 text-center">{row.date}</td>
                            <td className="border border-gray-300 p-2 text-right">
                                {row.fullPrice.actual.toLocaleString()}
                            </td>
                            <td className="border border-gray-300 p-2 text-right">
                                {row.fullPrice.target.toLocaleString()}
                            </td>
                            <td className={`border border-gray-300 p-2 text-right ${getGrowthColor(row.fullPrice.achievement)}`}>
                                {row.fullPrice.achievement}%
                            </td>
                            <td className="border border-gray-300 p-2 text-right">
                                {row.discounted.actual.toLocaleString()}
                            </td>
                            <td className="border border-gray-300 p-2 text-right">
                                {row.discounted.target.toLocaleString()}
                            </td>
                            <td className={`border border-gray-300 p-2 text-right ${getGrowthColor(row.discounted.achievement)}`}>
                                {row.discounted.achievement}%
                            </td>
                        </tr>
                    ))}

                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesPerformanceTable;
