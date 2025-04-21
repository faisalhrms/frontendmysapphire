import React, { useEffect, useState } from 'react';
import { fetchSaleCvVsLyData } from "../../services/wiseside_services.js";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const CYVsLYGrowth = ({ data , loading,setDonwloadData }) => {
    // const [data, setData] = useState([]);
    // const [loading, setLoading] = useState(false);
    const [downloadData, setDownloadData] = useState({});


    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return new Date(year, month - 1, day);
    };

    // useEffect(() => {
    //     if (filters.date_from && filters.date_to) {
    //         setLoading(true);
    //
    //         fetchSaleCvVsLyData(filters.date_from, filters)
    //             .then((responseData) => {
    //                 setData(responseData);
    //                 setLoading(false);
    //             })
    //             .catch((error) => {
    //                 console.error("Error fetching sales data:", error);
    //                 setLoading(false);
    //             });
    //     }
    // }, [filters]);

    const totalCy = data.reduce((total, item) => total + item.FullPriceOfflineCY, 0);
    const totalLy = data.reduce((total, item) => total + item.FullPriceOfflineLY, 0);

    const getAchColor = (achPercentage) => {
        if (achPercentage === null || achPercentage === 0) {
            return 'text-black';  // Return black color for null or 0
        }
        return achPercentage < 0 ? 'text-danger' : 'text-success'; // Return danger for negative, success for positive
    };

    const getAchIcon = (achPercentage) => {
        return achPercentage < 0 ? <i className="text-danger"></i> : <i className="text-success"></i>;
    };

    const calcAch = (LY, CY) => {
        if (!CY || LY === 0) return 0;
        const result = (((CY-LY)/LY)*100);
        return Number(result.toFixed(2));
    };

    const totals = data.reduce(
        (acc, row) => {
            acc.FullPriceOfflineCY += row.FullPriceOfflineCY || 0;
            acc.FullPriceOfflineLY += row.FullPriceOfflineLY || 0;

            acc.DiscountedOfflineCY += row.DiscountedOfflineCY || 0;
            acc.DiscountedOfflineLY += row.DiscountedOfflineLY || 0;

            acc.TotalOfflineCY += row.TotalOfflineCY || 0;
            acc.TotalOfflineLY += row.TotalOfflineLY || 0;

            acc.FullPriceOnlineCY += row.FullPriceOnlineCY || 0;
            acc.FullPriceOnlineLY += row.FullPriceOnlineLY || 0;

            acc.DiscountedOnlineCY += row.DiscountedOnlineCY || 0;
            acc.DiscountedOnlineLY += row.DiscountedOnlineLY || 0;

            acc.TotalOnlineCY += row.TotalOnlineCY || 0;
            acc.TotalOnlineLY += row.TotalOnlineLY || 0;

            acc.TotalCY += row.TotalCY || 0;
            acc.TotalLY += row.TotalLY || 0;

            return acc;
        },
        {
            FullPriceOfflineCY: 0,
            FullPriceOfflineLY: 0,
            DiscountedOfflineCY: 0,
            DiscountedOfflineLY: 0,
            TotalOfflineCY: 0,
            TotalOfflineLY: 0,
            FullPriceOnlineCY: 0,
            FullPriceOnlineLY: 0,
            DiscountedOnlineCY: 0,
            DiscountedOnlineLY: 0,
            TotalOnlineCY: 0,
            TotalOnlineLY: 0,
            TotalCY: 0,
            TotalLY: 0,
        }
    );

    const totalsAch = {
        FullPriceOfflineAch: calcAch(totals.FullPriceOfflineLY, totals.FullPriceOfflineCY),
        DiscountedOfflineAch: calcAch(totals.DiscountedOfflineLY, totals.DiscountedOfflineCY),
        TotalOfflineAch: calcAch(totals.TotalOfflineLY, totals.TotalOfflineCY),

        FullPriceOnlineAch: calcAch(totals.FullPriceOnlineLY, totals.FullPriceOnlineCY),
        DiscountedOnlineAch: calcAch(totals.DiscountedOnlineLY, totals.DiscountedOnlineCY),
        TotalOnlineAch: calcAch(totals.TotalOnlineLY, totals.TotalOnlineCY),

        TotalAch: calcAch(totals.TotalLY, totals.TotalCY),
    };

    useEffect(() => {
        const payload =  {
            data:data,
            totalsAch:totalsAch,
            totals:totals
        }
         setDonwloadData(payload)
    },[data])

    return (
        <div className="bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg p-4">
            <div className="relative">
                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
                    <div className="overflow-auto" style={{ maxHeight: '70vh'}}>
                        <table className="min-w-full table-auto border-collapse border border-gray-400">
                            <thead className="sticky top-0 z-10">
                            <tr style={{ backgroundColor: "#0b3588", color: "white" }}>
                                <th rowSpan="2" className="border border-gray-400 p-2 font-bold sticky left-0 z-10"
                                    style={{ backgroundColor: "#0b3588", color: "white", minWidth: '80px' }}>
                                </th>
                                <th colSpan="1"
                                    className="py-2 px-2 border border-gray-400 p-2 text-center sticky left-20 z-10"
                                    style={{ backgroundColor: "#0b3588", color: "white", minWidth: '80px' }}
                                >Store Type
                                </th>
                                <th colSpan="9" className="py-2 px-2 border border-gray-400 p-2 text-center">Offline </th>
                                <th colSpan="9" className="py-2 px-2 border border-gray-400 p-2 text-center">Online</th>
                                <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>
                            </tr>
                            <tr style={{ backgroundColor: "#0b3588", color: "white" }}>
                                <th colSpan="1"
                                    className="py-2 px-2 border border-gray-400 p-2 text-center sticky left-20 z-1"
                                    style={{ backgroundColor: "#0b3588", color: "white" }}
                                ></th>
                                <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Full Price</th>
                                <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Discounted</th>
                                <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>
                                <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Full Price</th>
                                <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Discounted</th>
                                <th colSpan="3" className="py-2 px-2 border border-gray-400 p-2 text-center">Total</th>
                                <th colSpan="3" className="py-2 px-4 border border-gray-400 p-2 text-center"></th>
                            </tr>
                            <tr style={{ backgroundColor: "#0b3588", color: "white" }}>
                                <th className="py-2 px-4 border border-gray-400 p-2 text-center sticky left-0 z-10"
                                    style={{ backgroundColor: "#0b3588", color: "white", minWidth: '80px' }}>Date
                                </th>
                                <th colSpan="1"
                                    className="py-2 px-2 border border-gray-400 p-2 text-center font-bold  sticky left-20 z-10"
                                    style={{ backgroundColor: "#0b3588", color: "white", minWidth: '80px' }}>Day
                                </th>
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
                            {data?.map((row, index) => (
                                <tr key={index}>
                                    <td className="sticky  left-0  font-bold  py-2 px-4 border border-gray-400 text-center bg-white dark:text-gray-200 dark:bg-bodybg"
                                        >{row.Date}</td>
                                    <td className="sticky  left-20  font-bold  py-2 px-4 border border-gray-400 text-center bg-white dark:text-gray-200 dark:bg-bodybg"
                                        >{row.Day}</td>
                                    <td className="py-2 px-2 border border-gray-400 p-2 text-center">{formatNumberWithCommas(row.FullPriceOfflineCY)}</td>
                                    <td className="py-2 px-2 border border-gray-400 p-2 text-center">{formatNumberWithCommas(row.FullPriceOfflineLY)}</td>
                                    <td className={`py-2 px-2 border font-bold border-gray-400 p-2 text-center ${getAchColor(row.FullPriceOfflineGrowth)}`}>
                                        {getAchIcon(row.FullPriceOfflineGrowth)} {row.FullPriceOfflineGrowth}%
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 p-2 text-center">{formatNumberWithCommas(row.DiscountedOfflineCY)}</td>
                                    <td className="py-2 px-2 border border-gray-400 p-2 text-center">{formatNumberWithCommas(row.DiscountedOfflineLY)}</td>
                                    <td className={`py-2 px-2 border font-bold border-gray-400 p-2 text-center ${getAchColor(row.DiscountedOfflineGrowth)}`}>
                                        {getAchIcon(row.DiscountedOfflineGrowth)} {row.DiscountedOfflineGrowth}%
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 p-2 text-center">{formatNumberWithCommas(row.TotalOfflineCY)}</td>
                                    <td className="py-2 px-2 border border-gray-400 p-2 text-center">{formatNumberWithCommas(row.TotalOfflineLY)}</td>
                                    <td className={`py-2 px-2 border font-bold border-gray-400 p-2 text-center ${getAchColor(row.TotalOfflineGrowth)}`}>
                                        {getAchIcon(row.TotalOfflineGrowth)} {row.TotalOfflineGrowth}%
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 p-2 text-center">{formatNumberWithCommas(row.FullPriceOnlineCY)}</td>
                                    <td className="py-2 px-2 border border-gray-400 p-2 text-center">{formatNumberWithCommas(row.FullPriceOnlineLY)}</td>
                                    <td className={`py-2 px-2 border font-bold border-gray-400 p-2 text-center ${getAchColor(row.FullPriceOnlineGrowth)}`}>
                                        {getAchIcon(row.FullPriceOnlineGrowth)} {row.FullPriceOnlineGrowth}%
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 p-2 text-center">{formatNumberWithCommas(row.DiscountedOnlineCY)}</td>
                                    <td className="py-2 px-2 border border-gray-400 p-2 text-center">{formatNumberWithCommas(row.DiscountedOnlineLY)}</td>
                                    <td className={`py-2 px-2 border font-bold border-gray-400 p-2 text-center ${getAchColor(row.DiscountedOnlineGrowth)}`}>
                                        {getAchIcon(row.DiscountedOnlineGrowth)} {row.DiscountedOnlineGrowth}%
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 p-2 text-center">{formatNumberWithCommas(row.TotalOnlineCY)}</td>
                                    <td className="py-2 px-2 border border-gray-400 p-2 text-center">{formatNumberWithCommas(row.TotalOnlineLY)}</td>
                                    <td className={`py-2 px-2 border font-bold border-gray-400 p-2 text-center ${getAchColor(row.TotalOnlineGrowth)}`}>
                                        {getAchIcon(row.TotalOnlineGrowth)} {row.TotalOnlineGrowth}%
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 p-2 text-center">{formatNumberWithCommas(row.TotalCY)}</td>
                                    <td className="py-2 px-2 border border-gray-400 p-2 text-center">{formatNumberWithCommas(row.TotalLY)}</td>
                                    <td className={`py-2 px-2 border font-bold border-gray-400 p-2 text-center ${getAchColor(row.TotalGrowth)}`}>
                                        {getAchIcon(row.TotalGrowth)} {row.TotalGrowth}%
                                    </td>
                                </tr>
                            ))}

                            {data?.length > 0 && (
                                <tr className="dark:text-gray-200 dark:bg-bodybg" style={{ backgroundColor: "#f9f9f9" }}>
                                    <td className="sticky left-0 z-20 py-2 px-2 border border-gray-400 text-center font-bold bg-gray-200 dark:text-gray-200 dark:bg-bodybg "
                                 >
                                    </td>
                                    <td className="sticky left-16 z-20 py-2 px-2 border border-gray-400 text-center font-bold bg-gray-200 dark:text-gray-200 dark:bg-bodybg "
                                        >
                                        Total
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold  dark:text-gray-200 dark:bg-bodybg ">
                                        {formatNumberWithCommas(totals.FullPriceOfflineCY)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold  dark:text-gray-200 dark:bg-bodybg ">
                                        {formatNumberWithCommas(totals.FullPriceOfflineLY)}
                                    </td>
                                    <td
                                        className={`py-2 px-2 border border-gray-400 text-center font-bold  dark:text-gray-200 dark:bg-bodybg  ${getAchColor(totalsAch.FullPriceOfflineAch)}`}
                                    >
                                        {getAchIcon(totalsAch.FullPriceOfflineAch)} {totalsAch.FullPriceOfflineAch}%
                                    </td>

                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold  dark:text-gray-200 dark:bg-bodybg ">
                                        {formatNumberWithCommas(totals.DiscountedOfflineCY)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold  dark:text-gray-200 dark:bg-bodybg ">
                                        {formatNumberWithCommas(totals.DiscountedOfflineLY)}
                                    </td>
                                    <td
                                        className={`py-2 px-2 border border-gray-400 text-center font-bold  dark:text-gray-200 dark:bg-bodybg  ${getAchColor(totalsAch.DiscountedOfflineAch)}`}
                                    >
                                        {getAchIcon(totalsAch.DiscountedOfflineAch)} {totalsAch.DiscountedOfflineAch}%
                                    </td>

                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold  dark:text-gray-200 dark:bg-bodybg ">
                                        {formatNumberWithCommas(totals.TotalOfflineCY)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold  dark:text-gray-200 dark:bg-bodybg ">
                                        {formatNumberWithCommas(totals.TotalOfflineLY)}
                                    </td>
                                    <td
                                        className={`py-2 px-2 border border-gray-400 text-center font-bold  dark:text-gray-200 dark:bg-bodybg  ${getAchColor(totalsAch.TotalOfflineAch)}`}
                                    >
                                        {getAchIcon(totalsAch.TotalOfflineAch)} {totalsAch.TotalOfflineAch}%
                                    </td>

                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold  dark:text-gray-200 dark:bg-bodybg ">
                                        {formatNumberWithCommas(totals.FullPriceOnlineCY)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold  dark:text-gray-200 dark:bg-bodybg ">
                                        {formatNumberWithCommas(totals.FullPriceOnlineLY)}
                                    </td>
                                    <td
                                        className={`py-2 px-2 border border-gray-400 text-center font-bold  dark:text-gray-200 dark:bg-bodybg  ${getAchColor(totalsAch.FullPriceOnlineAch)}`}
                                    >
                                        {getAchIcon(totalsAch.FullPriceOnlineAch)} {totalsAch.FullPriceOnlineAch}%
                                    </td>

                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold  dark:text-gray-200 dark:bg-bodybg ">
                                        {formatNumberWithCommas(totals.DiscountedOnlineCY)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold  dark:text-gray-200 dark:bg-bodybg ">
                                        {formatNumberWithCommas(totals.DiscountedOnlineLY)}
                                    </td>
                                    <td
                                        className={`py-2 px-2 border border-gray-400 text-center font-bold  dark:text-gray-200 dark:bg-bodybg  ${getAchColor(totalsAch.DiscountedOnlineAch)}`}
                                    >
                                        {getAchIcon(totalsAch.DiscountedOnlineAch)} {totalsAch.DiscountedOnlineAch}%
                                    </td>

                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold  dark:text-gray-200 dark:bg-bodybg ">
                                        {formatNumberWithCommas(totals.TotalOnlineCY)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold  dark:text-gray-200 dark:bg-bodybg ">
                                        {formatNumberWithCommas(totals.TotalOnlineLY)}
                                    </td>
                                    <td
                                        className={`py-2 px-2 border border-gray-400 text-center font-bold  dark:text-gray-200 dark:bg-bodybg  ${getAchColor(totalsAch.TotalOnlineAch)}`}
                                    >
                                        {getAchIcon(totalsAch.TotalOnlineAch)} {totalsAch.TotalOnlineAch}%
                                    </td>

                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold  dark:text-gray-200 dark:bg-bodybg ">
                                        {formatNumberWithCommas(totals.TotalCY)}
                                    </td>
                                    <td className="py-2 px-2 border border-gray-400 text-right font-bold  dark:text-gray-200 dark:bg-bodybg ">
                                        {formatNumberWithCommas(totals.TotalLY)}
                                    </td>
                                    <td
                                        className={`py-2 px-2 border border-gray-400 text-center font-bold dark:text-gray-200 dark:bg-bodybg  dark:text-gray-200 dark:bg-bodybg   ${getAchColor(totalsAch.TotalAch)}`}
                                    >
                                        {getAchIcon(totalsAch.TotalAch)} {totalsAch.TotalAch}%
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="mt-4 text-xs text-danger text-left ml-4 font-bold">
                <p>*Omni Added in E-Store and Excluded from B&M.</p>
            </div>
        </div>
    );
};

export default CYVsLYGrowth;