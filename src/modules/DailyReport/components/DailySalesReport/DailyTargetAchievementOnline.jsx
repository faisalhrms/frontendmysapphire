
import React, { useEffect, useState } from 'react';



const data = [
    {
        date: "2025-03-15",
        day: "Monday",
        storeType: "Offline",
        fullPriceOfflineTarget: 500,
        fullPriceOfflineSale: 450,
        fullPriceOfflineAch: 90,
        discountedOfflineTarget: 300,
        discountedOfflineSale: 250,
        discountedOfflineAch: 83.33,
        totalOfflineTarget: 800,
        totalOfflineSale: 700,
        totalOfflineAch: 87.5,

        fullPriceOnlineTarget: 600,
        fullPriceOnlineSale: 550,
        fullPriceOnlineAch: 91.67,
        discountedOnlineTarget: 400,
        discountedOnlineSale: 350,
        discountedOnlineAch: 87.5,
        totalOnlineTarget: 1000,
        totalOnlineSale: 900,
        totalOnlineAch: 90,

        totalTarget: 1800,
        totalSale: 1600,
        totalAch: 88.89
    },
    {
        date: "2025-03-16",
        day: "Tuesday",
        storeType: "Online",
        fullPriceOfflineTarget: 500,
        fullPriceOfflineSale: 475,
        fullPriceOfflineAch: 95,
        discountedOfflineTarget: 300,
        discountedOfflineSale: 280,
        discountedOfflineAch: 93.33,
        totalOfflineTarget: 800,
        totalOfflineSale: 755,
        totalOfflineAch: 94.38,

        fullPriceOnlineTarget: 650,
        fullPriceOnlineSale: 625,
        fullPriceOnlineAch: 96.15,
        discountedOnlineTarget: 450,
        discountedOnlineSale: 425,
        discountedOnlineAch: 94.44,
        totalOnlineTarget: 1100,
        totalOnlineSale: 1050,
        totalOnlineAch: 95.45,

        totalTarget: 1900,
        totalSale: 1805,
        totalAch: 95
    },
    {
        date: "2025-03-15",
        day: "Monday",
        storeType: "Offline", // Store type (Offline or Online)
        fullPriceOfflineTarget: 500,
        fullPriceOfflineSale: 450,
        fullPriceOfflineAch: 90, // Achievement in percentage for Offline Full Price
        discountedOfflineTarget: 300,
        discountedOfflineSale: 250,
        discountedOfflineAch: 83.33, // Achievement in percentage for Offline Discounted
        totalOfflineTarget: 800,
        totalOfflineSale: 700,
        totalOfflineAch: 87.5, // Achievement in percentage for Offline Total

        fullPriceOnlineTarget: 600,
        fullPriceOnlineSale: 550,
        fullPriceOnlineAch: 91.67, // Achievement in percentage for Online Full Price
        discountedOnlineTarget: 400,
        discountedOnlineSale: 350,
        discountedOnlineAch: 87.5, // Achievement in percentage for Online Discounted
        totalOnlineTarget: 1000,
        totalOnlineSale: 900,
        totalOnlineAch: 90, // Achievement in percentage for Online Total

        totalTarget: 1800,
        totalSale: 1600,
        totalAch: 88.89 // Total achievement percentage
    },
    {
        date: "2025-03-16",
        day: "Tuesday",
        storeType: "Online",
        fullPriceOfflineTarget: 500,
        fullPriceOfflineSale: 475,
        fullPriceOfflineAch: 95,
        discountedOfflineTarget: 300,
        discountedOfflineSale: 280,
        discountedOfflineAch: 93.33,
        totalOfflineTarget: 800,
        totalOfflineSale: 755,
        totalOfflineAch: 94.38,

        fullPriceOnlineTarget: 650,
        fullPriceOnlineSale: 625,
        fullPriceOnlineAch: 96.15,
        discountedOnlineTarget: 450,
        discountedOnlineSale: 425,
        discountedOnlineAch: 94.44,
        totalOnlineTarget: 1100,
        totalOnlineSale: 1050,
        totalOnlineAch: 95.45,

        totalTarget: 1900,
        totalSale: 1805,
        totalAch: 95
    },
];


