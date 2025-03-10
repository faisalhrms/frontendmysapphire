import React, { useEffect, useState } from "react";
import { fetchdigitalspent } from "../../services/digitalspent_services.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";  // ✅ Importing LoadingSpinner

const ObjectiveWiseSpentSummary = ({ filters }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const apiResponse = await fetchdigitalspent(filters);

                const formattedData = Object.keys(apiResponse).map((region) => {
                    const entries = apiResponse[region];

                    const categoryTotals = {
                        lastDay: {
                            googleAds: entries.reduce((acc, cur) => acc + Number(cur.ld_googleads), 0),
                            metaAds: entries.reduce((acc, cur) => acc + Number(cur.ld_metaads), 0),
                            total: entries.reduce((acc, cur) => acc + Number(cur.ld_total), 0),
                        },
                        mtd: {
                            googleAds: entries.reduce((acc, cur) => acc + Number(cur.mtd_googleads), 0),
                            metaAds: entries.reduce((acc, cur) => acc + Number(cur.mtd_metaads), 0),
                            total: entries.reduce((acc, cur) => acc + Number(cur.mtd_total), 0),
                        },
                    };

                    return {
                        name: region.charAt(0).toUpperCase() + region.slice(1),
                        subCategories: entries.map((entry) => ({
                            objective: entry.origin,
                            lastDay: {
                                googleAds: Number(entry.ld_googleads),
                                metaAds: Number(entry.ld_metaads),
                                total: Number(entry.ld_total),
                            },
                            mtd: {
                                googleAds: Number(entry.mtd_googleads),
                                metaAds: Number(entry.mtd_metaads),
                                total: Number(entry.mtd_total),
                            },
                        })),
                        totalRow: categoryTotals,
                    };
                });

                setData(formattedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (filters?.date_from && filters?.date_to) {
            fetchData();
        }
    }, [filters]);

    return (
        <div className="overflow-x-auto p-4 bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner />
                </div>
            ) : (
                <table className="min-w-full border border-gray-300 shadow-md text-sm">
                    <thead >
                    <tr className="bg-gray-200 text-gray-900 text-sm">
                        <th rowSpan="2" className="py-2 px-4 border border-gray-400 p-2 dark:border-gray-700 text-center dark:text-gray-200 dark:bg-bodybg">Origin</th>
                        <th colSpan="3" className="py-2 px-4 border border-gray-400 p-2 dark:border-gray-700 text-center dark:text-gray-200 dark:bg-bodybg">Last Day</th>
                        <th colSpan="3" className="py-2 px-4 border border-gray-400 p-2 dark:border-gray-700 text-center dark:text-gray-200 dark:bg-bodybg">MTD</th>
                    </tr>
                    <tr className="bg-gray-200 text-gray-900 text-sm">
                        <th className="py-2 px-4 border border-gray-400 p-2 dark:border-gray-700 text-center dark:text-gray-200 dark:bg-bodybg">GoogleAds</th>
                        <th className="ppy-2 px-4 border border-gray-400 p-2 dark:border-gray-700 text-center dark:text-gray-200 dark:bg-bodybg">MetaAds</th>
                        <th className="py-2 px-4 border border-gray-400 p-2 dark:border-gray-700 text-center dark:text-gray-200 dark:bg-bodybg">Total</th>
                        <th className="py-2 px-4 border border-gray-400 p-2 dark:border-gray-700 text-center dark:text-gray-200 dark:bg-bodybg">GoogleAds</th>
                        <th className="py-2 px-4 border border-gray-400 p-2 dark:border-gray-700 text-center dark:text-gray-200 dark:bg-bodybg">MetaAds</th>
                        <th className="py-2 px-4 border border-gray-400 p-2 dark:border-gray-700 text-center dark:text-gray-200 dark:bg-bodybg">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map((region, idx) => (
                        <React.Fragment key={idx}>
                            <tr className="bg-gray-200 font-bold p-2 border text-gray-900 border-gray-400 dark:border-gray-700 dark:text-gray-200 dark:bg-bodybg">
                                <td className="px-4 py-2 border text-sm"> {region.name}</td>
                                <td className="px-4 py-2 border text-sm text-right">{region.totalRow.lastDay.googleAds.toLocaleString()}</td>
                                <td className="px-4 py-2 border text-sm text-right">{region.totalRow.lastDay.metaAds.toLocaleString()}</td>
                                <td className="px-4 py-2 border text-sm text-right">{region.totalRow.lastDay.total.toLocaleString()}</td>
                                <td className="px-4 py-2 border text-sm text-right">{region.totalRow.mtd.googleAds.toLocaleString()}</td>
                                <td className="px-4 py-2 border text-sm text-right">{region.totalRow.mtd.metaAds.toLocaleString()}</td>
                                <td className="px-4 py-2 border text-sm text-right">{region.totalRow.mtd.total.toLocaleString()}</td>
                            </tr>
                            {region.subCategories.map((sub, subIdx) => (
                                <tr key={subIdx} className="">
                                    <td className="px-4 py-2 border">{sub.objective}</td>
                                    <td className="px-4 py-2 border text-right">{sub.lastDay.googleAds.toLocaleString()}</td>
                                    <td className="px-4 py-2 border text-right">{sub.lastDay.metaAds.toLocaleString()}</td>
                                    <td className="px-4 py-2 border text-right">{sub.lastDay.total.toLocaleString()}</td>
                                    <td className="px-4 py-2 border text-right">{sub.mtd.googleAds.toLocaleString()}</td>
                                    <td className="px-4 py-2 border text-right">{sub.mtd.metaAds.toLocaleString()}</td>
                                    <td className="px-4 py-2 border text-right">{sub.mtd.total.toLocaleString()}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                    <tr className="bg-gray-200 text-gray-900 font-bold dark:text-gray-200 dark:bg-bodybg">
                        <td className="py-2 px-4 border border-gray-400">Total</td>
                        <td className="py-2 px-4 border border-gray-400 text-right">
                            {data.reduce((acc, cur) => acc + cur.totalRow.lastDay.googleAds, 0).toLocaleString()}
                        </td>
                        <td className="py-2 px-4 border border-gray-400 text-right">
                            {data.reduce((acc, cur) => acc + cur.totalRow.lastDay.metaAds, 0).toLocaleString()}
                        </td>
                        <td className="py-2 px-4 border border-gray-400 text-right">
                            {data.reduce((acc, cur) => acc + cur.totalRow.lastDay.total, 0).toLocaleString()}
                        </td>
                        <td className="py-2 px-4 border border-gray-400 text-right">
                            {data.reduce((acc, cur) => acc + cur.totalRow.mtd.googleAds, 0).toLocaleString()}
                        </td>
                        <td className="py-2 px-4 border border-gray-400 text-right">
                            {data.reduce((acc, cur) => acc + cur.totalRow.mtd.metaAds, 0).toLocaleString()}
                        </td>
                        <td className="py-2 px-4 border border-gray-400 text-right">
                            {data.reduce((acc, cur) => acc + cur.totalRow.mtd.total, 0).toLocaleString()}
                        </td>
                    </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ObjectiveWiseSpentSummary;
