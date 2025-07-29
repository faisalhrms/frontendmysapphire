import React from 'react';

const ConversionLocal = ({ data }) => {
    const data2025 = data?.cy_data?.filter((row) => row.report_date !== '') || [];
    const data2024 = data?.ly_data?.filter((row) => row.report_date !== '') || [];

    const total2025 = data?.cy_data?.find((row) => row.report_date === '') || {
        visitors: '0',
        orders: '0',
        conv_percentage: 0,
    };

    const total2024 = {
        visitors: 'N/A',
        orders: 'N/A',
        conversion: 'N/A',
    };

    const formatNumber = (num) => {
        if (num === '-' || num === 'N/A') return num;
        return new Intl.NumberFormat().format(parseInt(num.toString().replace(/,/g, '')));
    };

    const getColorClass = (value) => {
        if (typeof value === 'string' && value.includes('%')) {
            const numValue = parseFloat(value.replace('%', ''));
            if (numValue > 0) return 'text-emerald-600';
            if (numValue < 0) return 'text-red-600';
            return 'text-gray-800 dark:text-gray-200';
        }
        if (typeof value === 'number') {
            if (value > 0) return 'text-emerald-600';
            if (value < 0) return 'text-red-600';
            return 'text-gray-800 dark:text-gray-200';
        }
        return 'text-gray-800 dark:text-gray-200';
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 p-4 sm:p-6 bg-white dark:bg-gray-900 dark:text-gray-200 min-h-screen">
            {/* 2025 Table */}
            <div className="flex-1 overflow-x-auto">
                <div className="bg-gray-800 text-white text-center py-2">
                    <h2 className="text-xl sm:text-2xl font-bold">{data?.year_info?.current_year || '2025'}</h2>
                </div>
                <table className="w-full text-sm sm:text-base">
                    <thead>
                    <tr className="bg-gray-600 text-white">
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold border">Date</th>
                        <th className="px-4 sm:px-6 py-3 text-center font-semibold border">Visitors</th>
                        <th className="px-4 sm:px-6 py-3 text-center font-semibold border">Orders</th>
                        <th className="px-4 sm:px-6 py-3 text-center font-semibold border">Conversion</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data2025.length > 0 ? (
                        data2025.map((row, index) => (
                            <tr
                                key={index}
                                className="font-medium bg-white dark:text-gray-200 dark:bg-bodybg whitespace-nowrap"
                            >
                                <td className="px-2 sm:px-6 py-3  border">{row.report_date}</td>
                                <td className="px-2 sm:px-6 py-3 text-center border">{formatNumber(row.visitors)}</td>
                                <td className="px-2 sm:px-6 py-3 text-center border">{formatNumber(row.orders)}</td>
                                <td
                                    className={`px-2 sm:px-6 py-3 text-center font-medium border ${getColorClass(row.conv_percentage)}`}
                                >
                                    {row.conv_percentage.toFixed(2)}%
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="px-4 sm:px-6 py-3 text-center border">
                                No data available for {data?.year_info?.current_year || '2025'}
                            </td>
                        </tr>
                    )}
                    <tr className="bg-gray-300 dark:bg-gray-700 border-t-2 border-gray-400">
                        <td className="px-4 sm:px-6 py-3 font-bold border">Total</td>
                        <td className="px-4 sm:px-6 py-3 text-center font-bold border">
                            {formatNumber(total2025.visitors)}
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-center font-bold border">
                            {formatNumber(total2025.orders)}
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-center font-bold border">
                            {total2025.conv_percentage.toFixed(2)}%
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* 2024 Table */}
            <div className="flex-1 overflow-x-auto">
                <div className="bg-gray-800 text-white text-center py-2">
                    <h2 className="text-xl sm:text-2xl font-bold">{data?.year_info?.comparative_year || '2024'}</h2>
                </div>
                <table className="w-full text-sm sm:text-base">
                    <thead>
                    <tr className="bg-gray-600 text-white">
                        <th className="px-4 sm:px-6 py-3 text-left font-semibold border">Date</th>
                        <th className="px-4 sm:px-6 py-3 text-center font-semibold border">Visitors</th>
                        <th className="px-4 sm:px-6 py-3 text-center font-semibold border">Orders</th>
                        <th className="px-4 sm:px-6 py-3 text-center font-semibold border">Conversion</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data2024.length > 0 ? (
                        data2024.map((row, index) => (
                            <tr
                                key={index}
                                className="border-b border-gray-200 bg-white dark:bg-gray-800 dark:text-gray-200"
                            >
                                <td className="px-4 sm:px-6 py-3 font-medium border">{row.report_date}</td>
                                <td className="px-4 sm:px-6 py-3 text-center border">{formatNumber(row.visitors)}</td>
                                <td className="px-4 sm:px-6 py-3 text-center border">{formatNumber(row.orders)}</td>
                                <td
                                    className={`px-4 sm:px-6 py-3 text-center font-medium border ${getColorClass(row.conv_percentage)}`}
                                >
                                    {row.conv_percentage.toFixed(2)}%
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="px-4 sm:px-6 py-3 text-center border">
                                No data available for {data?.year_info?.comparative_year || '2024'}
                            </td>
                        </tr>
                    )}
                    <tr className="bg-gray-300 dark:bg-gray-700 border-t-2 border-gray-400">
                        <td className="px-4 sm:px-6 py-3 font-bold border">Total</td>
                        <td className="px-4 sm:px-6 py-3 text-center font-bold border">
                            {formatNumber(total2024.visitors)}
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-center font-bold border">
                            {formatNumber(total2024.orders)}
                        </td>
                        <td className="px-4 sm:px-6 py-3 text-center font-bold border">
                            {total2024.conversion}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ConversionLocal;