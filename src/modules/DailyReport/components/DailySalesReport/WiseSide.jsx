import React, { useEffect, useState } from "react";
import { fetchStoreWiseSaleData } from "@modules/DailyReport/services/wiseside_services.js";

const StoreWise = ({ filters }) => {
    const [newData, setNewData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const data = await fetchStoreWiseSaleData(filters?.date_from, filters);
            setNewData(data || {});
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to fetch data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [filters]);

    const getMonthName = (monthNumber) => {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return months[parseInt(monthNumber, 10) - 1];
    };

    const generateDatesArray = (rawData) => {
        return Object.keys(rawData)
            .filter((dateKey) => dateKey !== "Total")
            .map((dateKey) => {
                const [year, month, day] = dateKey.split("-");
                return `${day.padStart(2, "0")}-${getMonthName(month)}-${year}`;
            });
    };
    const prepareDataForTable = (allData) => {
        const tableData = [];
        const dates = Object.keys(allData);

        if (!dates.length) {
            return tableData;
        }

        const offlineStructure = {};
        const onlineValuesByDate = Array(dates.length).fill(0);

        dates.forEach((dateKey, dateIndex) => {
            const dateArray = allData[dateKey] || [];
            const offlineObj = dateArray.find((x) => x.classification?.length > 0);

            if (offlineObj && offlineObj.classification) {
                offlineObj.classification.forEach((classificationItem) => {
                    const cName = classificationItem.classification_name;
                    if (!offlineStructure[cName]) {
                        offlineStructure[cName] = {};
                    }
                    if (classificationItem.regions && classificationItem.regions.length > 0) {
                        classificationItem.regions.forEach((regionItem) => {
                            const rName = regionItem.region;
                            if (!offlineStructure[cName][rName]) {
                                offlineStructure[cName][rName] = {};
                            }
                            regionItem.stores?.forEach((storeItem) => {
                                const sName = storeItem.store_name;
                                if (!offlineStructure[cName][rName][sName]) {
                                    offlineStructure[cName][rName][sName] = Array(dates.length).fill(0);
                                }
                                offlineStructure[cName][rName][sName][dateIndex] = storeItem.net_value;
                            });
                        });
                    } else {
                        offlineStructure[cName]["flat"] = offlineStructure[cName]["flat"] || [];
                        offlineStructure[cName]["flat"][dateIndex] = classificationItem.net_value;
                    }
                });
            }

            const onlineObj = dateArray.find((x) => !x.classification?.length);
            if (onlineObj) {
                onlineValuesByDate[dateIndex] = onlineObj.net_value;
            }
        });

        tableData.push({
            type: "Offline",
            indent: 0,
            isSubHeader: true,
            values: Array(dates.length).fill(0),
        });

        Object.keys(offlineStructure).forEach((classificationName) => {
            tableData.push({
                type: classificationName,
                indent: 1,
                isSubHeader: true,
                values: Array(dates.length).fill(0),
            });

            const classificationRowIndex = tableData.length - 1;

            if (offlineStructure[classificationName]["flat"]) {

                const flatValues = offlineStructure[classificationName]["flat"];
                flatValues.forEach((val, idx) => {
                    tableData[classificationRowIndex].values[idx] += val;
                    tableData[0].values[idx] += val;
                });
            } else {
                Object.keys(offlineStructure[classificationName]).forEach((regionName) => {
                    if (regionName !== "flat") {
                        tableData.push({
                            type: regionName,
                            indent: 2,
                            isSubHeader: true,
                            values: Array(dates.length).fill(0),
                        });
                        const regionRowIndex = tableData.length - 1;

                        Object.keys(offlineStructure[classificationName][regionName]).forEach((storeName) => {
                            const storeValues = offlineStructure[classificationName][regionName][storeName];
                            tableData.push({
                                type: storeName,
                                indent: 3,
                                values: storeValues,
                            });

                            storeValues.forEach((val, idx) => {
                                tableData[regionRowIndex].values[idx] += val;
                                tableData[classificationRowIndex].values[idx] += val;
                                tableData[0].values[idx] += val;
                            });
                        });
                    }
                });
            }
        });

        tableData.push({
            type: "Online",
            indent: 0,
            isSubHeader: true,
            values: onlineValuesByDate,
        });

        const grandTotals = Array(dates.length).fill(0);
        tableData.forEach((row) => {
            row.values.forEach((val, idx) => {
                grandTotals[idx] += val;
            });
        });

        tableData.push({
            type: "Total",
            isHeader: true,
            values: grandTotals,
        });

        return tableData;
    };


    const tableData = prepareDataForTable(newData);

    console.log(tableData);

    const formatNumber = (num) => {
        if (typeof num !== "number") return num;
        return num.toLocaleString();
    };

    const getRowStyle = (row) => {
        if (row.isHeader) return "bg-redd font-bold";
        if (row.isSubHeader) return "bg-yellow-50 font-semibold";
        return "";
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const dateHeaders = generateDatesArray(newData);

    return (
        <div className="overflow-x-auto p-4 bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
            <div className="overflow-x-auto max-w-full dark:text-gray-200 dark:bg-bodybg">
                <table className="w-full border-collapse text-sm dark:text-gray-200 dark:bg-bodybg">
                    <thead className="sticky top-0 z-10">
                    <tr style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
                        <th className="border border-gray-700 p-2 font-bold sticky left-0 z-20 min-w-40 dark:text-gray-200 dark:bg-bodybg">
                            Store Type
                        </th>
                        {dateHeaders.map((date, index) => (
                            <th
                                key={index}
                                className="border border-gray-700 p-2 font-bold text-center min-w-28 dark:text-gray-200 dark:bg-bodybg "
                            >
                                {date}
                            </th>
                        ))}
                        <th className="border border-gray-700 p-2 font-bold text-center min-w-28 dark:text-gray-200 dark:bg-bodybg">
                            Total
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {tableData.map((row, rowIndex) => {
                        const rowTotal = row.values.reduce((acc, val) => acc + val, 0);

                        return (
                            <tr key={rowIndex} className={getRowStyle(row)}>
                                <td
                                    className={`border border-gray-300 p-2 font-medium sticky left-0 z-10 dark:text-gray-200 dark:bg-bodybg${
                                        row.isHeader
                                            ? "bg-success"
                                            : row.isSubHeader
                                                ? "bg-yellow-50"
                                                : "bg-white"
                                    }`}
                                    style={{
                                        paddingLeft: row.indent ? `${row.indent}rem` : "0.5rem",
                                    }}
                                >
                                    {row.type}
                                </td>

                                {row.values.map((value, valueIndex) => (
                                    <td
                                        key={valueIndex}
                                        className="border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg"
                                    >
                                        {formatNumber(value)}
                                    </td>
                                ))}

                                <td className="border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg">
                                    {formatNumber(rowTotal)}
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoreWise;


