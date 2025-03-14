import React, {useEffect, useState} from 'react';
import {fetchStoreWiseSaleData} from "@modules/DailyReport/services/wiseside_services.js";

const StoreWise = ({filters}) => {
console.log(filters);
    // const dates = [
    //     "01-Feb-2025", "02-Feb-2025", "03-Feb-2025", "04-Feb-2025", "05-Feb-2025", "06-Feb-2025", "07-Feb-2025",
    //     "08-Feb-2025", "09-Feb-2025", "10-Feb-2025", "11-Feb-2025", "12-Feb-2025", "13-Feb-2025", "14-Feb-2025",
    //     "15-Feb-2025", "16-Feb-2025", "17-Feb-2025", "18-Feb-2025", "19-Feb-2025", "20-Feb-2025", "21-Feb-2025",
    //     "22-Feb-2025", "23-Feb-2025", "24-Feb-2025", "25-Feb-2025", "26-Feb-2025", "27-Feb-2025", "28-Feb-2025"
    // ];

    const [scrollLeft, setScrollLeft] = useState(0);

    // Generate sample data structure to match image
    // const tableData = [
    //     {
    //         type: "Offline",
    //         isHeader: true,
    //
    //         values: [64895498, 55737644, 46737738, 53672711, 67429054, 55318328, 53775819, 66234516, 52903591, 73331174, 76555266, 70770947, 67323049, 87387882, 78253009, 95540021, 69065340, 75947400, 78796160, 75499372, 71322770, 73708531, 84473379, 79332462, 65926190, 76658226, 71378070,71378070]
    //     },
    //     {
    //         type: "A-Class",
    //         indent: 1,
    //         isSubHeader: true,
    //         values: [57106319, 50825600, 40371373, 47603211, 60379829, 49229456, 48105861, 62121526, 47139238, 67476426, 68489344, 63861391, 61212104, 78547174, 70269195, 82105897, 61752626, 66266373, 73147173, 67480846, 63880298, 70521493, 74674248, 71744364, 56824351, 70530924, 63926349, 63926349]
    //     },
    //     {
    //         type: "Central",
    //         indent: 2,
    //         isSubHeader: true,
    //         values: [26846180, 24519999, 21371917, 24229575, 28851574, 25831545, 24903445, 34146557, 21650996, 33748106, 34653504, 34149672, 30429251, 42119299, 43339451, 50000824, 34373233, 42462457, 43471944, 34577116, 28026371, 30365515, 36470445, 33840461, 29713662, 32125870, 28863703]
    //     },
    //     {
    //         type: "Emporium Mall, Lahore",
    //         indent: 3,
    //         values: [4091171, 3164734, 2537744, 3262467, 3638762, 3158536, 3728358, 5346557, 3265996, 3748106, 3665504, 4149672, 3542251, 4319299, 4339451, 4000824, 3437233, 4246245, 4347194, 3457716, 2802637, 3036551, 3647044, 3384046, 2971366, 3212587, 2886370]
    //     },
    //     {
    //         type: "Gulberg II, Lahore",
    //         indent: 3,
    //         values: [2484735, 1535469, 1678467, 2552085, 2134074, 3040445, 2678473, 3768793, 2313006, 3245042, 3248573, 3476103, 2429714, 4054950, 4550298, 3374775, 3097440, 4255134, 4211181, 4117968, 3212193, 3151976, 3488058, 4300547, 3019264, 3410975, 3133276]
    //     },
    //     {
    //         type: "North",
    //         indent: 2,
    //         isSubHeader: true,
    //         values: [26846180, 24519999, 21371917, 24229575, 28851574, 25831545, 24903445, 34146557, 21650996, 33748106, 34653504, 34149672, 30429251, 42119299, 43339451, 50000824, 34373233, 42462457, 43471944, 34577116, 28026371, 30365515, 36470445, 33840461, 29713662, 32125870, 28863703]
    //     },
    //     {
    //         type: "Emporium Mall, Lahore",
    //         indent: 3,
    //         values: [4091171, 3164734, 2537744, 3262467, 3638762, 3158536, 3728358, 5346557, 3265996, 3748106, 3665504, 4149672, 3542251, 4319299, 4339451, 4000824, 3437233, 4246245, 4347194, 3457716, 2802637, 3036551, 3647044, 3384046, 2971366, 3212587, 2886370]
    //     },
    //     {
    //         type: "Gulberg II, Lahore",
    //         indent: 3,
    //         values: [2484735, 1535469, 1678467, 2552085, 2134074, 3040445, 2678473, 3768793, 2313006, 3245042, 3248573, 3476103, 2429714, 4054950, 4550298, 3374775, 3097440, 4255134, 4211181, 4117968, 3212193, 3151976, 3488058, 4300547, 3019264, 3410975, 3133276]
    //     },
    //     {
    //         type: "South",
    //         indent: 2,
    //         isSubHeader: true,
    //         values: [26846180, 24519999, 21371917, 24229575, 28851574, 25831545, 24903445, 34146557, 21650996, 33748106, 34653504, 34149672, 30429251, 42119299, 43339451, 50000824, 34373233, 42462457, 43471944, 34577116, 28026371, 30365515, 36470445, 33840461, 29713662, 32125870, 28863703]
    //     },
    //     {
    //         type: "Emporium Mall, Lahore",
    //         indent: 3,
    //         values: [4091171, 3164734, 2537744, 3262467, 3638762, 3158536, 3728358, 5346557, 3265996, 3748106, 3665504, 4149672, 3542251, 4319299, 4339451, 4000824, 3437233, 4246245, 4347194, 3457716, 2802637, 3036551, 3647044, 3384046, 2971366, 3212587, 2886370]
    //     },
    //     {
    //         type: "Gulberg II, Lahore",
    //         indent: 3,
    //         values: [2484735, 1535469, 1678467, 2552085, 2134074, 3040445, 2678473, 3768793, 2313006, 3245042, 3248573, 3476103, 2429714, 4054950, 4550298, 3374775, 3097440, 4255134, 4211181, 4117968, 3212193, 3151976, 3488058, 4300547, 3019264, 3410975, 3133276]
    //     },
    //     {
    //         type: "FOL",
    //         indent: 1,
    //         isSubHeader: true,
    //         values: [57106319, 50825600, 40371373, 47603211, 60379829, 49229456, 48105861, 62121526, 47139238, 67476426, 68489344, 63861391, 61212104, 78547174, 70269195, 82105897, 61752626, 66266373, 73147173, 67480846, 63880298, 70521493, 74674248, 71744364, 56824351, 70530924, 63926349]
    //     },
    //     {
    //         type: "FOL",
    //         indent: 2,
    //         isSubHeader: true,
    //         values: [26846180, 24519999, 21371917, 24229575, 28851574, 25831545, 24903445, 34146557, 21650996, 33748106, 34653504, 34149672, 30429251, 42119299, 43339451, 50000824, 34373233, 42462457, 43471944, 34577116, 28026371, 30365515, 36470445, 33840461, 29713662, 32125870, 28863703]
    //     },
    //     {
    //         type: "Emporium Mall, Lahore",
    //         indent: 3,
    //         values: [4091171, 3164734, 2537744, 3262467, 3638762, 3158536, 3728358, 5346557, 3265996, 3748106, 3665504, 4149672, 3542251, 4319299, 4339451, 4000824, 3437233, 4246245, 4347194, 3457716, 2802637, 3036551, 3647044, 3384046, 2971366, 3212587, 2886370]
    //     },
    //     {
    //         type: "Gulberg II, Lahore",
    //         indent: 3,
    //         values: [2484735, 1535469, 1678467, 2552085, 2134074, 3040445, 2678473, 3768793, 2313006, 3245042, 3248573, 3476103, 2429714, 4054950, 4550298, 3374775, 3097440, 4255134, 4211181, 4117968, 3212193, 3151976, 3488058, 4300547, 3019264, 3410975, 3133276]
    //     },
    //     {
    //         type: "Other",
    //         isHeader: true,
    //         values: [64895498, 55737644, 46737738, 53672711, 67429054, 55318328, 53775819, 66234516, 52903591, 73331174, 76555266, 70770947, 67323049, 87387882, 78253009, 95540021, 69065340, 75947400, 78796160, 75499372, 71322770, 73708531, 84473379, 79332462, 65926190, 76658226, 71378070]
    //     },
    //     {
    //         type: "online",
    //         indent: 1,
    //         isSubHeader: true,
    //         values: [57106319, 50825600, 40371373, 47603211, 60379829, 49229456, 48105861, 62121526, 47139238, 67476426, 68489344, 63861391, 61212104, 78547174, 70269195, 82105897, 61752626, 66266373, 73147173, 67480846, 63880298, 70521493, 74674248, 71744364, 56824351, 70530924, 63926349]
    //     },
    //     {
    //         type: "Offline",
    //         isHeader: true,
    //         values: [64895498, 55737644, 46737738, 53672711, 67429054, 55318328, 53775819, 66234516, 52903591, 73331174, 76555266, 70770947, 67323049, 87387882, 78253009, 95540021, 69065340, 75947400, 78796160, 75499372, 71322770, 73708531, 84473379, 79332462, 65926190, 76658226, 71378070]
    //     },
    //     {
    //         type: "Other",
    //         isHeader: true,
    //         values: [64895498, 55737644, 46737738, 53672711, 67429054, 55318328, 53775819, 66234516, 52903591, 73331174, 76555266, 70770947, 67323049, 87387882, 78253009, 95540021, 69065340, 75947400, 78796160, 75499372, 71322770, 73708531, 84473379, 79332462, 65926190, 76658226, 71378070, 71378070]
    //     },
    //     {
    //         type: "Total",
    //         isHeader: true,
    //         values: [64895498, 64895498, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 71378070]
    //     }
    // ];

    const [newData, setNewData] = useState({});
    const fetchData = async () => {
        try {
            const data = await fetchStoreWiseSaleData(filters?.date_from);
            console.log(data);
            setNewData(data||[]);
        }catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        fetchData();
    },[filters])

    const getMonthName = (monthNumber) => {
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        return months[parseInt(monthNumber, 10) - 1];
    };

    const generateDatesArray = (rawData) => {
        const dateKeys = Object.keys(rawData);


        const dates = dateKeys
            .filter(dateKey => dateKey !== 'Total')
            .map(dateKey => {
                const [year, month, day] = dateKey.split('-');
                const formattedDate = `${day.padStart(2, '0')}-${getMonthName(month)}-${year}`;
                return formattedDate;
            });

        return dates;
    };

    const dates = generateDatesArray(newData);



    const generateTableData = (rawData) => {
        const tableData = [];
        const totalValues = {};  // To store total values for categories, regions, and stores
        const processedTypes = {};  // To track processed types for each date

        const dateKeys = Object.keys(rawData); // Extract all date keys (e.g., "2025-03-01")

        // Generate dates array (you can use your existing generateDatesArray function)
        const dates = generateDatesArray(rawData);
        console.log("🚀 ~ generateTableData ~ dates:", dates);

        // Iterate through each date in the rawData
        dateKeys.forEach((date, index) => {
            const offlineData = rawData[date].Offline;
            const onlineData = rawData[date].Online;

            // Push the 'Offline' header for this date
            tableData.push({
                type: "Offline",
                isHeader: true,
                date: dates[index],
                values: []  // Will calculate this dynamically for this date
            });

            // Iterate through the categories in 'Offline' (A-Class, FOL, etc.)
            Object.keys(offlineData).forEach(category => {
                const categoryData = offlineData[category];

                // Push the subcategory header (A-Class, FOL, etc.) only if it has not been processed for this date
                if (!processedTypes[category]) {
                    tableData.push({
                        type: category,
                        indent: 1,
                        isSubHeader: true,
                        date: dates[index],
                        values: Array(dates.length).fill(0) // Initialize values with 0 for all dates
                    });
                    processedTypes[category] = {}; // Initialize processedTypes for this category
                }

                // Iterate through the regions and stores in each category (Central, North, South, etc.)
                Object.keys(categoryData).forEach(region => {
                    const regionData = categoryData[region];

                    // Push the region header (Central, North, South, etc.) only if it has not been processed for this date
                    if (!processedTypes[category][region]) {
                        tableData.push({
                            type: region,
                            indent: 2,
                            isSubHeader: true,
                            date: dates[index],
                            values: Array(dates.length).fill(0) // Initialize values with 0 for all dates
                        });
                        processedTypes[category][region] = {}; // Initialize processedTypes for this region
                    }

                    // Iterate through the stores in each region and add their values
                    Object.keys(regionData).forEach(store => {
                        const storeValue = regionData[store];

                        // Check if this store already exists for this date
                        const existingStore = tableData.find(item => item.type === store);

                        if (!existingStore) {
                            // Push store data if it doesn't already exist for this date
                            const storeData = {
                                type: store,
                                indent: 3,
                                date: dates[index],
                                values: Array(dates.length).fill(0)  // Initialize the values array to store data for all dates
                            };

                            // Add store value for this date
                            storeData.values[index] = storeValue;

                            tableData.push(storeData);  // Add the store data to the table
                        } else {
                            // If the store was already processed, just update its value
                            existingStore.values[index] = storeValue;  // Update store value for the specific date
                        }

                        // Update total values for each store and category
                        if (!totalValues[category]) totalValues[category] = 0;
                        totalValues[category] += storeValue;

                        if (!totalValues["Total"]) totalValues["Total"] = 0;
                        totalValues["Total"] += storeValue;
                    });
                });
            });

            // Add Online data for this date
            if (!processedTypes["Online"]) {
                tableData.push({
                    type: "Online",
                    indent: 1,
                    isSubHeader: true,
                    date: dates[index],
                    values: Array(dates.length).fill(0)  // Initialize the values for Online data
                });
                processedTypes["Online"] = true; // Mark Online as processed
            }

            // Update the Online values
            tableData.forEach(item => {
                if (item.type === "Online") {
                    item.values[index] = onlineData; // Store the value for the specific date
                }
            });

            // Update the total values for Online
            totalValues["Total"] += onlineData;
            totalValues["Online"] = onlineData;
        });

        // Push the Total row after processing all dates
        tableData.push({
            type: "Total",
            isHeader: true,
            date: "Total",
            values: Array(dates.length).fill(totalValues["Total"])  // Store total values for each date
        });

        return tableData;
    };

    const tableData = generateTableData(newData);


    const formatNumber = (num) => {
        return num?.toLocaleString();
    };

    const getRowTotal = (values) => {
        return values.reduce((sum, current) => sum + current, 0);
    };

    const getRowStyle = (row) => {
        if (row.isHeader) {
            return "bg-yellow-100 font-bold";
        } else if (row.isSubHeader) {
            return "bg-yellow-50 font-semibold";
        }
        return "";
    };

    return (
        <div className="overflow-x-auto p-4 bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
            <div className="overflow-x-auto max-w-full">
                <table className="w-full border-collapse text-sm">
                    <thead className="sticky top-0 z-10">
                    <tr style={{backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white"}}>
                        <th style={{backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white"}} className="border border-gray-700 p-2 font-bold sticky left-0 z-20 min-w-40">
                            Store Type
                        </th>
                        {dates.map((date, index) => (
                            <th key={index} className="border border-gray-700 p-2 font-bold text-center min-w-28 ">
                                {date}
                            </th>
                        ))}
                        <th className="border border-gray-700 p-2 font-bold text-center min-w-28">
                            Total
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex} className={getRowStyle(row)}>
                            <td
                                className={`border border-gray-300 p-2 font-medium sticky left-0 z-10 ${row.isHeader ? 'bg-yellow-100' : row.isSubHeader ? 'bg-yellow-50' : 'bg-white'}`}
                                style={{ paddingLeft: row.indent ? `${row.indent * 1}rem` : '0.5rem' }}
                            >
                                {row.type}
                            </td>
                            {row.values.map((value, valueIndex) => (
                                <td key={valueIndex} className="border border-gray-300 p-2 text-right">
                                    {formatNumber(value)}
                                </td>
                            ))}
                            {/*<td className="border border-gray-300 p-2 text-right font-bold">*/}
                            {/*    {formatNumber(getRowTotal(row.values))}*/}
                            {/*</td>*/}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StoreWise;