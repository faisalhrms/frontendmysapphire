import React, { useEffect, useState } from 'react';
import { fetchSaleCvVsLyData } from "../../services/wiseside_services.js"

const CYVsLYGrowth = ({ filters }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Function to format the date
    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return new Date(year, month - 1, day);
    };

    // Fetch data on filter changes
    useEffect(() => {
        if (filters.date_from && filters.date_to) {
            setLoading(true);

            fetchSaleCvVsLyData(filters.date_from, filters)
                .then((responseData) => {
                    setData(responseData);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching sales data:", error);
                    setLoading(false);
                });
        }
    }, [filters]);

    // Function to get the achievement color
    const getAchColor = (achPercentage) => {
        return achPercentage < 0 ? 'text-danger' : 'text-success';
    };

    // Function to get the achievement icon
    const getAchIcon = (achPercentage) => {
        return achPercentage < 0 ? <i className="text-danger"></i> : <i className="text-success"></i>;
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
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">CY</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">LY</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Growth%</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">CY</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">LY</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Growth%</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">CY</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">LY</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Growth%</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">CY</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">LY</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Growth%</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">CY</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">LY</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Growth%</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">CY</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">LY</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Growth%</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">CY</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">LY</th>
                            <th className="py-2 px-4 border border-gray-400 p-2 text-center">Growth%</th>


                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row, index) => (
                            <tr key={index}>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.Date}</td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.Day}</td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.FullPriceOfflineCY}</td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.FullPriceOfflineLY}</td>
                                <td className={`py-2 px-2 border border-gray-400 p-2 text-center ${getAchColor(row.FullPriceOfflineGrowth)}`}>
                                    {getAchIcon(row.FullPriceOfflineGrowth)} {row.FullPriceOfflineGrowth}%
                                </td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.DiscountedOfflineCY}</td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.DiscountedOfflineLY}</td>
                                <td className={`py-2 px-2 border border-gray-400 p-2 text-center ${getAchColor(row.DiscountedOfflineGrowth)}`}>
                                    {getAchIcon(row.DiscountedOfflineGrowth)} {row.DiscountedOfflineGrowth}%
                                </td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.TotalOfflineCY}</td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.TotalOfflineLY}</td>
                                <td className={`py-2 px-2 border border-gray-400 p-2 text-center ${getAchColor(row.TotalOfflineGrowth)}`}>
                                    {getAchIcon(row.TotalOfflineGrowth)} {row.TotalOfflineGrowth}%
                                </td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.FullPriceOnlineCY}</td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.FullPriceOnlineLY}</td>
                                <td className={`py-2 px-2 border border-gray-400 p-2 text-center ${getAchColor(row.FullPriceOnlineGrowth)}`}>
                                    {getAchIcon(row.FullPriceOnlineGrowth)} {row.FullPriceOnlineGrowth}%
                                </td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.DiscountedOnlineCY}</td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.DiscountedOnlineLY}</td>
                                <td className={`py-2 px-2 border border-gray-400 p-2 text-center ${getAchColor(row.DiscountedOnlineGrowth)}`}>
                                    {getAchIcon(row.DiscountedOnlineGrowth)} {row.DiscountedOnlineGrowth}%
                                </td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.TotalOnlineCY}</td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.TotalOnlineLY}</td>
                                <td className={`py-2 px-2 border border-gray-400 p-2 text-center ${getAchColor(row.TotalOnlineGrowth)}`}>
                                    {getAchIcon(row.TotalOnlineGrowth)} {row.TotalOnlineGrowth}%
                                </td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.TotalCY}</td>
                                <td className="py-2 px-2 border border-gray-400 p-2 text-center">{row.TotalLY}</td>
                                <td className={`py-2 px-2 border border-gray-400 p-2 text-center ${getAchColor(row.TotalGrowth)}`}>
                                    {getAchIcon(row.TotalGrowth)} {row.TotalGrowth}%
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

export default CYVsLYGrowth;
