// // import React, { useEffect, useState } from 'react';
// // import { fetchStoreWiseSaleData } from "@modules/DailyReport/services/wiseside_services.js";
// //
// // const StoreWise = ({ filters }) => {
// //     const [newData, setNewData] = useState({});
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);
// //
// //     const fetchData = async () => {
// //         try {
// //             setLoading(true);
// //             const data = await fetchStoreWiseSaleData(filters?.date_from, filters);
// //             setNewData(data || {});
// //         } catch (error) {
// //             console.error("Error fetching data:", error);
// //             setError("Failed to fetch data. Please try again.");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };
// //
// //     useEffect(() => {
// //         fetchData();
// //     }, [filters]);
// //
// //     const getMonthName = (monthNumber) => {
// //         const months = [
// //             "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
// //         ];
// //         return months[parseInt(monthNumber, 10) - 1];
// //     };
// //
// //     const generateDatesArray = (rawData) => {
// //         return Object.keys(rawData)
// //             .filter(dateKey => dateKey !== 'Total')
// //             .map(dateKey => {
// //                 const [year, month, day] = dateKey.split('-');
// //                 return `${day.padStart(2, '0')}-${getMonthName(month)}-${year}`;
// //             });
// //     };
// //
// //     const prepareDataForTable = (newData) => {
// //         const tableData = [];
// //         const processedTypes = {}; // Track processed classification, region, and store
// //         const dates = Object.keys(newData); // Get the dates as columns
// //
// //         // Function to get value for a specific date
// //         const getValueForDate = (store, dateKey) => {
// //             const dateData = newData[dateKey];
// //             if (!dateData) return 0;
// //             const offlineData = dateData.find((data) => data.c_type === "Offline");
// //             if (offlineData) {
// //                 // Search for the store in the appropriate region and classification
// //                 for (let category of offlineData.classification || []) {
// //                     for (let region of category.regions || []) {
// //                         const storeData = region.stores.find((s) => s.store_name === store);
// //                         if (storeData) return storeData.net_value;
// //                     }
// //                 }
// //             }
// //             const onlineData = dateData.find((data) => data.c_type === "Online");
// //             if (onlineData) return onlineData.net_value; // For "Online"
// //             return 0;
// //         };
// //
// //         // Function to add rows and prevent duplication
// //         const addRow = (type, indent, isSubHeader = false) => {
// //             if (!processedTypes[type]) {
// //                 tableData.push({
// //                     type,
// //                     indent,
// //                     isSubHeader,
// //                     values: Array(dates.length).fill(0),
// //                 });
// //                 processedTypes[type] = true;
// //             }
// //         };
// //
// //         // Process data for Central, North, South first
// //         const categories = ['Central', 'North', 'South'];
// //
// //         categories.forEach((regionType) => {
// //             dates.forEach((dateKey) => {
// //                 const dateData = newData[dateKey];
// //                 const offlineData = dateData.find((data) => data.c_type === "Offline") || {};
// //                 const regionData = offlineData.classification?.find((category) => category.regions.some((region) => region.region === regionType));
// //
// //                 // Process each region under offline data
// //                 if (regionData) {
// //                     regionData.regions.forEach((region) => {
// //                         if (region.region === regionType) {
// //                             addRow(region.region, 1, true);
// //                             // Process stores under region
// //                             region.stores.forEach((store) => {
// //                                 let storeRow = tableData.find((item) => item.type === store.store_name);
// //
// //                                 // If store row doesn't exist, create a new row
// //                                 if (!storeRow) {
// //                                     storeRow = {
// //                                         type: store.store_name,
// //                                         indent: 2,
// //                                         values: Array(dates.length).fill(0),
// //                                     };
// //                                     tableData.push(storeRow);
// //                                 }
// //
// //                                 // Update the store row for the current date
// //                                 const storeValueForDate = getValueForDate(store.store_name, dateKey);
// //                                 storeRow.values[dates.indexOf(dateKey)] = storeValueForDate;
// //                             });
// //                         }
// //                     });
// //                 }
// //             });
// //         });
// //
// //         // Add FOL data at the end (after Central, North, South)
// //         dates.forEach((dateKey) => {
// //             const dateData = newData[dateKey];
// //             const offlineData = dateData.find((data) => data.c_type === "Offline") || {};
// //             const folData = offlineData.classification?.find((category) => category.classification_name === "FOL");
// //
// //             // Process FOL region
// //             if (folData) {
// //                 folData.regions.forEach((region) => {
// //                     addRow(region.region, 1, true);
// //                     region.stores.forEach((store) => {
// //                         let storeRow = tableData.find((item) => item.type === store.store_name);
// //
// //                         if (!storeRow) {
// //                             storeRow = {
// //                                 type: store.store_name,
// //                                 indent: 2,
// //                                 values: Array(dates.length).fill(0),
// //                             };
// //                             tableData.push(storeRow);
// //                         }
// //
// //                         const storeValueForDate = getValueForDate(store.store_name, dateKey);
// //                         storeRow.values[dates.indexOf(dateKey)] = storeValueForDate;
// //                     });
// //                 });
// //             }
// //         });
// //
// //         // Add Online Data if it exists
// //         dates.forEach((dateKey) => {
// //             const dateData = newData[dateKey];
// //             const onlineData = dateData.find((data) => data.c_type === "Online");
// //
// //             if (onlineData) {
// //                 let onlineRow = tableData.find((item) => item.type === "Online");
// //
// //                 if (!onlineRow) {
// //                     onlineRow = {
// //                         type: "Online",
// //                         indent: 1,
// //                         isSubHeader: true,
// //                         values: Array(dates.length).fill(0),
// //                     };
// //                     tableData.push(onlineRow);
// //                 }
// //
// //                 // Update the Online row for the current date
// //                 onlineRow.values[dates.indexOf(dateKey)] = onlineData.net_value;
// //             }
// //         });
// //
// //         // Add Total Row at the end to sum up all values
// //         const totalRow = {
// //             type: "Total",
// //             isHeader: true,
// //             values: Array(dates.length).fill(0),
// //         };
// //         tableData.push(totalRow);
// //
// //         // Loop through each row and sum up totals for each date column
// //         tableData.forEach((row) => {
// //             if (row.isHeader || row.isSubHeader) return; // Skip headers/subheaders
// //             row.values.forEach((_, dateIndex) => {
// //                 const storeValueForDate = getValueForDate(row.type, dates[dateIndex]);
// //                 row.values[dateIndex] = storeValueForDate;
// //                 totalRow.values[dateIndex] += storeValueForDate; // Update total row values
// //             });
// //         });
// //
// //         return tableData;
// //     };
// //
// //     const tableData = prepareDataForTable(newData);
// //
// //
// //     const formatNumber = (num) => {
// //         return num?.toLocaleString();
// //     };
// //
// //     const getRowStyle = (row) => {
// //         if (row.isHeader) return "bg-yellow-100 font-bold";
// //         if (row.isSubHeader) return "bg-yellow-50 font-semibold";
// //         return "";
// //     };
// //
// //     if (loading) return <div>Loading...</div>;
// //     if (error) return <div>{error}</div>;
// //
// //     return (
// //         <div className="overflow-x-auto p-4 bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
// //             <div className="overflow-x-auto max-w-full">
// //                 <table className="w-full border-collapse text-sm">
// //                     <thead className="sticky top-0 z-10">
// //                     <tr style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
// //                         <th className="border border-gray-700 p-2 font-bold sticky left-0 z-20 min-w-40">Store Type</th>
// //                         {generateDatesArray(newData).map((date, index) => (
// //                             <th key={index} className="border border-gray-700 p-2 font-bold text-center min-w-28">{date}</th>
// //                         ))}
// //                         <th className="border border-gray-700 p-2 font-bold text-center min-w-28">Total</th>
// //                     </tr>
// //                     </thead>
// //                     <tbody>
// //                     {tableData.map((row, rowIndex) => (
// //                         <tr key={rowIndex} className={getRowStyle(row)}>
// //                             <td
// //                                 className={`border border-gray-300 p-2 font-medium sticky left-0 z-10 ${row.isHeader ? 'bg-yellow-100' : row.isSubHeader ? 'bg-yellow-50' : 'bg-white'}`}
// //                                 style={{ paddingLeft: row.indent ? `${row.indent * 1}rem` : '0.5rem' }}
// //                             >
// //                                 {row.type}
// //                             </td>
// //                             {row.values.map((value, valueIndex) => (
// //                                 <td key={valueIndex} className="border border-gray-300 p-2 text-right">
// //                                     {formatNumber(value)}
// //                                 </td>
// //                             ))}
// //                         </tr>
// //                     ))}
// //                     </tbody>
// //                 </table>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default StoreWise;
// import React, { useEffect, useState } from 'react';
// import { fetchStoreWiseSaleData } from "@modules/DailyReport/services/wiseside_services.js";
//
// const StoreWise = ({ filters }) => {
//     const [newData, setNewData] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//
//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             const data = await fetchStoreWiseSaleData(filters?.date_from, filters);
//             setNewData(data || {});
//         } catch (error) {
//             console.error("Error fetching data:", error);
//             setError("Failed to fetch data. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     useEffect(() => {
//         fetchData();
//     }, [filters]);
//
//     const getMonthName = (monthNumber) => {
//         const months = [
//             "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//         ];
//         return months[parseInt(monthNumber, 10) - 1];
//     };
//
//     const generateDatesArray = (rawData) => {
//         return Object.keys(rawData)
//             .filter(dateKey => dateKey !== 'Total')
//             .map(dateKey => {
//                 const [year, month, day] = dateKey.split('-');
//                 return `${day.padStart(2, '0')}-${getMonthName(month)}-${year}`;
//             });
//     };
//     const prepareDataForTable = (newData) => {
//         const tableData = [];
//         const processedTypes = {}; // Track processed classification, region, and store
//         const dates = Object.keys(newData); // Get the dates as columns
//
//         // Function to get value for a specific date
//         const getValueForDate = (store, dateKey) => {
//             const dateData = newData[dateKey];
//             if (!dateData) return 0; // If no data for this date, return 0
//             const offlineData = dateData.find((data) => data.c_type === "Offline");
//             if (offlineData) {
//                 // Search for the store in the appropriate region and classification
//                 for (let category of offlineData.classification || []) {
//                     for (let region of category.regions || []) {
//                         const storeData = region.stores?.find((s) => s.store_name === store);
//                         if (storeData) return storeData.net_value;
//                     }
//                 }
//             }
//             const onlineData = dateData.find((data) => data.c_type === "Online");
//             if (onlineData) return onlineData.net_value; // For "Online"
//             return 0;
//         };
//
//         // Function to add rows and prevent duplication
//         const addRow = (type, indent, isSubHeader = false) => {
//             if (!processedTypes[type]) {
//                 tableData.push({
//                     type,
//                     indent,
//                     isSubHeader,
//                     values: Array(dates.length).fill(0),
//                 });
//                 processedTypes[type] = true;
//             }
//         };
//
//         // Process "Offline" data first
//         const offlineDataForDates = dates.map((dateKey) => {
//             const dateData = newData[dateKey];
//             if (!dateData) return {}; // Ensure that we don't return null or undefined
//             return dateData.find((data) => data.c_type === "Offline") || {};
//         });
//
//         offlineDataForDates.forEach((offlineData, index) => {
//             if (offlineData && offlineData.classification) {
//                 // Show "Offline" first
//                 addRow("Offline", 0, true);
//
//                 // Process "A-Class" under Offline
//                 offlineData.classification?.forEach((category) => {
//                     addRow(category.classification_name, 1, true);
//                     // Ensure category.regions exists before iterating
//                     if (category.regions && Array.isArray(category.regions)) {
//                         category.regions.forEach((region) => {
//                             addRow(region.region, 2, true);
//                             // Ensure region.stores exists before iterating
//                             if (region.stores && Array.isArray(region.stores)) {
//                                 region.stores.forEach((store) => {
//                                     // Skip "Lucky One Mall, Karachi" to avoid placing it under any region
//                                     if (store.store_name === "Lucky One Mall, Karachi") {
//                                         return; // Skip this store, so it doesn't get processed
//                                     }
//
//                                     let storeRow = tableData.find((item) => item.type === store.store_name);
//                                     if (!storeRow) {
//                                         storeRow = {
//                                             type: store.store_name,
//                                             indent: 3,
//                                             values: Array(dates.length).fill(0),
//                                         };
//                                         tableData.push(storeRow);
//                                     }
//
//                                     const storeValueForDate = getValueForDate(store.store_name, dates[index]);
//                                     storeRow.values[index] = storeValueForDate;
//                                 });
//                             }
//                         });
//                     }
//                 });
//             }
//         });
//
//         // Add "Online" data if it exists
//         dates.forEach((dateKey) => {
//             const dateData = newData[dateKey];
//             if (!dateData) return; // Skip if there's no data for this date
//             const onlineData = dateData.find((data) => data.c_type === "Online");
//
//             if (onlineData) {
//                 let onlineRow = tableData.find((item) => item.type === "Online");
//
//                 if (!onlineRow) {
//                     onlineRow = {
//                         type: "Online",
//                         indent: 1,
//                         isSubHeader: true,
//                         values: Array(dates.length).fill(0),
//                     };
//                     tableData.push(onlineRow);
//                 }
//
//                 // Update the Online row for the current date
//                 onlineRow.values[dates.indexOf(dateKey)] = onlineData.net_value;
//             }
//         });
//
//         // Add "Total" Row
//         const totalRow = {
//             type: "Total",
//             isHeader: true,
//             values: Array(dates.length).fill(0),
//         };
//         tableData.push(totalRow);
//
//         tableData.forEach((row) => {
//             if (row.isHeader || row.isSubHeader) return; // Skip headers/subheaders
//             row.values.forEach((_, dateIndex) => {
//                 const storeValueForDate = getValueForDate(row.type, dates[dateIndex]);
//                 row.values[dateIndex] = storeValueForDate;
//                 totalRow.values[dateIndex] += storeValueForDate; // Update total row values
//             });
//         });
//
//         return tableData;
//     };
//
//
//     // const prepareDataForTable = (newData) => {
//     //     const tableData = [];
//     //     const processedTypes = {}; // Track processed classification, region, and store
//     //     const dates = Object.keys(newData); // Get the dates as columns
//     //
//     //     // Function to get value for a specific date
//     //     const getValueForDate = (store, dateKey) => {
//     //         const dateData = newData[dateKey];
//     //         if (!dateData) return 0;
//     //         const offlineData = dateData.find((data) => data.c_type === "Offline");
//     //         if (offlineData) {
//     //             // Search for the store in the appropriate region and classification
//     //             for (let category of offlineData.classification || []) {
//     //                 for (let region of category.regions || []) {
//     //                     const storeData = region.stores.find((s) => s.store_name === store);
//     //                     if (storeData) return storeData.net_value;
//     //                 }
//     //             }
//     //         }
//     //         const onlineData = dateData.find((data) => data.c_type === "Online");
//     //         if (onlineData) return onlineData.net_value; // For "Online"
//     //         return 0;
//     //     };
//     //
//     //     // Function to add rows and prevent duplication
//     //     const addRow = (type, indent, isSubHeader = false) => {
//     //         if (!processedTypes[type]) {
//     //             tableData.push({
//     //                 type,
//     //                 indent,
//     //                 isSubHeader,
//     //                 values: Array(dates.length).fill(0),
//     //             });
//     //             processedTypes[type] = true;
//     //         }
//     //     };
//     //
//     //     // Process data for Central, North, South first
//     //     const categories = ['Central', 'North', 'South'];
//     //
//     //     categories.forEach((regionType) => {
//     //         dates.forEach((dateKey) => {
//     //             const dateData = newData[dateKey];
//     //             const offlineData = dateData.find((data) => data.c_type === "Offline") || {};
//     //             const regionData = offlineData.classification?.find((category) => category.regions.some((region) => region.region === regionType));
//     //
//     //             // Process each region under offline data
//     //             if (regionData) {
//     //                 regionData.regions.forEach((region) => {
//     //                     if (region.region === regionType) {
//     //                         addRow(region.region, 1, true);
//     //                         // Process stores under region
//     //                         region.stores.forEach((store) => {
//     //                             let storeRow = tableData.find((item) => item.type === store.store_name);
//     //
//     //                             // If store row doesn't exist, create a new row
//     //                             if (!storeRow) {
//     //                                 storeRow = {
//     //                                     type: store.store_name,
//     //                                     indent: 2,
//     //                                     values: Array(dates.length).fill(0),
//     //                                 };
//     //                                 tableData.push(storeRow);
//     //                             }
//     //
//     //                             // Update the store row for the current date
//     //                             const storeValueForDate = getValueForDate(store.store_name, dateKey);
//     //                             storeRow.values[dates.indexOf(dateKey)] = storeValueForDate;
//     //                         });
//     //                     }
//     //                 });
//     //             }
//     //         });
//     //     });
//     //
//     //     // Add FOL data at the end (after Central, North, South)
//     //     dates.forEach((dateKey) => {
//     //         const dateData = newData[dateKey];
//     //         const offlineData = dateData.find((data) => data.c_type === "Offline") || {};
//     //         const folData = offlineData.classification?.find((category) => category.classification_name === "FOL");
//     //
//     //         // Process FOL region
//     //         if (folData) {
//     //             folData.regions.forEach((region) => {
//     //                 addRow(region.region, 1, true);
//     //                 region.stores.forEach((store) => {
//     //                     let storeRow = tableData.find((item) => item.type === store.store_name);
//     //
//     //                     if (!storeRow) {
//     //                         storeRow = {
//     //                             type: store.store_name,
//     //                             indent: 2,
//     //                             values: Array(dates.length).fill(0),
//     //                         };
//     //                         tableData.push(storeRow);
//     //                     }
//     //
//     //                     const storeValueForDate = getValueForDate(store.store_name, dateKey);
//     //                     storeRow.values[dates.indexOf(dateKey)] = storeValueForDate;
//     //                 });
//     //             });
//     //         }
//     //     });
//     //
//     //     // Add Online Data if it exists
//     //     dates.forEach((dateKey) => {
//     //         const dateData = newData[dateKey];
//     //         const onlineData = dateData.find((data) => data.c_type === "Online");
//     //
//     //         if (onlineData) {
//     //             let onlineRow = tableData.find((item) => item.type === "Online");
//     //
//     //             if (!onlineRow) {
//     //                 onlineRow = {
//     //                     type: "Online",
//     //                     indent: 1,
//     //                     isSubHeader: true,
//     //                     values: Array(dates.length).fill(0),
//     //                 };
//     //                 tableData.push(onlineRow);
//     //             }
//     //
//     //             // Update the Online row for the current date
//     //             onlineRow.values[dates.indexOf(dateKey)] = onlineData.net_value;
//     //         }
//     //     });
//     //
//     //     // Add Total Row at the end to sum up all values
//     //     const totalRow = {
//     //         type: "Total",
//     //         isHeader: true,
//     //         values: Array(dates.length).fill(0),
//     //     };
//     //     tableData.push(totalRow);
//     //
//     //     // Loop through each row and sum up totals for each date column
//     //     tableData.forEach((row) => {
//     //         if (row.isHeader || row.isSubHeader) return; // Skip headers/subheaders
//     //         row.values.forEach((_, dateIndex) => {
//     //             const storeValueForDate = getValueForDate(row.type, dates[dateIndex]);
//     //             row.values[dateIndex] = storeValueForDate;
//     //             totalRow.values[dateIndex] += storeValueForDate; // Update total row values
//     //         });
//     //     });
//     //
//     //     return tableData;
//     // };
//
//     const tableData = prepareDataForTable(newData);
//
//
//     const formatNumber = (num) => {
//         return num?.toLocaleString();
//     };
//
//     const getRowStyle = (row) => {
//         if (row.isHeader) return "bg-yellow-100 font-bold";
//         if (row.isSubHeader) return "bg-yellow-50 font-semibold";
//         return "";
//     };
//
//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;
//
//     return (
//         <div className="overflow-x-auto p-4 bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
//             <div className="overflow-x-auto max-w-full">
//                 <table className="w-full border-collapse text-sm">
//                     <thead className="sticky top-0 z-10">
//                     <tr style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
//                         <th className="border border-gray-700 p-2 font-bold sticky left-0 z-20 min-w-40">Store Type</th>
//                         {generateDatesArray(newData).map((date, index) => (
//                             <th key={index} className="border border-gray-700 p-2 font-bold text-center min-w-28">{date}</th>
//                         ))}
//                         <th className="border border-gray-700 p-2 font-bold text-center min-w-28">Total</th>
//                     </tr>
//                     </thead>
//                     <tbody>
//                     {tableData.map((row, rowIndex) => (
//                         <tr key={rowIndex} className={getRowStyle(row)}>
//                             <td
//                                 className={`border border-gray-300 p-2 font-medium sticky left-0 z-10 ${row.isHeader ? 'bg-yellow-100' : row.isSubHeader ? 'bg-yellow-50' : 'bg-white'}`}
//                                 style={{ paddingLeft: row.indent ? `${row.indent * 1}rem` : '0.5rem' }}
//                             >
//                                 {row.type}
//                             </td>
//                             {row.values.map((value, valueIndex) => (
//                                 <td key={valueIndex} className="border border-gray-300 p-2 text-right">
//                                     {formatNumber(value)}
//                                 </td>
//                             ))}
//                         </tr>
//                     ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };
//
// export default StoreWise;
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
            const offlineObj = dateArray.find((x) => x.c_type === "Offline");
            if (offlineObj && offlineObj.classification) {
                offlineObj.classification.forEach((classificationItem) => {
                    const cName = classificationItem.classification_name;
                    if (!offlineStructure[cName]) {
                        offlineStructure[cName] = {};
                    }
                    classificationItem.regions?.forEach((regionItem) => {
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
                });
            }

            const onlineObj = dateArray.find((x) => x.c_type === "Online");
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

            Object.keys(offlineStructure[classificationName]).forEach((regionName) => {
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


            });

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

    const formatNumber = (num) => {
        if (typeof num !== "number") return num;
        return num.toLocaleString();
    };

    const getRowStyle = (row) => {
        if (row.isHeader) return "bg-yellow-100 font-bold";
        if (row.isSubHeader) return "bg-yellow-50 font-semibold";
        return "";
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    // Now render the table
    const dateHeaders = generateDatesArray(newData);

    return (
        <div className="overflow-x-auto p-4 bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
            <div className="overflow-x-auto max-w-full">
                <table className="w-full border-collapse text-sm">
                    <thead className="sticky top-0 z-10">
                    <tr style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
                        <th className="border border-gray-700 p-2 font-bold sticky left-0 z-20 min-w-40">
                            Store Type
                        </th>
                        {dateHeaders.map((date, index) => (
                            <th
                                key={index}
                                className="border border-gray-700 p-2 font-bold text-center min-w-28"
                            >
                                {date}
                            </th>
                        ))}
                        {/* We often show a final "Total" column on the far right: */}
                        <th className="border border-gray-700 p-2 font-bold text-center min-w-28">
                            Total
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {tableData.map((row, rowIndex) => {
                        // We'll compute the row's "Total" by summing row.values
                        const rowTotal = row.values.reduce((acc, val) => acc + val, 0);

                        return (
                            <tr key={rowIndex} className={getRowStyle(row)}>
                                {/* Left-most cell (store/region/classification name) */}
                                <td
                                    className={`border border-gray-300 p-2 font-medium sticky left-0 z-10 ${
                                        row.isHeader
                                            ? "bg-yellow-100"
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

                                {/* One cell per date value */}
                                {row.values.map((value, valueIndex) => (
                                    <td
                                        key={valueIndex}
                                        className="border border-gray-300 p-2 text-right"
                                    >
                                        {formatNumber(value)}
                                    </td>
                                ))}

                                {/* Final total cell for this row */}
                                <td className="border border-gray-300 p-2 text-right">
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
