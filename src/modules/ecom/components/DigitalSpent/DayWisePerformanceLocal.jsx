import React, { Fragment } from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import * as styles from "@helpers/staticDataTableStyles.js";
import InfoAlert from "../../../../InfoAlert.jsx";

// Utility function to determine growth color
const getGrowthColor = growth => growth > 7 ? "text-red" : "text-emerald-600";

const DayWisePerformanceLocal = ({ data = {}, loading }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
            </div>
        );
    }

    const rows = data.Local || [];
    const dataRows = rows.filter(r => r.date !== "Total");
    const totalRow = rows.find(r => r.date === "Total");

    return (
        <>
            <InfoAlert description={"This page is currently under development and will be available soon."}/>
                <div className={styles.wrapper}>
            <div className="overflow-x-auto overflow-y-auto max-h-[600px] mb-5 relative">
                <table className={styles.table}>
                    <thead className={styles.thead}>
                    {/* First Row: Main Headers */}
                    <tr>
                        <th
                            rowSpan="2"
                            className={`${styles.headerCell} sticky top-0 left-0 z-[30] bg-gray-800`}
                        >
                            Date
                        </th>
                        <th colSpan="5" className={`${styles.headerCell} sticky top-0 bg-gray-800 z-20`}>
                            LAST 30 DAYS
                        </th>
                        {/* Standalone Columns Header - placed between Last 30 Days and PLATFORM METRICS */}
                        <th colSpan="5" className={`${styles.headerCell} sticky top-0 bg-gray-800 z-20`}>

                        </th>
                        <th colSpan="6" className={`${styles.headerCell} capitalize sticky top-0 bg-gray-800 z-20`}>
                            PLATFORM METRICS
                        </th>
                        <th colSpan="3" className={`${styles.headerCell} capitalize sticky top-0 bg-gray-800 z-20`}>
                            VARIATION FROM YESTERDAY
                        </th>
                    </tr>

                    {/* Second Row: Sub-Headers */}
                    <tr className={`${styles.subHeaderRow} `}>
                        {/* Last 30 Days Sub-Headers */}
                        <th className={`${styles.headerCell} sticky bg-gray-700 z-10`}>FP Unstitch</th>
                        <th className={`${styles.headerCell} sticky bg-gray-700 z-10`}>FP RTW</th>
                        <th className={`${styles.headerCell} sticky bg-gray-700 z-10`}>DP Sale</th>
                        <th className={`${styles.headerCell} sticky bg-gray-700 z-10`}>FP Sale</th>
                        <th className={`${styles.headerCell} sticky bg-gray-700 z-10`}>Total Sale</th>

                        {/* Google Spent, Meta Spent, Total Spent, % of FP Sale, Actual FP ROAS Sub-Headers */}
                        <th className={`${styles.headerCell} sticky bg-gray-700 z-10`}>Google Spent</th>
                        <th className={`${styles.headerCell} sticky bg-gray-700 z-10`}>Meta Spent</th>
                        <th className={`${styles.headerCell} sticky bg-gray-700 z-10`}>Total Spent</th>
                        <th className={`${styles.headerCell} sticky bg-gray-700 z-10`}>% of FP Sale</th>
                        <th className={`${styles.headerCell} sticky bg-gray-700 z-10`}>Actual FP ROAS</th>

                        {/* PLATFORM METRICS Sub-Headers */}
                        <th className={`${styles.headerCell} sticky bg-gray-700 z-10`}>Google Imp.</th>
                        <th className={`${styles.headerCell} sticky bg-gray-700 z-10`}>Google CTR</th>
                        <th className={`${styles.headerCell} sticky bg-gray-700 z-10`}>Google ROAS</th>
                        <th className={`${styles.headerCell} sticky bg-gray-700 z-10`}>Meta Imp.</th>
                        <th className={`${styles.headerCell} sticky bg-gray-700 z-10`}>Meta CTR</th>
                        <th className={`${styles.headerCell} sticky bg-gray-700 z-10`}>Meta ROAS</th>

                        {/* Variation from Yesterday Sub-Headers */}
                        <th className={`${styles.headerCell} sticky bg-gray-700 z-10`}>Sales</th>
                        <th className={`${styles.headerCell} sticky bg-gray-700 z-10`}>Spent</th>
                        <th className={`${styles.headerCell} sticky bg-gray-700 z-10`}>Sessions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {!dataRows.length && (
                        <tr>
                            <td colSpan={1 + 18} className={styles.tdCenter}>
                                No data available.
                            </td>
                        </tr>
                    )}
                    {dataRows.map((r, idx) => (
                        <tr key={r.date} className={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                            <td className={`${styles.tdCell} sticky left-0 z-[5] bg-white dark:bg-bodybg`}>
                                {r.date}
                            </td>
                            {/* Data Mapping for Last 30 Days */}
                            <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.fpUnstitch || "-"}</td>
                            <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.fpRtw || "-"}</td>
                            <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.dpSale || "-"}</td>
                            <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.fpSale || "-"}</td>
                            <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.totalSale || "-"}</td>

                            {/* Data Mapping for Google Spent, Meta Spent, Total Spent, % of FP Sale, Actual FP ROAS */}
                            <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.googleSpent || "-"}</td>
                            <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.metaSpent || "-"}</td>
                            <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.totalSpent || "-"}</td>
                            <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.pctFpsale || "-"}</td>
                            <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.actualFpRoas || "-"}</td>

                            {/* Data Mapping for PLATFORM METRICS */}
                            <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.googleImp || "-"}</td>
                            <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.googleCtr || "-"}</td>
                            <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.googleRoas || "-"}</td>
                            <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.metaImp || "-"}</td>
                            <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.metaCtr || "-"}</td>
                            <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.metaRoas || "-"}</td>

                            {/* Data Mapping for Variation from Yesterday */}
                            <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.sales || "-"}</td>
                            <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.spent || "-"}</td>
                            <td className={`${styles.tdCell} ${styles.tdRight}`}>{r.sessions || "-"}</td>
                        </tr>
                    ))}
                    </tbody>
                    {totalRow && (
                        <tfoot>
                        <tr>
                            <td className={`${styles.tdCell} text-center sticky left-0 bottom-0 font-bold z-[25] bg-gray-500`}>
                                Total
                            </td>
                            {/* Total Row Mapping for all columns */}
                            <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                                {totalRow.fpUnstitch || "-"}
                            </td>
                            <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                                {totalRow.fpRtw || "-"}
                            </td>
                            <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                                {totalRow.dpSale || "-"}
                            </td>
                            <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                                {totalRow.fpSale || "-"}
                            </td>
                            <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                                {totalRow.totalSale || "-"}
                            </td>
                            {/* Total Row Mapping for Google Spent, Meta Spent, Total Spent, % of FP Sale, Actual FP ROAS */}
                            <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                                {totalRow.googleSpent || "-"}
                            </td>
                            <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                                {totalRow.metaSpent || "-"}
                            </td>
                            <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                                {totalRow.totalSpent || "-"}
                            </td>
                            <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                                {totalRow.pctFpsale || "-"}
                            </td>
                            <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                                {totalRow.actualFpRoas || "-"}
                            </td>
                            {/* Total Row Mapping for PLATFORM METRICS */}
                            <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                                {totalRow.googleImp || "-"}
                            </td>
                            <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                                {totalRow.googleCtr || "-"}
                            </td>
                            <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                                {totalRow.googleRoas || "-"}
                            </td>
                            <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                                {totalRow.metaImp || "-"}
                            </td>
                            <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                                {totalRow.metaCtr || "-"}
                            </td>
                            <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                                {totalRow.metaRoas || "-"}
                            </td>
                            {/* Total Row Mapping for Variation from Yesterday */}
                            <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                                {totalRow.sales || "-"}
                            </td>
                            <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                                {totalRow.spent || "-"}
                            </td>
                            <td className={`${styles.tdCell} ${styles.tdRight} sticky bottom-0 bg-gray-500`}>
                                {totalRow.sessions || "-"}
                            </td>
                        </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
        </>

    );
};

export default DayWisePerformanceLocal;
