import React from 'react';

const ConversionGobal = () => {
    const data2025 = [
        { date: 'Jan 01', visitors: 1250, orders: 87, conversion: '6.96%' },
        { date: 'Jan 02', visitors: 1180, orders: 92, conversion: '7.80%' },
        { date: 'Jan 03', visitors: 1340, orders: 78, conversion: '5.82%' },
        { date: 'Jan 04', visitors: 1420, orders: 105, conversion: '7.39%' },
        { date: 'Jan 05', visitors: 1095, orders: 63, conversion: '5.75%' }
    ];

    const data2024 = [
        { date: 'Jan 01', visitors: 1150, orders: 72, conversion: '6.26%' },
        { date: 'Jan 02', visitors: 1080, orders: 68, conversion: '6.30%' },
        { date: 'Jan 03', visitors: 1220, orders: 81, conversion: '6.64%' },
        { date: 'Jan 04', visitors: 1380, orders: 89, conversion: '6.45%' },
        { date: 'Jan 05', visitors: 980, orders: 58, conversion: '5.92%' }
    ];

    const total2025 = {
        visitors: 6285,
        orders: 425,
        conversion: '6.76%'
    };

    const total2024 = {
        visitors: 5810,
        orders: 368,
        conversion: '6.33%'
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat().format(num);
    };
    const getColorClass = (value) => {
        if (typeof value === 'string' && value.includes('%')) {
            const numValue = parseFloat(value.replace('%', ''));
            if (numValue > 0) return 'text-emerald-600';
            if (numValue < 0) return 'text-danger';
            return 'text-gray-800';
        }
        return 'text-gray-800';
    };

    return (
        <div className="flex gap-4 p-6 bg-white dark:text-gray-200 dark:bg-bodybg  min-h-screen">

            <div className="bg-white dark:text-gray-200 dark:bg-bodybg flex-1 ">
                <div className="bg-gray-800 text-white text-center py-2">
                    <h2 className="text-2xl font-bold">2025</h2>
                </div>

                <table className="w-full">
                    <thead>
                    <tr className="bg-[#4d5875] text-white border">
                        <th className="px-6 py-3 text-left font-semibold border">Date</th>
                        <th className="px-6 py-3 text-center font-semibold border">Visitors</th>
                        <th className="px-6 py-3 text-center font-semibold border">Orders</th>
                        <th className="px-6 py-3 text-center font-semibold border">Conversion</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data2025.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200 bg-white dark:text-gray-200 dark:bg-bodybg text-black">
                            <td className="px-6 py-3 font-medium border ">{row.date}</td>
                            <td className="px-6 py-3 text-center border">{formatNumber(row.visitors)}</td>
                            <td className="px-6 py-3 text-center border ">{row.orders}</td>
                            <td className={`px-2 py-1 border text-center font-medium  ${getColorClass(row.conversion)}`}>{row.conversion}</td>
                        </tr>
                    ))}
                    <tr className="bg-[#949eb7] border-t-2 border-gray-300">
                        <td className="px-6 py-3 font-bold  border">Total</td>
                        <td className="px-6 py-3 text-center font-bold  border">{formatNumber(total2025.visitors)}</td>
                        <td className="px-6 py-3 text-center font-bold  border">{total2025.orders}</td>
                        <td className="px-6 py-3 text-center font-bold  border">{total2025.conversion}</td>
                    </tr>
                    </tbody>
                </table>
            </div>


            <div className="bg-white  dark:text-gray-200 dark:bg-bodybg flex-1">
                <div className="bg-gray-800 text-white text-center py-2">
                    <h2 className="text-2xl font-bold">2024</h2>
                </div>

                <table className="w-full">
                    <thead>
                    <tr className="bg-[#4d5875] text-white border">
                        <th className="px-6 py-3 text-left font-semibold border">Date</th>
                        <th className="px-6 py-3 text-center font-semibold border">Visitors</th>
                        <th className="px-6 py-3 text-center font-semibold border">Orders</th>
                        <th className="px-6 py-3 text-center font-semibold border">Conversion</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data2024.map((row, index) => (
                        <tr key={index} className="border-b border-gray-200 bg-white dark:text-gray-200 dark:bg-bodybg text-black">
                            <td className="px-6 py-3 font-medium  border">{row.date}</td>
                            <td className="px-6 py-3 text-center  border">{formatNumber(row.visitors)}</td>
                            <td className="px-6 py-3 text-center  border">{row.orders}</td>
                            <td className={`px-2 py-1 border text-center font-medium ${getColorClass(row.conversion)}`}>{row.conversion}</td>
                        </tr>
                    ))}
                    <tr className="bg-[#949eb7] border-t-2 border-gray-300">
                        <td className="px-6 py-3 font-bold ">Total</td>
                        <td className="px-6 py-3 text-center font-bold  border">{formatNumber(total2024.visitors)}</td>
                        <td className="px-6 py-3 text-center font-bold  border">{total2024.orders}</td>
                        <td className="px-6 py-3 text-center font-bold  border">{total2024.conversion}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ConversionGobal;