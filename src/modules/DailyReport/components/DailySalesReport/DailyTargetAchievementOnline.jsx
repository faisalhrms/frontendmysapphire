
import React, { useEffect, useState } from 'react';
import { fetchTargetSaleData } from "../../services/wiseside_services.js";

const DailyTargetAchievementOnline = ({ data , loading }) => {
    // const [data, setData] = useState([]);
    // const [loading, setLoading] = useState(false);

    console.log(data)

    const formatApiDate = (dayNumber) => {
        const day = dayNumber.toString();
        return `${day}`;
    };

    const formatNumberWithCommas = (num) => {
        if (num === 0 || num == null) return "-";
        return num.toLocaleString();
    };

    const parseDate = (dateStr) => {
        const [year, month, day] = dateStr.split("-");
        return new Date(year, month - 1, day);
    };

    const calcAch = (sale, target) => {
        if (!target || target === 0) return 0;
        const result = ((sale / target) - 1) * 100;
        return Number(result.toFixed(2));
    };

    // useEffect(() => {
    //     if (filters.date_from && filters.date_to) {
    //         setLoading(true);
    //
    //         fetchTargetSaleData(filters.date_from, filters)
    //             .then((apiData) => {
    //                 const startDate = parseDate(filters.date_from);
    //                 const endDate = parseDate(filters.date_to);
    //
    //                 const filtered = apiData.filter((row) => {
    //                     const rowDate = parseDate(formatApiDate(row.date));
    //                     return rowDate >= startDate && rowDate <= endDate;
    //                 });
    //
    //                 const computed = filtered.map((row) => {
    //                     const fullPriceOfflineAch = calcAch(row.fullPriceOfflineSale, row.fullPriceOfflineTarget);
    //                     const discountedOfflineAch = calcAch(row.discountedOfflineSale, row.discountedOfflineTarget);
    //                     const totalOfflineAch = calcAch(row.totalOfflineSale, row.totalOfflineTarget);
    //
    //                     const fullPriceOnlineAch = calcAch(row.fullPriceOnlineSale, row.fullPriceOnlineTarget);
    //                     const discountedOnlineAch = calcAch(row.discountedOnlineSale, row.discountedOnlineTarget);
    //                     const totalOnlineAch = calcAch(row.totalOnlineSale, row.totalOnlineTarget);
    //
    //                     const totalAch = calcAch(row.totalSale, row.totalTarget);
    //
    //                     return {
    //                         ...row,
    //                         fullPriceOfflineAch,
    //                         discountedOfflineAch,
    //                         totalOfflineAch,
    //                         fullPriceOnlineAch,
    //                         discountedOnlineAch,
    //                         totalOnlineAch,
    //                         totalAch
    //                     };
    //                 });
    //
    //                 setData(computed.length > 0 ? computed : apiData);
    //                 setLoading(false);
    //             })
    //             .catch((error) => {
    //                 console.error("Error fetching data:", error);
    //                 setLoading(false);
    //             });
    //     }
    // }, [filters]);

    const getAchColor = (achPercentage) => {
        if (achPercentage === null || achPercentage === 0) {
            return 'text-black';  // Return black color for null or 0
        }
        return achPercentage < 0 ? 'text-danger' : 'text-success'; // Return danger for negative, success for positive
    };


    const getAchIcon = (achPercentage) => {
        return achPercentage < 0
            ? <i className=""></i>
            : <i className=""></i>;
    };

    const totals = data.reduce(
        (acc, row) => {
            acc.fullPriceOfflineTarget += row.fullPriceOfflineTarget || 0;
            acc.fullPriceOfflineSale += row.fullPriceOfflineSale || 0;
            acc.discountedOfflineTarget += row.discountedOfflineTarget || 0;
            acc.discountedOfflineSale += row.discountedOfflineSale || 0;
            acc.totalOfflineTarget += row.totalOfflineTarget || 0;
            acc.totalOfflineSale += row.totalOfflineSale || 0;
            acc.fullPriceOnlineTarget += row.fullPriceOnlineTarget || 0;
            acc.fullPriceOnlineSale += row.fullPriceOnlineSale || 0;
            acc.discountedOnlineTarget += row.discountedOnlineTarget || 0;
            acc.discountedOnlineSale += row.discountedOnlineSale || 0;
            acc.totalOnlineTarget += row.totalOnlineTarget || 0;
            acc.totalOnlineSale += row.totalOnlineSale || 0;
            acc.totalTarget += row.totalTarget || 0;
            acc.totalSale += row.totalSale || 0;
            return acc;
        },
        {
            fullPriceOfflineTarget: 0,
            fullPriceOfflineSale: 0,
            discountedOfflineTarget: 0,
            discountedOfflineSale: 0,
            totalOfflineTarget: 0,
            totalOfflineSale: 0,
            fullPriceOnlineTarget: 0,
            fullPriceOnlineSale: 0,
            discountedOnlineTarget: 0,
            discountedOnlineSale: 0,
            totalOnlineTarget: 0,
            totalOnlineSale: 0,
            totalTarget: 0,
            totalSale: 0,
        }
    );

    const totalsAch = {
        fullPriceOfflineAch: calcAch(totals.fullPriceOfflineSale, totals.fullPriceOfflineTarget),
        discountedOfflineAch: calcAch(totals.discountedOfflineSale, totals.discountedOfflineTarget),
        totalOfflineAch: calcAch(totals.totalOfflineSale, totals.totalOfflineTarget),
        fullPriceOnlineAch: calcAch(totals.fullPriceOnlineSale, totals.fullPriceOnlineTarget),
        discountedOnlineAch: calcAch(totals.discountedOnlineSale, totals.discountedOnlineTarget),
        totalOnlineAch: calcAch(totals.totalOnlineSale, totals.totalOnlineTarget),
        totalAch: calcAch(totals.totalSale, totals.totalTarget),
    };

    return (
        <div className="bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg p-4">
            {loading ? (
                <div className="text-center py-4">Loading...</div>
            ) : (
                <div className="relative">

                    <div className="relative overflow-auto" style={{ maxHeight: '70vh'}}>
                        <table className="w-full border-collapse border border-gray-400">
                            <thead className="sticky top-0 z-10">
                            <tr style={{backgroundColor: "#0b3588", color: "white"}}>
                                <th rowSpan="2" className="border border-gray-400 p-2 font-bold sticky left-0 z-10"
                                    style={{
                                        backgroundColor: "#0b3588", color: "white"

                                    }}
                                >
                                </th>
                                <th colSpan="1"
                                    className="py-2 px-2 border border-gray-400 p-2 text-center sticky left-20 z-10"
                                    style={{backgroundColor: "#0b3588", color: "white"}}
                                >Store Type
                                </th>
                                <th colSpan="9" className="py-2 px-2 border border-gray-400 p-2 text-center">Offline
                                </th>
                                <th colSpan="9" className="py-2 px-2 border border-gray-400 p-2 text-center">Online</th>
                                <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>
                            </tr>
                            <tr style={{backgroundColor: "#0b3588", color: "white"}}>
                                <th colSpan="1"
                                    className="py-2 px-2 border border-gray-400 p-2 text-center sticky left-20 z-1"
                                    style={{backgroundColor: "#0b3588", color: "white"}}
                                ></th>
                                <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Full
                                    Price
                                </th>
                                <th colSpan="3"
                                    className="py-2 px-2 border border-gray-400 p-2 text-center">Discounted
                                </th>
                                <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>
                                <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Full
                                    Price
                                </th>
                                <th colSpan="3"
                                    className="py-2 px-2 border border-gray-400 p-2 text-center">Discounted
                                </th>
                                <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>
                                <th colSpan="3" className="py-2 px-4 border border-gray-400 p-2 text-center"></th>
                            </tr>
                            <tr style={{backgroundColor: "#0b3588", color: "white"}}>
                                <th className="py-2 px-4 border border-gray-400 p-2 text-center sticky left-0 z-10"
                                    style={{backgroundColor: "#0b3588", color: "white", minWidth: '80px'}}>Date
                                </th>
                                <th colSpan="1"
                                    className="py-2 px-2 border border-gray-400 p-2 text-center font-bold  sticky left-20 z-10"
                                    style={{backgroundColor: "#0b3588", color: "white", minWidth: '80px'}}>Day
                                </th>
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
                            {data.map((row, index) => (
                                <tr key={index}>

                                    <td className="sticky  left-0  font-bold  py-2 px-4 border border-gray-400 text-center bg-white dark:text-gray-200 dark:bg-bodybg">
                                    {formatApiDate(row.date)}
                                    </td>
                                    <td className="sticky  left-20  font-bold  py-2 px-4 border border-gray-400 text-center bg-white dark:text-gray-200 dark:bg-bodybg">
                                        {row.day}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right">
                                        {formatNumberWithCommas(row.fullPriceOfflineTarget)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right">
                                        {formatNumberWithCommas(row.fullPriceOfflineSale)}
                                    </td>
                                    <td className={`py-2 px-2 border font-bold border-gray-400 text-center ${getAchColor(row.fullPriceOfflineAch)}`}>
                                        {getAchIcon(row.fullPriceOfflineAch)} {row.fullPriceOfflineAch}%
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right">
                                        {formatNumberWithCommas(row.discountedOfflineTarget)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right">
                                        {formatNumberWithCommas(row.discountedOfflineSale)}
                                    </td>
                                    <td className={`py-2 px-2 border  font-bold border-gray-400 text-center ${getAchColor(row.discountedOfflineAch)}`}>
                                        {getAchIcon(row.discountedOfflineAch)} {row.discountedOfflineAch}%
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right">
                                        {formatNumberWithCommas(row.totalOfflineTarget)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right">
                                        {formatNumberWithCommas(row.totalOfflineSale)}
                                    </td>
                                    <td className={`py-2 px-2 border font-bold border-gray-400 text-center ${getAchColor(row.totalOfflineAch)}`}>
                                        {getAchIcon(row.totalOfflineAch)} {row.totalOfflineAch}%
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right">
                                        {formatNumberWithCommas(row.fullPriceOnlineTarget)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right">
                                        {formatNumberWithCommas(row.fullPriceOnlineSale)}
                                    </td>
                                    <td className={`py-2 px-2 border font-bold border-gray-400 text-center ${getAchColor(row.fullPriceOnlineAch)}`}>
                                        {getAchIcon(row.fullPriceOnlineAch)} {row.fullPriceOnlineAch}%
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right">
                                        {formatNumberWithCommas(row.discountedOnlineTarget)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right">
                                        {formatNumberWithCommas(row.discountedOnlineSale)}
                                    </td>
                                    <td className={`py-2 px-2 border font-bold border-gray-400 text-center ${getAchColor(row.discountedOnlineAch)}`}>
                                        {getAchIcon(row.discountedOnlineAch)} {row.discountedOnlineAch}%
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right">
                                        {formatNumberWithCommas(row.totalOnlineTarget)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right">
                                        {formatNumberWithCommas(row.totalOnlineSale)}
                                    </td>
                                    <td className={`py-2 px-2 border font-bold border-gray-400 text-center ${getAchColor(row.totalOnlineAch)}`}>
                                        {getAchIcon(row.totalOnlineAch)} {row.totalOnlineAch}%
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right">
                                        {formatNumberWithCommas(row.totalTarget)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right">
                                        {formatNumberWithCommas(row.totalSale)}
                                    </td>
                                    <td className={`py-2 px-2 border font-bold border-gray-400 text-center ${getAchColor(row.totalAch)}`}>
                                        {getAchIcon(row.totalAch)} {row.totalAch}%
                                    </td>
                                </tr>
                            ))}

                            {data.length > 0 && (
                                <tr className="bg-gray-200 font-bold dark:text-gray-200 dark:bg-bodybg">
                                    <td className="sticky left-0 z-20 py-2 px-2 border border-gray-400 text-center font-bold bg-gray-200 dark:text-gray-200 dark:bg-bodybg">
                                    </td>
                                    <td className="sticky left-16 z-20 py-2 px-2 border border-gray-400 text-center font-bold bg-gray-200 dark:text-gray-200 dark:bg-bodybg">
                                        Total
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold">
                                        {formatNumberWithCommas(totals.fullPriceOfflineTarget)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold">
                                        {formatNumberWithCommas(totals.fullPriceOfflineSale)}
                                    </td>
                                    <td className={`py-2 px-2 border  border-gray-400 text-center font-bold ${getAchColor(totalsAch.fullPriceOfflineAch)}`}>
                                        {getAchIcon(totalsAch.fullPriceOfflineAch)} {totalsAch.fullPriceOfflineAch}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold">
                                        {formatNumberWithCommas(totals.discountedOfflineTarget)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold">
                                        {formatNumberWithCommas(totals.discountedOfflineSale)}
                                    </td>
                                    <td className={`py-2 px-2 border border-gray-400 text-center font-bold ${getAchColor(totalsAch.discountedOfflineAch)}`}>
                                        {getAchIcon(totalsAch.discountedOfflineAch)} {totalsAch.discountedOfflineAch}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold">
                                        {formatNumberWithCommas(totals.totalOfflineTarget)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold">
                                        {formatNumberWithCommas(totals.totalOfflineSale)}
                                    </td>
                                    <td className={`py-2 px-2 border border-gray-400 text-center font-bold ${getAchColor(totalsAch.totalOfflineAch)}`}>
                                        {getAchIcon(totalsAch.totalOfflineAch)} {totalsAch.totalOfflineAch}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold">
                                        {formatNumberWithCommas(totals.fullPriceOnlineTarget)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold">
                                        {formatNumberWithCommas(totals.fullPriceOnlineSale)}
                                    </td>
                                    <td className={`py-2 px-2 border border-gray-400 text-center font-bold ${getAchColor(totalsAch.fullPriceOnlineAch)}`}>
                                        {getAchIcon(totalsAch.fullPriceOnlineAch)} {totalsAch.fullPriceOnlineAch}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold">
                                        {formatNumberWithCommas(totals.discountedOnlineTarget)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold">
                                        {formatNumberWithCommas(totals.discountedOnlineSale)}
                                    </td>
                                    <td className={`py-2 px-2 border border-gray-400 text-center font-bold ${getAchColor(totalsAch.discountedOnlineAch)}`}>
                                        {getAchIcon(totalsAch.discountedOnlineAch)} {totalsAch.discountedOnlineAch}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold">
                                        {formatNumberWithCommas(totals.totalOnlineTarget)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold">
                                        {formatNumberWithCommas(totals.totalOnlineSale)}
                                    </td>
                                    <td className={`py-2 px-2 border border-gray-400 text-center font-bold ${getAchColor(totalsAch.totalOnlineAch)}`}>
                                        {getAchIcon(totalsAch.totalOnlineAch)} {totalsAch.totalOnlineAch}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold">
                                        {formatNumberWithCommas(totals.totalTarget)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold">
                                        {formatNumberWithCommas(totals.totalSale)}
                                    </td>
                                    <td className={`py-2 px-2 border border-gray-400 text-center font-bold dark:text-gray-200 dark:bg-bodybg ${getAchColor(totalsAch.totalAch)}`}>
                                        {getAchIcon(totalsAch.totalAch)} {totalsAch.totalAch}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <div className="mt-4 text-xs text-danger text-left ml-4 font-bold">
                <p>*Omni Added in E-Store and Excluded from B&M.</p>
            </div>
        </div>
    );
};

export default DailyTargetAchievementOnline;