const DailyTargetAchievementOnline = ({ filters }) => {
    const [filteredData, setFilteredData] = useState(data);
    const [loading, setLoading] = useState(false);

    // Format date as YYYY-MM-DD
    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return new Date(year, month - 1, day);
    };

    useEffect(() => {
        if (filters.date_from && filters.date_to) {
            setLoading(true);

            const startDate = formatDate(filters.date_from);
            const endDate = formatDate(filters.date_to);

            const filtered = data.filter((row) => {
                const rowDate = formatDate(row.date);
                return rowDate >= startDate && rowDate <= endDate;
            });

            setFilteredData(data);
            setLoading(false);
        }
    }, [filters]);

    const getAchColor = (achPercentage) => {
        return achPercentage < 0 ? 'text-danger' : 'text-success';
    };

    const getAchIcon = (achPercentage) => {
        return achPercentage < 0 ? <i className="ri-arrow-down-s-line"></i> : <i className="ri-arrow-up-s-line"></i>;
    };

    return (
        <div className="overflow-x-auto p-4 bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
            <div className="overflow-x-auto max-w-full">
                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
                    <table className="min-w-full table-auto border-collapse border border-gray-400">
                        <thead style={{backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white"}}>
                        <tr style={{backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white"}}>
                            <th rowSpan="2" className="py-2 px-2 border border-gray-400 p-2 text-center"></th>
                            <th colSpan="1" className="py-2 px-2 border border-gray-400 p-2 text-center">Store Type</th>
                            <th colSpan="9" className="py-2 px-2 border border-gray-400 p-2 text-center">Offline</th>
                            <th colSpan="9" className="py-2 px-2 border border-gray-400 p-2 text-center">Online</th>
                            <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>
                        </tr>
                        <tr style={{backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white"}}>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center"></th>
                            <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Full Price</th>
                            <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Discounted</th>
                            <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>
                            <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Full Price</th>
                            <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Discounted</th>
                            <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>

                            <th colSpan="3" className="py-2 px-4 border border-gray-400 p-2 text-center"></th>
                        </tr>
                        <tr style={{backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white"}}>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Date</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Day</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Target</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Actual Sale</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Ach%</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Target</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Actual Sale</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Ach%</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Target</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Actual Sale</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Ach%</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Target</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Actual Sale</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Ach%</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Target</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Actual Sale</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Ach%</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Target</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Actual Sale</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Ach%</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Target</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Actual Sale</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Ach%</th>


                        </tr>
                        </thead>
                        <tbody>


                        {filteredData.map((row, index) => (
                            <tr key={index}>

                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.date}</td>

                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.day}</td>

                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.fullPriceOfflineTarget}</td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.fullPriceOfflineSale}</td>
                                <td className={`py-2 px-2 border border-gray-400 p-2 text-center ${getAchColor(row.fullPriceOfflineAch)}`}>
                                    {getAchIcon(row.fullPriceOfflineAch)} {row.fullPriceOfflineAch}%
                                </td>

                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.discountedOfflineTarget}</td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.discountedOfflineSale}</td>
                                <td className={`py-2 px-2 border border-gray-400 p-2 text-center ${getAchColor(row.discountedOfflineAch)}`}>
                                    {getAchIcon(row.discountedOfflineAch)} {row.discountedOfflineAch}%
                                </td>

                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.totalOfflineTarget}</td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.totalOfflineSale}</td>
                                <td className={`py-2 px-2 border border-gray-400 p-2 text-center ${getAchColor(row.totalOfflineAch)}`}>
                                    {getAchIcon(row.totalOfflineAch)} {row.totalOfflineAch}%
                                </td>

                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.fullPriceOnlineTarget}</td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.fullPriceOnlineSale}</td>
                                <td className={`py-2 px-2 border border-gray-400 p-2 text-center ${getAchColor(row.fullPriceOnlineAch)}`}>
                                    {getAchIcon(row.fullPriceOnlineAch)} {row.fullPriceOnlineAch}%
                                </td>

                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.discountedOnlineTarget}</td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.discountedOnlineSale}</td>
                                <td className={`py-2 px-2 border border-gray-400 p-2 text-center ${getAchColor(row.discountedOnlineAch)}`}>
                                    {getAchIcon(row.discountedOnlineAch)} {row.discountedOnlineAch}%
                                </td>

                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.totalOnlineTarget}</td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.totalOnlineSale}</td>
                                <td className={`py-2 px-2 border border-gray-400 p-2 text-center ${getAchColor(row.totalOnlineAch)}`}>
                                    {getAchIcon(row.totalOnlineAch)} {row.totalOnlineAch}%
                                </td>

                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.totalTarget}</td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.totalSale}</td>
                                <td className={`py-2 px-2 border border-gray-400 p-2 text-center ${getAchColor(row.totalAch)}`}>
                                    {getAchIcon(row.totalAch)} {row.totalAch}%
                                </td>
                            </tr>
                        ))}


                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default DailyTargetAchievementOnline;
