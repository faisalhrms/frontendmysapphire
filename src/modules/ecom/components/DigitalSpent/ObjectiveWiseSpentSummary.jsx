import React from "react";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const ObjectiveWiseSpentSummary = ({ filters, data = {}, loading }) => {

    const formattedDate = filters?.till_date
        ? new Date(filters.till_date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "N/A";

    // Helper: calculate totals per region
    const calcTotals = (entries) => {
        return entries.reduce(
            (acc, cur) => {
                acc.ld_googleads += Number(cur.ld_googleads);
                acc.ld_metaads += Number(cur.ld_metaads);
                acc.ld_total += Number(cur.ld_total);
                acc.mtd_googleads += Number(cur.mtd_googleads);
                acc.mtd_metaads += Number(cur.mtd_metaads);
                acc.mtd_total += Number(cur.mtd_total);
                return acc;
            },
            {
                ld_googleads: 0,
                ld_metaads: 0,
                ld_total: 0,
                mtd_googleads: 0,
                mtd_metaads: 0,
                mtd_total: 0,
            }
        );
    };

    const regions = Object.keys(data);

    // Calculate grand totals for all regions combined
    const grandTotals = regions.reduce(
        (acc, regionKey) => {
            const totals = calcTotals(data[regionKey]);
            acc.ld_googleads += totals.ld_googleads;
            acc.ld_metaads += totals.ld_metaads;
            acc.ld_total += totals.ld_total;
            acc.mtd_googleads += totals.mtd_googleads;
            acc.mtd_metaads += totals.mtd_metaads;
            acc.mtd_total += totals.mtd_total;
            return acc;
        },
        {
            ld_googleads: 0,
            ld_metaads: 0,
            ld_total: 0,
            mtd_googleads: 0,
            mtd_metaads: 0,
            mtd_total: 0,
        }
    );

    return (
        <div className="overflow-x-auto p-4 bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">


            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner />
                </div>
            ) : (
                <table className="min-w-full border border-gray-300 shadow-md text-sm">
                    <thead>
                    <tr
                        style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}
                        className="bg-gray-200 text-gray-900 text-sm"
                    >
                        <th
                            rowSpan="2"
                            className="py-2 px-4 border border-gray-400 p-2 text-center dark:border-gray-700 dark:text-gray-200 dark:bg-bodybg"
                        >
                            Origin
                        </th>
                        <th
                            colSpan="3"
                            className="py-2 px-4 border border-gray-400 p-2 text-center dark:border-gray-700 dark:text-gray-200 dark:bg-bodybg"
                        >
                            Last Day
                        </th>
                        <th
                            colSpan="3"
                            className="py-2 px-4 border border-gray-400 p-2 text-center dark:border-gray-700 dark:text-gray-200 dark:bg-bodybg"
                        >
                            MTD
                        </th>
                    </tr>
                    <tr
                        style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}
                        className="bg-gray-200 text-gray-900 text-sm"
                    >
                        <th className="py-2 px-4 border border-gray-400 p-2 text-center dark:border-gray-700 dark:text-gray-200 dark:bg-bodybg">
                            GoogleAds
                        </th>
                        <th className="py-2 px-4 border border-gray-400 p-2 text-center dark:border-gray-700 dark:text-gray-200 dark:bg-bodybg">
                            MetaAds
                        </th>
                        <th className="py-2 px-4 border border-gray-400 p-2 text-center dark:border-gray-700 dark:text-gray-200 dark:bg-bodybg">
                            Total
                        </th>
                        <th className="py-2 px-4 border border-gray-400 p-2 text-center dark:border-gray-700 dark:text-gray-200 dark:bg-bodybg">
                            GoogleAds
                        </th>
                        <th className="py-2 px-4 border border-gray-400 p-2 text-center dark:border-gray-700 dark:text-gray-200 dark:bg-bodybg">
                            MetaAds
                        </th>
                        <th className="py-2 px-4 border border-gray-400 p-2 text-center dark:border-gray-700 dark:text-gray-200 dark:bg-bodybg">
                            Total
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {regions.length === 0 && (
                        <tr>
                            <td colSpan={7} className="text-center p-4">
                                No data available.
                            </td>
                        </tr>
                    )}

                    {regions.map((regionKey) => {
                        const entries = data[regionKey];
                        const totals = calcTotals(entries);

                        return (
                            <React.Fragment key={regionKey}>

                                <tr className="bg-gray-200 font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg">
                                    <td className="px-4 py-2 border">{regionKey.charAt(0).toUpperCase() + regionKey.slice(1)}</td>
                                    <td className="px-4 py-2 border text-right">{totals.ld_googleads.toLocaleString()}</td>
                                    <td className="px-4 py-2 border text-right">{totals.ld_metaads.toLocaleString()}</td>
                                    <td className="px-4 py-2 border text-right">{totals.ld_total.toLocaleString()}</td>
                                    <td className="px-4 py-2 border text-right">{totals.mtd_googleads.toLocaleString()}</td>
                                    <td className="px-4 py-2 border text-right">{totals.mtd_metaads.toLocaleString()}</td>
                                    <td className="px-4 py-2 border text-right">{totals.mtd_total.toLocaleString()}</td>
                                </tr>

                                {/* Individual entries */}
                                {entries.map((entry, idx) => (
                                    <tr key={idx}>
                                        <td className="px-4 py-2 border">{entry.origin}</td>
                                        <td className="px-4 py-2 border text-right">{Number(entry.ld_googleads).toLocaleString()}</td>
                                        <td className="px-4 py-2 border text-right">{Number(entry.ld_metaads).toLocaleString()}</td>
                                        <td className="px-4 py-2 border text-right">{Number(entry.ld_total).toLocaleString()}</td>
                                        <td className="px-4 py-2 border text-right">{Number(entry.mtd_googleads).toLocaleString()}</td>
                                        <td className="px-4 py-2 border text-right">{Number(entry.mtd_metaads).toLocaleString()}</td>
                                        <td className="px-4 py-2 border text-right">{Number(entry.mtd_total).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </React.Fragment>
                        );
                    })}

                    {/* Grand Total Row */}
                    {regions.length > 0 && (
                        <tr className="bg-gray-300 font-bold text-gray-900 dark:text-gray-200 dark:bg-bodybg">
                            <td className="py-2 px-4 border border-gray-400">Total</td>
                            <td className="py-2 px-4 border border-gray-400 text-right">
                                {grandTotals.ld_googleads.toLocaleString()}
                            </td>
                            <td className="py-2 px-4 border border-gray-400 text-right">
                                {grandTotals.ld_metaads.toLocaleString()}
                            </td>
                            <td className="py-2 px-4 border border-gray-400 text-right">
                                {grandTotals.ld_total.toLocaleString()}
                            </td>
                            <td className="py-2 px-4 border border-gray-400 text-right">
                                {grandTotals.mtd_googleads.toLocaleString()}
                            </td>
                            <td className="py-2 px-4 border border-gray-400 text-right">
                                {grandTotals.mtd_metaads.toLocaleString()}
                            </td>
                            <td className="py-2 px-4 border border-gray-400 text-right">
                                {grandTotals.mtd_total.toLocaleString()}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ObjectiveWiseSpentSummary;
