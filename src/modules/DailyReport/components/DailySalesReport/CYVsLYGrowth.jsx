import React, { useEffect, useState } from 'react';


const CYVsLYGrowth = ({ data , loading }) => {

    const [downloadData, setDownloadData] = useState({});


    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return new Date(year, month - 1, day);
    };

    const formatNumberWithCommas = (num) => {
        if (num === 0 || num == null) return "-";
        return num.toLocaleString();
    };



    const getAchColor = (achPercentage) => {
        if (achPercentage === null || achPercentage === 0) {
            return 'text-black';
        }
        return achPercentage < 0 ? 'text-danger' : 'text-emerald-600';
    };

    const getAchIcon = (achPercentage) => {
        return achPercentage < 0 ? <i className="text-danger"></i> : <i className="text-emerald-600'"></i>;
    };

    const calcAch = (LY, CY) => {
        if (!CY || LY === 0) return 0;
        const result = (((CY-LY)/LY)*100);
        return Number(result.toFixed(2));
    };
    // const totals = data?data:[]?.reduce(
    //
    //     (acc, row) => {
    //         acc.FullPriceOfflineCY += row.FullPriceOfflineCY || 0;
    //         acc.FullPriceOfflineLY += row.FullPriceOfflineLY || 0;
    //
    //         acc.DiscountedOfflineCY += row.DiscountedOfflineCY || 0;
    //         acc.DiscountedOfflineLY += row.DiscountedOfflineLY || 0;
    //
    //         acc.TotalOfflineCY += row.TotalOfflineCY || 0;
    //         acc.TotalOfflineLY += row.TotalOfflineLY || 0;
    //
    //         acc.FullPriceOnlineCY += row.FullPriceOnlineCY || 0;
    //         acc.FullPriceOnlineLY += row.FullPriceOnlineLY || 0;
    //
    //         acc.DiscountedOnlineCY += row.DiscountedOnlineCY || 0;
    //         acc.DiscountedOnlineLY += row.DiscountedOnlineLY || 0;
    //
    //         acc.TotalOnlineCY += row.TotalOnlineCY || 0;
    //         acc.TotalOnlineLY += row.TotalOnlineLY || 0;
    //
    //         acc.TotalCY += row.TotalCY || 0;
    //         acc.TotalLY += row.TotalLY || 0;
    //
    //         return acc;
    //     },
    //     {
    //         FullPriceOfflineCY: 0,
    //         FullPriceOfflineLY: 0,
    //         DiscountedOfflineCY: 0,
    //         DiscountedOfflineLY: 0,
    //         TotalOfflineCY: 0,
    //         TotalOfflineLY: 0,
    //         FullPriceOnlineCY: 0,
    //         FullPriceOnlineLY: 0,
    //         DiscountedOnlineCY: 0,
    //         DiscountedOnlineLY: 0,
    //         TotalOnlineCY: 0,
    //         TotalOnlineLY: 0,
    //         TotalCY: 0,
    //         TotalLY: 0,
    //     }
    // );
    const totals = Array.isArray(data)
        ? data.reduce(
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
        )
        : {
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
        };

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
         // setDonwloadData(payload)
    },[data])

    return (
        <>
            <div className="text-primary p-2 rounded-lg text-right text-black">
                <p>Amount in Rs</p>

            </div>

    <div className="bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg p-4">
        <div className="relative">
                {loading ? (
                    <div className="text-center py-4">Loading...</div>
                ) : (
                    <div className="relative overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-400 table-auto">
                            <thead className="sticky top-0 z-10">
                            <tr style={{ backgroundColor: "#383853", color: "white" }}>
                                <th rowSpan="2" className="border border-gray-400 p-2 font-bold sticky left-0 z-10 text-xs sm:text-sm"
                                    style={{ backgroundColor: "#383853", color: "white", minWidth: '80px' }}>
                                </th>
                                <th colSpan="1"
                                    className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center sticky left-12 sm:left-20 z-10 text-xs sm:text-sm"
                                    style={{ backgroundColor: "#383853", color: "white", minWidth: '80px' }}
                                >Store Type
                                </th>
                                <th colSpan="9" className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-sm">Offline </th>
                                <th colSpan="9" className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-sm">Online</th>
                                <th colSpan="3" className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-sm">Total</th>
                            </tr>
                            <tr style={{ backgroundColor: "#383853", color: "white" }}>
                                <th colSpan="1"
                                    className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center sticky left-12 sm:left-20 z-1 text-xs sm:text-sm"
                                    style={{ backgroundColor: "#383853", color: "white" }}
                                ></th>
                                <th colSpan="3" className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-sm">Full Price</th>
                                <th colSpan="3" className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-sm">Discounted</th>
                                <th colSpan="3" className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-sm">Total</th>
                                <th colSpan="3" className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-sm">Full Price</th>
                                <th colSpan="3" className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-smr">Discounted</th>
                                <th colSpan="3" className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-sm">Total</th>
                                <th colSpan="3" className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-smr"></th>
                            </tr>
                            <tr style={{ backgroundColor: "#4d5875", color: "white" }}>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center sticky left-0 z-10 text-xs sm:text-sm"
                                    style={{    backgroundColor: "#4d5875",
                                        color: "white",
                                        minWidth: '60px',
                                        maxWidth: '70px' }}>Date
                                </th>
                                <th colSpan="1"
                                    className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center font-bold sticky left-12 sm:left-20 z-10 text-xs sm:text-sm"
                                    style={{   backgroundColor: "#4d5875",
                                        color: "white",
                                        minWidth: '50px',
                                        maxWidth: '60px' }}>Day
                                </th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">CY</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">LY</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Growth%</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">CY</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">LY</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Growth%</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">CY</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">LY</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Growth%</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">CY</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">LY</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Growth%</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">CY</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">LY</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Growth%</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">CY</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">LY</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Growth%</th>
                                <th className="ppy-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">CY</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">LY</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Growth%</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data?.length > 0 && (data?.map((row, index) => (
                                <tr key={index}>
                                    <td className="sticky left-0 z-20 py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center font-bold bg-white dark:text-gray-200 dark:bg-bodybg text-xs sm:text-sm whitespace-nowrap"
                                        >{row.Date}</td>
                                    <td className="sticky left-12 sm:left-20 z-20 py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center font-bold bg-white dark:text-gray-200 dark:bg-bodybg text-xs sm:text-sm whitespace-nowrap"
                                        >{row.Day}</td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">{formatNumberWithCommas(row.FullPriceOfflineCY)}</td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">{formatNumberWithCommas(row.FullPriceOfflineLY)}</td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border font-bold border-gray-400 text-right text-xs sm:text-sm ${getAchColor(row.FullPriceOfflineGrowth)}`}>
                                        {getAchIcon(row.FullPriceOfflineGrowth)} {row.FullPriceOfflineGrowth}%
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">{formatNumberWithCommas(row.DiscountedOfflineCY)}</td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">{formatNumberWithCommas(row.DiscountedOfflineLY)}</td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border font-bold border-gray-400 text-right text-xs sm:text-sm ${getAchColor(row.DiscountedOfflineGrowth)}`}>
                                        {getAchIcon(row.DiscountedOfflineGrowth)} {row.DiscountedOfflineGrowth}%
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">{formatNumberWithCommas(row.TotalOfflineCY)}</td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">{formatNumberWithCommas(row.TotalOfflineLY)}</td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border font-bold border-gray-400 text-right text-xs sm:text-sm ${getAchColor(row.TotalOfflineGrowth)}`}>
                                        {getAchIcon(row.TotalOfflineGrowth)} {row.TotalOfflineGrowth}%
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">{formatNumberWithCommas(row.FullPriceOnlineCY)}</td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">{formatNumberWithCommas(row.FullPriceOnlineLY)}</td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border font-bold border-gray-400 text-right text-xs sm:text-sm ${getAchColor(row.FullPriceOnlineGrowth)}`}>
                                        {getAchIcon(row.FullPriceOnlineGrowth)} {row.FullPriceOnlineGrowth}%
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">{formatNumberWithCommas(row.DiscountedOnlineCY)}</td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">{formatNumberWithCommas(row.DiscountedOnlineLY)}</td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border font-bold border-gray-400 text-right text-xs sm:text-sm ${getAchColor(row.DiscountedOnlineGrowth)}`}>
                                        {getAchIcon(row.DiscountedOnlineGrowth)} {row.DiscountedOnlineGrowth}%
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">{formatNumberWithCommas(row.TotalOnlineCY)}</td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">{formatNumberWithCommas(row.TotalOnlineLY)}</td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border font-bold border-gray-400 text-right text-xs sm:text-sm ${getAchColor(row.TotalOnlineGrowth)}`}>
                                        {getAchIcon(row.TotalOnlineGrowth)} {row.TotalOnlineGrowth}%
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">{formatNumberWithCommas(row.TotalCY)}</td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">{formatNumberWithCommas(row.TotalLY)}</td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border font-bold border-gray-400 text-right text-xs sm:text-sm ${getAchColor(row.TotalGrowth)}`}>
                                        {getAchIcon(row.TotalGrowth)} {row.TotalGrowth}%
                                    </td>
                                </tr>
                            )))}

                            {data?.length > 0 && (
                                <tr className=" font-bold dark:text-gray-200 dark:bg-bodybg bg-[#949eb7]">
                                    <td className="sticky left-0 z-20 py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center font-bold dark:text-gray-200 dark:bg-bodybg text-xs sm:text-sm bg-[#949eb7]"
                                 >
                                    </td>
                                    <td className="sticky left-12 sm:left-16 z-20 py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center font-bold  dark:text-gray-200 dark:bg-bodybg text-xs sm:text-sm bg-[#949eb7] "
                                        >
                                        Total
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm dark:text-gray-200 dark:bg-bodybg bg-[#949eb7]">
                                        {formatNumberWithCommas(totals.FullPriceOfflineCY)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm  dark:text-gray-200 dark:bg-bodybg bg-[#949eb7]">
                                        {formatNumberWithCommas(totals.FullPriceOfflineLY)}
                                    </td>
                                    <td
                                        className={`py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm dark:text-gray-200 dark:bg-bodybg bg-[#949eb7] ${getAchColor(totalsAch.FullPriceOfflineAch)}`}
                                    >
                                        {getAchIcon(totalsAch.FullPriceOfflineAch)} {totalsAch.FullPriceOfflineAch}%
                                    </td>

                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm dark:text-gray-200 dark:bg-bodybg bg-[#949eb7]">
                                        {formatNumberWithCommas(totals.DiscountedOfflineCY)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm dark:text-gray-200 dark:bg-bodybg bg-[#949eb7]">
                                        {formatNumberWithCommas(totals.DiscountedOfflineLY)}
                                    </td>
                                    <td
                                        className={`py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm dark:text-gray-200 dark:bg-bodybg bg-[#949eb7]  ${getAchColor(totalsAch.DiscountedOfflineAch)}`}
                                    >
                                        {getAchIcon(totalsAch.DiscountedOfflineAch)} {totalsAch.DiscountedOfflineAch}%
                                    </td>

                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm dark:text-gray-200 dark:bg-bodybg bg-[#949eb7] ">
                                        {formatNumberWithCommas(totals.TotalOfflineCY)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm dark:text-gray-200 dark:bg-bodybg bg-[#949eb7]">
                                        {formatNumberWithCommas(totals.TotalOfflineLY)}
                                    </td>
                                    <td
                                        className={`py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm dark:text-gray-200 dark:bg-bodybg bg-[#949eb7]  ${getAchColor(totalsAch.TotalOfflineAch)}`}
                                    >
                                        {getAchIcon(totalsAch.TotalOfflineAch)} {totalsAch.TotalOfflineAch}%
                                    </td>

                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm  dark:text-gray-200 dark:bg-bodybg bg-[#949eb7]">
                                        {formatNumberWithCommas(totals.FullPriceOnlineCY)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm dark:text-gray-200 dark:bg-bodybg bg-[#949eb7]">
                                        {formatNumberWithCommas(totals.FullPriceOnlineLY)}
                                    </td>
                                    <td
                                        className={`py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm dark:text-gray-200 dark:bg-bodybg bg-[#949eb7] ${getAchColor(totalsAch.FullPriceOnlineAch)}`}
                                    >
                                        {getAchIcon(totalsAch.FullPriceOnlineAch)} {totalsAch.FullPriceOnlineAch}%
                                    </td>

                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm dark:text-gray-200 dark:bg-bodybg bg-[#949eb7]" >
                                        {formatNumberWithCommas(totals.DiscountedOnlineCY)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm dark:text-gray-200 dark:bg-bodybg ">
                                        {formatNumberWithCommas(totals.DiscountedOnlineLY)}
                                    </td>
                                    <td
                                        className={`py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm dark:text-gray-200 dark:bg-bodybg  ${getAchColor(totalsAch.DiscountedOnlineAch)}`}
                                    >
                                        {getAchIcon(totalsAch.DiscountedOnlineAch)} {totalsAch.DiscountedOnlineAch}%
                                    </td>

                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm  dark:text-gray-200 dark:bg-bodybg">
                                        {formatNumberWithCommas(totals.TotalOnlineCY)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm dark:text-gray-200 dark:bg-bodybg ">
                                        {formatNumberWithCommas(totals.TotalOnlineLY)}
                                    </td>
                                    <td
                                        className={`py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm dark:text-gray-200 dark:bg-bodybg   ${getAchColor(totalsAch.TotalOnlineAch)}`}
                                    >
                                        {getAchIcon(totalsAch.TotalOnlineAch)} {totalsAch.TotalOnlineAch}%
                                    </td>

                                    <td className="px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm dark:text-gray-200 dark:bg-bodybg  ">
                                        {formatNumberWithCommas(totals.TotalCY)}
                                    </td>
                                    <td className="px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm dark:text-gray-200 dark:bg-bodybg ">
                                        {formatNumberWithCommas(totals.TotalLY)}
                                    </td>
                                    <td
                                        className={`py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm dark:text-gray-200 dark:bg-bodybg  ${getAchColor(totalsAch.TotalAch)}`}
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
            <div className="mt-4 text-xs text-red-600 text-left ml-4 font-bold">
                <p>*Omni Added in E-Store and Excluded from B&M.</p>
            </div>
        </div>
        </>
    );
};

export default CYVsLYGrowth;