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

        const structure = {}; 
        const valuesByDate = {};

        dates.forEach((dateKey, dateIndex) => {
            const dateArray = allData[dateKey]?.c_types || [];



            dateArray.forEach((cTypeObj) => {

                const cType = cTypeObj.c_type;
                if (!structure[cType]) {
                    structure[cType] = {};
                    valuesByDate[cType] = Array(dates.length).fill(0);
                }

                // Process classification and regions for each c_type
                if (cTypeObj.classification?.length) {
                    cTypeObj.classification.forEach((classificationItem) => {
                        const cName = classificationItem.classification_name;
                        if (!structure[cType][cName]) {
                            structure[cType][cName] = {};
                        }

                        if (classificationItem.regions?.length) {
                            classificationItem.regions.forEach((regionItem) => {
                                const rName = regionItem.region;
                                if (!structure[cType][cName][rName]) {
                                    structure[cType][cName][rName] = {};
                                }

                                regionItem.stores?.forEach((storeItem) => {
                                    const sName = storeItem.store_name;
                                    if (!structure[cType][cName][rName][sName]) {
                                        structure[cType][cName][rName][sName] = Array(dates.length).fill(0);
                                    }

                                    structure[cType][cName][rName][sName][dateIndex] = storeItem.net_value;
                                    // valuesByDate[cType][dateIndex] += storeItem.net_value;
                                });
                            });
                        } else {
                            structure[cType][cName]["flat"] = structure[cType][cName]["flat"] || [];
                            structure[cType][cName]["flat"][dateIndex] = (structure[cType][cName]["flat"][dateIndex] || 0);
                            // valuesByDate[cType][dateIndex] += classificationItem.net_value;
                        }
                    });
                } else {
                    // If there is no classification, just use the net_value directly
                    // console.log(valuesByDate)
                    valuesByDate[cType][dateIndex] = cTypeObj.net_value;
                }
            });
        });


        Object.keys(structure).forEach((cType) => {

            tableData.push({
                type: cType,
                indent: 0,
                isSubHeader: true,
                values: valuesByDate[cType],
            });

            Object.keys(structure[cType]).forEach((classificationName) => {
                tableData.push({
                    type: classificationName,
                    indent: 1,
                    isSubHeader: true,
                    values: Array(dates.length).fill(0),
                });

                const classificationRowIndex = tableData.length - 1;

                if (structure[cType][classificationName].flat) {
                    structure[cType][classificationName].flat.forEach((val, idx) => {
                        tableData[classificationRowIndex].values[idx] += val;
                        tableData[0].values[idx] += val;
                    });
                } else {
                    Object.keys(structure[cType][classificationName]).forEach((regionName) => {
                        if (regionName !== "flat") {
                            tableData.push({
                                type: regionName,
                                indent: 2,
                                isSubHeader: true,
                                values: Array(dates.length).fill(0),
                            });

                            const regionRowIndex = tableData.length - 1;

                            Object.keys(structure[cType][classificationName][regionName]).forEach((storeName) => {
                                const storeValues = structure[cType][classificationName][regionName][storeName];
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
        });

        const totalValuesByDate = dates.map((dateKey) => allData[dateKey]?.total || 0);
        tableData.push({
            type: "Total",
            isHeader: true,
            values: totalValuesByDate,
        });

        return tableData;
    };



    const tableData =prepareDataForTable(newData);

    console.log(tableData);

    const formatNumber = (num) => {
        if (typeof num !== "number") return num;
        return num.toLocaleString();
    };

    const getRowStyle = (row) => {
        if (row.isHeader) return "bg-gray-200 font-bold";
        if (row.isSubHeader) return "bg-yellow-50 font-medium";
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
                        <th className="border border-gray-700 p-2 font-bold  min-w-40 dark:text-gray-200 dark:bg-bodybg">
                            Store Type
                        </th>
                        {dateHeaders.map((date, index) => (
                            <th
                                key={index}
                                className="border border-gray-700 p-2 font-normal text-center min-w-28 dark:text-gray-200 dark:bg-bodybg "
                            >
                                {date}
                            </th>
                        ))}
                        <th className="border border-gray-900 p-2 font-bold text-center min-w-28 dark:text-gray-200 dark:bg-bodybg">
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
                                    className={`border border-gray-300 p-2  dark:text-gray-200 dark:bg-bodybg${
                                        row.isHeader
                                            ? "bg-success font-bold "
                                            : row.isSubHeader
                                                ? "bg-yellow-50 font-bold"
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


