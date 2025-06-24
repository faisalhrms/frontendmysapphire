
import React, { useEffect, useState } from 'react';

const DailyTargetAchievementOnline = ({ data , isLoading }) => {

    const formatApiDate = (dayNumber) => {
        const day = dayNumber?.toString();
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



    const getAchColor = (achPercentage) => {
        if (achPercentage === null || achPercentage === 0) {
            return 'text-black';
        }
        return achPercentage < 0 ? 'text-danger' : 'text-emerald-600';
    };


    const getAchIcon = (achPercentage) => {
        return achPercentage < 0
            ? <i className=""></i>
            : <i className=""></i>;
    };

    const totals = Array.isArray(data)
        ? data.reduce(
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
        )
        : {
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
        };

    // const totals = data?data:[]?.reduce(
    //     (acc, row) => {
    //         acc.fullPriceOfflineTarget += row.fullPriceOfflineTarget || 0;
    //         acc.fullPriceOfflineSale += row.fullPriceOfflineSale || 0;
    //         acc.discountedOfflineTarget += row.discountedOfflineTarget || 0;
    //         acc.discountedOfflineSale += row.discountedOfflineSale || 0;
    //         acc.totalOfflineTarget += row.totalOfflineTarget || 0;
    //         acc.totalOfflineSale += row.totalOfflineSale || 0;
    //         acc.fullPriceOnlineTarget += row.fullPriceOnlineTarget || 0;
    //         acc.fullPriceOnlineSale += row.fullPriceOnlineSale || 0;
    //         acc.discountedOnlineTarget += row.discountedOnlineTarget || 0;
    //         acc.discountedOnlineSale += row.discountedOnlineSale || 0;
    //         acc.totalOnlineTarget += row.totalOnlineTarget || 0;
    //         acc.totalOnlineSale += row.totalOnlineSale || 0;
    //         acc.totalTarget += row.totalTarget || 0;
    //         acc.totalSale += row.totalSale || 0;
    //         return acc;
    //     },
    //     {
    //         fullPriceOfflineTarget: 0,
    //         fullPriceOfflineSale: 0,
    //         discountedOfflineTarget: 0,
    //         discountedOfflineSale: 0,
    //         totalOfflineTarget: 0,
    //         totalOfflineSale: 0,
    //         fullPriceOnlineTarget: 0,
    //         fullPriceOnlineSale: 0,
    //         discountedOnlineTarget: 0,
    //         discountedOnlineSale: 0,
    //         totalOnlineTarget: 0,
    //         totalOnlineSale: 0,
    //         totalTarget: 0,
    //         totalSale: 0,
    //     }
    // );

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
        <>
            <div className="text-primary p-2 rounded-lg text-right text-black">
                <p>Amount in Rs</p>

            </div>

    <div className="bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg p-4">

        <div className="relative overflow-x-auto">

                    <div className="w-full border-collapse border border-gray-400 table-auto">
                        <table className="w-full border-collapse border border-gray-400">
                            <thead className="sticky top-0 border border-gray-400  z-10">
                            <tr style={{backgroundColor: "#383853", color: "white"}}>
                                <th rowSpan="2"
                                    className="border border-gray-400 p-2 font-bold sticky left-0 z-10 text-xs sm:text-sm"
                                    style={{backgroundColor: "#383853", color: "white", minWidth: '80px'}}>
                                </th>
                                <th colSpan="1"
                                    className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center sticky left-12 sm:left-20 z-10 text-xs sm:text-sm"
                                    style={{backgroundColor: "#383853", color: "white", minWidth: '80px'}}
                                >Store Type
                                </th>
                                <th colSpan="9"
                                    className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-sm">Offline
                                </th>
                                <th colSpan="9"
                                    className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-sm">Online
                                </th>
                                <th colSpan="3"
                                    className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-sm">Total
                                </th>
                            </tr>
                            <tr style={{backgroundColor: "#383853", color: "white"}}>
                                <th colSpan="1"
                                    className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center sticky left-12 sm:left-20 z-1 text-xs sm:text-sm"
                                    style={{backgroundColor: "#383853", color: "white"}}
                                ></th>
                                <th colSpan="3"
                                    className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-sm">Full
                                    Price
                                </th>
                                <th colSpan="3"
                                    className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-sm">Discounted
                                </th>
                                <th colSpan="3"
                                    className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-sm">Total
                                </th>
                                <th colSpan="3"
                                    className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-sm">Full
                                    Price
                                </th>
                                <th colSpan="3"
                                    className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-smr">Discounted
                                </th>
                                <th colSpan="3"
                                    className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-sm">Total
                                </th>
                                <th colSpan="3"
                                    className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center text-xs sm:text-smr"></th>
                            </tr>
                            <tr style={{backgroundColor: "#4d5875", color: "white"}}>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center sticky left-0 z-10 text-xs sm:text-sm"
                                    style={{
                                        backgroundColor: "#4d5875",
                                        color: "white",
                                        minWidth: '60px',
                                        maxWidth: '70px'
                                    }}>Date
                                </th>
                                <th colSpan="1"
                                    className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center font-bold sticky left-12 sm:left-20 z-10 text-xs sm:text-sm"
                                    style={{
                                        backgroundColor: "#4d5875",
                                        color: "white",
                                        minWidth: '50px',
                                        maxWidth: '60px'
                                    }}>Day
                                </th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Target</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Actual
                                    Sale
                                </th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Ach%</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Target</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Actual
                                    Sale
                                </th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Ach%</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Target</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Actual
                                    Sale
                                </th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Ach%</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Target</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Actual
                                    Sale
                                </th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Ach%</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Target</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Actual
                                    Sale
                                </th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Ach%</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Target</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Actual
                                    Sale
                                </th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Ach%</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Target</th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Actual
                                    Sale
                                </th>
                                <th className="py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center text-xs sm:text-sm">Ach%</th>
                            </tr>
                            </thead>

                            <tbody>
                            {data?.length > 0 && (data?.map((row, index) => (
                                <tr key={index}>

                                    <td className="sticky left-0 z-20 py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center font-bold bg-white dark:text-gray-200 dark:bg-bodybg text-xs sm:text-sm whitespace-nowrap">
                                        {formatApiDate(row.date)}
                                    </td>
                                    <td className="sticky left-12 sm:left-20 z-20 py-1 px-2 sm:py-2 sm:px-4 border border-gray-400 text-center font-bold bg-white dark:text-gray-200 dark:bg-bodybg text-xs sm:text-sm whitespace-nowrap">
                                        {row.day}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">
                                        {formatNumberWithCommas(row.fullPriceOfflineTarget)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">
                                        {formatNumberWithCommas(row.fullPriceOfflineSale)}
                                    </td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border font-bold border-gray-400 text-right text-xs sm:text-sm ${getAchColor(row.fullPriceOfflineAch)}`}>
                                        {getAchIcon(row.fullPriceOfflineAch)} {row.fullPriceOfflineAch}%
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">
                                        {formatNumberWithCommas(row.discountedOfflineTarget)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">
                                        {formatNumberWithCommas(row.discountedOfflineSale)}
                                    </td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border font-bold border-gray-400 text-right text-xs sm:text-sm ${getAchColor(row.discountedOfflineAch)}`}>
                                        {getAchIcon(row.discountedOfflineAch)} {row.discountedOfflineAch}%
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">
                                        {formatNumberWithCommas(row.totalOfflineTarget)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">
                                        {formatNumberWithCommas(row.totalOfflineSale)}
                                    </td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border font-bold border-gray-400 text-right text-xs sm:text-sm ${getAchColor(row.totalOfflineAch)}`}>
                                        {getAchIcon(row.totalOfflineAch)} {row.totalOfflineAch}%
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">
                                        {formatNumberWithCommas(row.fullPriceOnlineTarget)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">
                                        {formatNumberWithCommas(row.fullPriceOnlineSale)}
                                    </td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border font-bold border-gray-400 text-right text-xs sm:text-sm ${getAchColor(row.fullPriceOnlineAch)}`}>
                                        {getAchIcon(row.fullPriceOnlineAch)} {row.fullPriceOnlineAch}%
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">
                                        {formatNumberWithCommas(row.discountedOnlineTarget)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">
                                        {formatNumberWithCommas(row.discountedOnlineSale)}
                                    </td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border font-bold border-gray-400 text-right text-xs sm:text-sm ${getAchColor(row.discountedOnlineAch)}`}>
                                        {getAchIcon(row.discountedOnlineAch)} {row.discountedOnlineAch}%
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">
                                        {formatNumberWithCommas(row.totalOnlineTarget)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">
                                        {formatNumberWithCommas(row.totalOnlineSale)}
                                    </td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border font-bold border-gray-400 text-right text-xs sm:text-sm ${getAchColor(row.totalOnlineAch)}`}>
                                        {getAchIcon(row.totalOnlineAch)} {row.totalOnlineAch}%
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">
                                        {formatNumberWithCommas(row.totalTarget)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right text-xs sm:text-sm">
                                        {formatNumberWithCommas(row.totalSale)}
                                    </td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border font-bold border-gray-400 text-right text-xs sm:text-sm ${getAchColor(row.totalAch)}`}>
                                        {getAchIcon(row.totalAch)} {row.totalAch}%
                                    </td>
                                </tr>
                            )))}

                            {data?.length > 0 && (
                                <tr className="font-bold dark:text-gray-200 dark:bg-bodybg bg-[#949eb7]">
                                    <td className="sticky left-0 z-20 py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center font-bold dark:text-gray-200 dark:bg-bodybg text-xs sm:text-sm bg-[#949eb7]">
                                    </td>
                                    <td className="sticky left-12 sm:left-16 z-20 py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-center font-bold  dark:text-gray-200 dark:bg-bodybg text-xs sm:text-sm bg-[#949eb7]">
                                        Total
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm">
                                        {formatNumberWithCommas(totals.fullPriceOfflineTarget)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm">
                                        {formatNumberWithCommas(totals.fullPriceOfflineSale)}
                                    </td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm  ${getAchColor(totalsAch.fullPriceOfflineAch)}`}>
                                        {getAchIcon(totalsAch.fullPriceOfflineAch)} {totalsAch.fullPriceOfflineAch}%
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm">
                                        {formatNumberWithCommas(totals.discountedOfflineTarget)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm">
                                        {formatNumberWithCommas(totals.discountedOfflineSale)}
                                    </td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm ${getAchColor(totalsAch.discountedOfflineAch)}`}>
                                        {getAchIcon(totalsAch.discountedOfflineAch)} {totalsAch.discountedOfflineAch}%
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm">
                                        {formatNumberWithCommas(totals.totalOfflineTarget)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm">
                                        {formatNumberWithCommas(totals.totalOfflineSale)}
                                    </td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm ${getAchColor(totalsAch.totalOfflineAch)}`}>
                                        {getAchIcon(totalsAch.totalOfflineAch)} {totalsAch.totalOfflineAch}%
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm">
                                        {formatNumberWithCommas(totals.fullPriceOnlineTarget)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm">
                                        {formatNumberWithCommas(totals.fullPriceOnlineSale)}
                                    </td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm ${getAchColor(totalsAch.fullPriceOnlineAch)}`}>
                                        {getAchIcon(totalsAch.fullPriceOnlineAch)} {totalsAch.fullPriceOnlineAch}%
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm">
                                        {formatNumberWithCommas(totals.discountedOnlineTarget)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm">
                                        {formatNumberWithCommas(totals.discountedOnlineSale)}
                                    </td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm ${getAchColor(totalsAch.discountedOnlineAch)}`}>
                                        {getAchIcon(totalsAch.discountedOnlineAch)} {totalsAch.discountedOnlineAch}%
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm">
                                        {formatNumberWithCommas(totals.totalOnlineTarget)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm">
                                        {formatNumberWithCommas(totals.totalOnlineSale)}
                                    </td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm ${getAchColor(totalsAch.totalOnlineAch)}`}>
                                        {getAchIcon(totalsAch.totalOnlineAch)} {totalsAch.totalOnlineAch}%
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm">
                                        {formatNumberWithCommas(totals.totalTarget)}
                                    </td>
                                    <td className="py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm">
                                        {formatNumberWithCommas(totals.totalSale)}
                                    </td>
                                    <td className={`py-1 px-1 sm:py-2 sm:px-2 border border-gray-400 text-right font-bold text-xs sm:text-sm ${getAchColor(totalsAch.totalAch)}`}>
                                        {getAchIcon(totalsAch.totalAch)} {totalsAch.totalAch}%
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

            <div className="mt-4 text-xs text-red-600 text-left ml-4 font-bold">
                <p>*Omni Added in E-Store and Excluded from B&M.</p>
            </div>
        </div>
        </>
    );
};

export default DailyTargetAchievementOnline;




