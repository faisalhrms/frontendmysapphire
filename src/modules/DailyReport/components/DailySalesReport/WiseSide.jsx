// // import React, { useEffect, useState } from "react";
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
// //         } catch (err) {
// //             console.error("Error fetching data:", err);
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
// //             "Jan", "Feb", "Mar", "Apr", "May", "Jun",
// //             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
// //         ];
// //         return months[parseInt(monthNumber, 10) - 1];
// //     };
// //
// //     const generateDatesArray = (rawData) => {
// //         return Object.keys(rawData)
// //             .filter((dateKey) => dateKey !== "Total")
// //             .map((dateKey) => {
// //                 const [year, month, day] = dateKey.split("-");
// //                 return `${day.padStart(2, "0")}-${getMonthName(month)}-${year}`;
// //             });
// //     };
// //     const prepareDataForTable = (allData) => {
// //         const tableData = [];
// //         const dates = Object.keys(allData);
// //
// //         if (!dates.length) {
// //             return tableData;
// //         }
// //
// //         const structure = {};
// //         const valuesByDate = {};
// //
// //         dates.forEach((dateKey, dateIndex) => {
// //             const dateArray = allData[dateKey]?.c_types || [];
// //
// //
// //
// //             dateArray.forEach((cTypeObj) => {
// //
// //                 const cType = cTypeObj.c_type;
// //                 if (!structure[cType]) {
// //                     structure[cType] = {};
// //                     valuesByDate[cType] = Array(dates.length).fill(0);
// //                 }
// //
// //                 if (cTypeObj.classification?.length) {
// //                     cTypeObj.classification.forEach((classificationItem) => {
// //                         const cName = classificationItem.classification_name;
// //                         if (!structure[cType][cName]) {
// //                             structure[cType][cName] = {};
// //                         }
// //
// //                         if (classificationItem.regions?.length) {
// //                             classificationItem.regions.forEach((regionItem) => {
// //                                 const rName = regionItem.region;
// //                                 if (!structure[cType][cName][rName]) {
// //                                     structure[cType][cName][rName] = {};
// //                                 }
// //
// //                                 regionItem.stores?.forEach((storeItem) => {
// //                                     const sName = storeItem.store_name;
// //                                     if (!structure[cType][cName][rName][sName]) {
// //                                         structure[cType][cName][rName][sName] = Array(dates.length).fill(0);
// //                                     }
// //
// //                                     structure[cType][cName][rName][sName][dateIndex] = storeItem.net_value;
// //                                     // valuesByDate[cType][dateIndex] += storeItem.net_value;
// //                                 });
// //                             });
// //                         } else {
// //                             structure[cType][cName]["flat"] = structure[cType][cName]["flat"] || [];
// //
// //                             structure[cType][cName]["flat"][dateIndex] = (structure[cType][cName]["flat"][dateIndex] || 0) + classificationItem.net_value;
// //                             // valuesByDate[cType][dateIndex] += classificationItem.net_value;
// //                         }
// //                     });
// //                 } else {
// //                     // If there is no classification, just use the net_value directly
// //                     // console.log(valuesByDate)
// //                     valuesByDate[cType][dateIndex] = cTypeObj.net_value;
// //                 }
// //             });
// //         });
// //
// //
// //         Object.keys(structure).forEach((cType) => {
// //
// //             tableData.push({
// //                 type: cType,
// //                 indent: 0,
// //                 isSubHeader: true,
// //                 values: valuesByDate[cType],
// //             });
// //
// //             Object.keys(structure[cType]).forEach((classificationName) => {
// //                 tableData.push({
// //                     type: classificationName,
// //                     indent: 1,
// //                     isSubHeader: true,
// //                     values: Array(dates.length).fill(0),
// //                 });
// //
// //                 const classificationRowIndex = tableData.length - 1;
// //
// //                 if (structure[cType][classificationName].flat) {
// //                     structure[cType][classificationName].flat.forEach((val, idx) => {
// //                         tableData[classificationRowIndex].values[idx] += val;
// //                         tableData[0].values[idx] += val;
// //                     });
// //                 } else {
// //                     Object.keys(structure[cType][classificationName]).forEach((regionName) => {
// //                         if (regionName !== "flat") {
// //                             tableData.push({
// //                                 type: regionName,
// //                                 indent: 2,
// //                                 isSubHeader: true,
// //                                 values: Array(dates.length).fill(0),
// //                             });
// //
// //                             const regionRowIndex = tableData.length - 1;
// //
// //                             Object.keys(structure[cType][classificationName][regionName]).forEach((storeName) => {
// //                                 const storeValues = structure[cType][classificationName][regionName][storeName];
// //                                 tableData.push({
// //                                     type: storeName,
// //                                     indent: 3,
// //                                     values: storeValues,
// //                                 });
// //
// //                                 storeValues.forEach((val, idx) => {
// //                                     tableData[regionRowIndex].values[idx] += val;
// //                                     tableData[classificationRowIndex].values[idx] += val;
// //                                     tableData[0].values[idx] += val;
// //                                 });
// //                             });
// //                         }
// //                     });
// //                 }
// //             });
// //         });
// //
// //         const totalValuesByDate = dates.map((dateKey) => allData[dateKey]?.total || 0);
// //         tableData.push({
// //             type: "Total",
// //             isHeader: true,
// //             values: totalValuesByDate,
// //         });
// //
// //         return tableData;
// //     };
// //
// //
// //
// //
// //     const tableData =prepareDataForTable(newData);
// //
// //     console.log(tableData);
// //
// //     const formatNumber = (num) => {
// //         if (typeof num !== "number") return num;
// //         return num.toLocaleString();
// //     };
// //
// //     const getRowStyle = (row) => {
// //         if (row.isHeader) return "bg-gray-200 font-bold  sticky left-0 z-20";
// //         if (row.isSubHeader) return "bg-gray-200 font-medium  sticky left-0 z-20";
// //         return "";
// //     };
// //
// //     if (loading) return <div>Loading...</div>;
// //     if (error) return <div>{error}</div>;
// //
// //     const dateHeaders = generateDatesArray(newData);
// //
// //     return (
// //         <div className="overflow-x-auto p-4 bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg">
// //             <div className="overflow-x-auto max-w-full dark:text-gray-200 dark:bg-bodybg">
// //                 <table className="w-full border-collapse text-sm dark:text-gray-200 dark:bg-bodybg">
// //                     <thead className="sticky left-0 z-20 ">
// //                     <tr style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
// //                         <th className="border bg-white border-gray-700 p-2 font-bold  min-w-80 dark:text-gray-200 dark:bg-bodybg sticky left-0 z-50" style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
// //                             Store Type
// //                         </th>
// //                         {dateHeaders.map((date, index) => (
// //                             <th
// //                                 key={index}
// //                                 className="border  border-gray-700 p-2 font-normal text-center min-w-28 dark:text-gray-200 dark:bg-bodybg   sticky left-0 z-20"
// //                             >
// //                                 {date}
// //                             </th>
// //                         ))}
// //                         <th className="border border-gray-900 p-2 font-bold text-center min-w-28 dark:text-gray-200 dark:bg-bodybg">
// //                             Total
// //                         </th>
// //                     </tr>
// //                     </thead>
// //                     <tbody>
// //                     {tableData.map((row, rowIndex) => {
// //                         const rowTotal = row.values.reduce((acc, val) => acc + val, 0);
// //
// //                         return (
// //                             <tr key={rowIndex} className={getRowStyle(row)}>
// //                                 <td
// //                                     className={`border border-gray-300 p-2 bg-gray-200 dark:text-gray-200 dark:bg-bodybg  sticky left-0 z-20 ${
// //                                         row.isHeader
// //                                             ? "bg-yy font-bold    left-0 z-50"
// //                                             : row.isSubHeader
// //                                                 ? "bg-yellow-50 font-bold   left-0 z-20"
// //                                                 : "bg-white"
// //                                     }`}
// //                                     style={{
// //                                         paddingLeft: row.indent ? `${row.indent}rem` : "0.5rem",
// //                                     }}
// //                                 >
// //                                     {row.type}
// //                                 </td>
// //
// //                                 {row.values.map((value, valueIndex) => (
// //                                     <td
// //                                         key={valueIndex}
// //                                         className="border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg"
// //                                     >
// //                                         {formatNumber(value)}
// //                                     </td>
// //                                 ))}
// //
// //                                 <td className="border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg">
// //                                     {formatNumber(rowTotal)}
// //                                 </td>
// //                             </tr>
// //                         );
// //                     })}
// //                     </tbody>
// //                 </table>
// //             </div>
// //         </div>
// //     );
// // };
// //
// // export default StoreWise;
// //
//
//
// import React, { useEffect, useState, useRef } from "react";
// import { fetchStoreWiseSaleData } from "@modules/DailyReport/services/wiseside_services.js";
//
// const StoreWise = ({ filters }) => {
//     const [newData, setNewData] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const tableContainerRef = useRef(null);
//
//     const fetchData = async () => {
//         try {
//             setLoading(true);
//             const data = await fetchStoreWiseSaleData(filters?.date_from, filters);
//             setNewData(data || {});
//         } catch (err) {
//             console.error("Error fetching data:", err);
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
//             "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//             "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//         ];
//         return months[parseInt(monthNumber, 10) - 1];
//     };
//
//     const generateDatesArray = (rawData) => {
//         return Object.keys(rawData)
//             .filter((dateKey) => dateKey !== "Total")
//             .map((dateKey) => {
//                 const [year, month, day] = dateKey.split("-");
//                 return `${day.padStart(2, "0")}-${getMonthName(month)}-${year}`;
//             });
//     };
//
//     // const prepareDataForTable = (allData) => {
//     //     const tableData = [];
//     //     const dates = Object.keys(allData);
//     //
//     //     if (!dates.length) {
//     //         return tableData;
//     //     }
//     //
//     //     const structure = {};
//     //     const valuesByDate = {};
//     //
//     //     dates.forEach((dateKey, dateIndex) => {
//     //         const dateArray = allData[dateKey]?.c_types || [];
//     //
//     //         dateArray.forEach((cTypeObj) => {
//     //             const cType = cTypeObj.c_type;
//     //             if (!structure[cType]) {
//     //                 structure[cType] = {};
//     //                 valuesByDate[cType] = Array(dates.length).fill(0);
//     //             }
//     //
//     //             if (cTypeObj.classification?.length) {
//     //                 cTypeObj.classification.forEach((classificationItem) => {
//     //                     const cName = classificationItem.classification_name;
//     //                     if (!structure[cType][cName]) {
//     //                         structure[cType][cName] = {};
//     //                     }
//     //
//     //                     if (classificationItem.regions?.length) {
//     //                         classificationItem.regions.forEach((regionItem) => {
//     //                             const rName = regionItem.region;
//     //                             if (!structure[cType][cName][rName]) {
//     //                                 structure[cType][cName][rName] = {};
//     //                             }
//     //
//     //                             regionItem.stores?.forEach((storeItem) => {
//     //                                 const sName = storeItem.store_name;
//     //                                 if (!structure[cType][cName][rName][sName]) {
//     //                                     structure[cType][cName][rName][sName] = Array(dates.length).fill(0);
//     //                                 }
//     //
//     //                                 structure[cType][cName][rName][sName][dateIndex] = storeItem.net_value;
//     //                             });
//     //                         });
//     //                     } else {
//     //                         structure[cType][cName]["flat"] = structure[cType][cName]["flat"] || [];
//     //
//     //                         structure[cType][cName]["flat"][dateIndex] = (structure[cType][cName]["flat"][dateIndex] || 0) + classificationItem.net_value;
//     //                     }
//     //                 });
//     //             } else {
//     //                 valuesByDate[cType][dateIndex] = cTypeObj.net_value;
//     //             }
//     //         });
//     //     });
//     //
//     //     Object.keys(structure).forEach((cType) => {
//     //         tableData.push({
//     //             type: cType,
//     //             indent: 0,
//     //             isSubHeader: true,
//     //             values: valuesByDate[cType],
//     //         });
//     //
//     //         Object.keys(structure[cType]).forEach((classificationName) => {
//     //             tableData.push({
//     //                 type: classificationName,
//     //                 indent: 1,
//     //                 isSubHeader: true,
//     //                 values: Array(dates.length).fill(0),
//     //             });
//     //
//     //             const classificationRowIndex = tableData.length - 1;
//     //
//     //             if (structure[cType][classificationName].flat) {
//     //                 structure[cType][classificationName].flat.forEach((val, idx) => {
//     //                     tableData[classificationRowIndex].values[idx] += val;
//     //                     tableData[0].values[idx] += val;
//     //                 });
//     //             } else {
//     //                 Object.keys(structure[cType][classificationName]).forEach((regionName) => {
//     //                     if (regionName !== "flat") {
//     //                         tableData.push({
//     //                             type: regionName,
//     //                             indent: 2,
//     //                             isSubHeader: true,
//     //                             values: Array(dates.length).fill(0),
//     //                         });
//     //
//     //                         const regionRowIndex = tableData.length - 1;
//     //
//     //                         Object.keys(structure[cType][classificationName][regionName]).forEach((storeName) => {
//     //                             const storeValues = structure[cType][classificationName][regionName][storeName];
//     //
//     //                             tableData.push({
//     //                                 type: storeName,
//     //                                 indent: 3,
//     //                                 values: storeValues,
//     //                             });
//     //
//     //                             storeValues.forEach((val, idx) => {
//     //                                 tableData[regionRowIndex].values[idx] += val;
//     //                                 tableData[classificationRowIndex].values[idx] += val;
//     //                                 tableData[0].values[idx] += val;
//     //                             });
//     //                         });
//     //                     }
//     //                 });
//     //             }
//     //         });
//     //     });
//     //
//     //     const totalValuesByDate = dates.map((dateKey) => allData[dateKey]?.total || 0);
//     //     tableData.push({
//     //         type: "Total",
//     //         isHeader: true,
//     //         values: totalValuesByDate,
//     //     });
//     //
//     //     return tableData;
//     // };
//
//     const prepareDataForTable = (allData) => {
//         const tableData = [];
//         const dates = Object.keys(allData);
//
//         if (!dates.length) {
//             return tableData;
//         }
//
//         const structure = {};
//         const valuesByDate = {};
//
//         dates.forEach((dateKey, dateIndex) => {
//             const dateArray = allData[dateKey]?.c_types || [];
//
//             dateArray.forEach((cTypeObj) => {
//                 const cType = cTypeObj.c_type;
//                 if (!structure[cType]) {
//                     structure[cType] = {};
//                     valuesByDate[cType] = Array(dates.length).fill(0);
//                 }
//
//                 if (cTypeObj.classification?.length) {
//                     cTypeObj.classification.forEach((classificationItem) => {
//                         const cName = classificationItem.classification_name;
//                         if (!structure[cType][cName]) {
//                             structure[cType][cName] = {};
//                         }
//
//                         if (classificationItem.regions?.length) {
//                             classificationItem.regions.forEach((regionItem) => {
//                                 const rName = regionItem.region;
//                                 if (!structure[cType][cName][rName]) {
//                                     structure[cType][cName][rName] = {};
//                                 }
//
//                                 regionItem.stores?.forEach((storeItem) => {
//                                     const sName = storeItem.store_name;
//                                     const fmStatus = storeItem.fm_status;
//
//                                     if (!structure[cType][cName][rName][sName]) {
//                                         structure[cType][cName][rName][sName] = {
//                                             values: Array(dates.length).fill(0),
//                                             fmStatus: fmStatus,
//                                         };
//                                     }
//
//                                     structure[cType][cName][rName][sName].values[dateIndex] = storeItem.net_value;
//                                 });
//                             });
//                         } else {
//                             structure[cType][cName]["flat"] = structure[cType][cName]["flat"] || [];
//
//                             structure[cType][cName]["flat"][dateIndex] = (structure[cType][cName]["flat"][dateIndex] || 0) + classificationItem.net_value;
//                         }
//                     });
//                 } else {
//                     valuesByDate[cType][dateIndex] = cTypeObj.net_value;
//                 }
//             });
//         });
//
//         Object.keys(structure).forEach((cType) => {
//             tableData.push({
//                 type: cType,
//                 indent: 0,
//                 isSubHeader: true,
//                 values: valuesByDate[cType],
//             });
//
//             Object.keys(structure[cType]).forEach((classificationName) => {
//                 tableData.push({
//                     type: classificationName,
//                     indent: 1,
//                     isSubHeader: true,
//                     values: Array(dates.length).fill(0),
//                 });
//
//                 const classificationRowIndex = tableData.length - 1;
//
//                 if (structure[cType][classificationName].flat) {
//                     structure[cType][classificationName].flat.forEach((val, idx) => {
//                         tableData[classificationRowIndex].values[idx] += val;
//                         tableData[0].values[idx] += val;
//                     });
//                 } else {
//                     Object.keys(structure[cType][classificationName]).forEach((regionName) => {
//                         if (regionName !== "flat") {
//                             tableData.push({
//                                 type: regionName,
//                                 indent: 2,
//                                 isSubHeader: true,
//                                 values: Array(dates.length).fill(0),
//                             });
//
//                             const regionRowIndex = tableData.length - 1;
//
//                             Object.keys(structure[cType][classificationName][regionName]).forEach((storeName) => {
//                                 const storeValues = structure[cType][classificationName][regionName][storeName];
//
//                                 tableData.push({
//                                     type: storeName,
//                                     indent: 3,
//                                     values: storeValues.values,
//                                     fmStatus: storeValues.fmStatus,
//                                 });
//
//                                 storeValues.values.forEach((val, idx) => {
//                                     tableData[regionRowIndex].values[idx] += val;
//                                     tableData[classificationRowIndex].values[idx] += val;
//                                     tableData[0].values[idx] += val;
//                                 });
//                             });
//                         }
//                     });
//                 }
//             });
//         });
//
//         const totalValuesByDate = dates.map((dateKey) => allData[dateKey]?.total || 0);
//         tableData.push({
//             type: "Total",
//             isHeader: true,
//             values: totalValuesByDate,
//         });
//
//         return tableData;
//     };
//
//     const tableData = prepareDataForTable(newData);
//
//
//     const formatNumber = (num) => {
//         if (typeof num !== "number") return num;
//         return num.toLocaleString();
//     };
//
//     const getRowStyle = (row) => {
//         if (row.isHeader) return "bg-gray-200 font-bold ";
//         if (row.isSubHeader) return "bg-gray-200 font-medium";
//
//         return "";
//     };
//
//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;
//
//     const dateHeaders = generateDatesArray(newData);
//
//     return (
//         <div className="bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg p-0">
//             <div className="p-4 bg-white mt-4 mb-4 rounded-lg">
//                 <div className="relative" ref={tableContainerRef} style={{height: "70vh"}}>
//
//                     <div className="overflow-auto h-full" style={{maxHeight: "calc(100% - 0px)"}}>
//                         <table className="w-full border-collapse text-sm dark:text-gray-200 dark:bg-bodybg">
//
//                             <thead className="sticky top-0 z-30">
//                             <tr style={{backgroundColor: "#0b3588", color: "white"}}>
//                                 <th className="border border-gray-700 p-2 font-bold min-w-80 sticky left-0 z-40"
//                                     style={{backgroundColor: "#0b3588", color: "white"}}>
//                                     Store Type
//                                 </th>
//                                 {dateHeaders.map((date, index) => (
//                                     <th
//                                         key={index}
//                                         className="border border-gray-700 p-2 font-normal text-center min-w-28"
//                                     >
//                                         {date}
//                                     </th>
//                                 ))}
//                                 <th className="border border-gray-900 p-2 font-bold text-center min-w-28">
//                                     Total
//                                 </th>
//                             </tr>
//                             </thead>
//                             <tbody>
//                             {tableData.map((row, rowIndex) => {
//                                 const rowTotal = row.values.reduce((acc, val) => acc + val, 0);
//                                 let leftColBgColor = "bg-white";
//
//                                 console.log(row)
//
//                                 if (row.isHeader) {
//                                     leftColBgColor = "bg-gray-200";
//                                 } else if (row.isSubHeader) {
//                                     leftColBgColor = row.indent === 0 ? "bg-gray-200" :
//                                         row.indent === 1 ? "bg-gray-200" :
//                                             row.indent === 2 ? "bg-gray-200" : "bg-gray-200";
//                                 }
//
//                                 return (
//
//
//                                     <tr key={rowIndex} className={getRowStyle(row)}>
//                                         <td
//                                             className={`border border-gray-300 p-2 sticky left-0 z-20 ${leftColBgColor} ${
//                                                 row.isHeader ? "font-bold" : row.isSubHeader ? "font-bold" : ""
//                                             }`}
//                                             style={{
//                                                 paddingLeft: row.indent ? `${row.indent}rem` : "0.5rem",
//                                             }}
//                                         >
//                                             {row.type}
//                                             {row.fmStatus === 'Flagship' ? (
//                                                 <i className="ri-vip-crown-2-fill" style={{color: "#F28B00"}}></i>
//                                             ) : ''}
//                                         </td>
//
//                                         {/*<td*/}
//                                         {/*    className={`border border-gray-300 p-2 sticky left-0 z-20 ${leftColBgColor} ${*/}
//                                         {/*        row.isHeader ? "font-bold" :*/}
//                                         {/*            row.isSubHeader ? "font-bold" : ""*/}
//                                         {/*    }`}*/}
//                                         {/*    style={{*/}
//                                         {/*        paddingLeft: row.indent ? `${row.indent}rem` : "0.5rem",*/}
//                                         {/*    }}*/}
//                                         {/*>*/}
//                                         {/*    {row.type} {row.fmStatus ?*/}
//                                         {/*    (row.fmStatus == 'Tier A' ?*/}
//                                         {/*            <i class="ri-drag-move-fill" style={{ color: "#F28B00" }}></i> : row.fmStatus == 'Tier B' ?*/}
//                                         {/*                <i class="ri-arrow-up-down-fill" style={{ color: "blue" }}></i> : row.fmStatus == 'Tier C' ?*/}
//                                         {/*                    <i class="ri-arrow-up-down-fill" style={{ color: "red" }}></i> : row.fmStatus == 'Tier D' ?*/}
//                                         {/*                        <i class="ri-arrow-up-down-fill" style={{ color: "orange" }}></i> :*/}
//                                         {/*                        <i class="ri-vip-crown-2-fill" style={{ color: "green" }}></i>*/}
//                                         {/*    )*/}
//
//                                         {/*    : ''}*/}
//                                         {/*</td>*/}
//
//                                         {row.values.map((value, valueIndex) => (
//                                             <td
//                                                 key={valueIndex}
//                                                 className="border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg"
//                                             >
//                                                 {formatNumber(value)}
//                                             </td>
//                                         ))}
//
//                                         <td className="border border-gray-300 p-2 text-right font-bold dark:text-gray-200 dark:bg-bodybg"
//                                             style={{backgroundColor: "rgb(37 73 177 / 85%)", color: "white"}}>
//                                             {formatNumber(rowTotal)}
//                                         </td>
//                                     </tr>
//
//                                 );
//                             })}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//                 <div className="mt-4 text-xs text-danger text-left ml-4 font-bold">
//                     <p>*Omni Added in E-Store and Excluded from B&M.
//                     </p>
//                 </div>
//
//             </div>
//         </div>
//             );
//             };
//
//             export default StoreWise;


import React, { useEffect, useState, useRef } from "react";
import { fetchStoreWiseSaleData } from "@modules/DailyReport/services/wiseside_services.js";

const StoreWise = ({ filters }) => {
    const [newData, setNewData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const tableContainerRef = useRef(null);
    const [tableData, setTableData] = useState([]);
    const [expandedSections, setExpandedSections] = useState({});

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

    useEffect(() => {
        if (Object.keys(newData).length > 0) {
            const data = prepareDataForTable(newData);
            setTableData(data);

            // Initial expanded sections
            const initialExpanded = {};

            // Find Offline section
            const offlineRow = data.find(row => row.type === "Offline");
            if (offlineRow) {
                initialExpanded[offlineRow.id] = true;

                // Find A-Class under Offline
                const aClassRow = data.find(row =>
                    row.parentId === offlineRow.id &&
                    row.type === "A-Class"
                );

                if (aClassRow) {
                    initialExpanded[aClassRow.id] = true;

                    // Find Central region under A-Class
                    const centralRow = data.find(row =>
                        row.parentId === aClassRow.id &&
                        (row.type === "Central" || row.type === "Center")
                    );

                    if (centralRow) {
                        initialExpanded[centralRow.id] = true;
                        console.log("Expanded Central section:", centralRow.id);
                    }
                }
            }

            setExpandedSections(initialExpanded);
        }
    }, [newData]);

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
                                    const fmStatus = storeItem.fm_status;

                                    if (!structure[cType][cName][rName][sName]) {
                                        structure[cType][cName][rName][sName] = {
                                            values: Array(dates.length).fill(0),
                                            fmStatus: fmStatus,
                                        };
                                    }

                                    structure[cType][cName][rName][sName].values[dateIndex] = storeItem.net_value;
                                });
                            });
                        } else {
                            structure[cType][cName]["flat"] = structure[cType][cName]["flat"] || [];

                            structure[cType][cName]["flat"][dateIndex] = (structure[cType][cName]["flat"][dateIndex] || 0) + classificationItem.net_value;
                        }
                    });
                } else {
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
                id: `ctype-${cType}`,
                parentId: null,
                hasChildren: true
            });


            Object.keys(structure[cType]).forEach((classificationName) => {
                tableData.push({
                    type: classificationName,
                    indent: 1,
                    isSubHeader: true,
                    values: Array(dates.length).fill(0),
                    id: `classification-${cType}-${classificationName}`,
                    parentId: `ctype-${cType}`,
                    hasChildren: true
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
                                id: `region-${cType}-${classificationName}-${regionName}`,
                                parentId: `classification-${cType}-${classificationName}`,
                                hasChildren: true
                            });

                            const regionRowIndex = tableData.length - 1;


                            Object.keys(structure[cType][classificationName][regionName]).forEach((storeName) => {
                                const storeValues = structure[cType][classificationName][regionName][storeName];

                                tableData.push({
                                    type: storeName,
                                    indent: 3,
                                    values: storeValues.values,
                                    fmStatus: storeValues.fmStatus,
                                    id: `store-${cType}-${classificationName}-${regionName}-${storeName}`,
                                    parentId: `region-${cType}-${classificationName}-${regionName}`,
                                    hasChildren: false
                                });

                                storeValues.values.forEach((val, idx) => {
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
            id: "total",
            parentId: null,
            hasChildren: false
        });

        return tableData;
    };

    const toggleSection = (id) => {
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const isVisible = (row) => {
        if (row.parentId === null) {
            return true;
        }

        if (!expandedSections[row.parentId]) {
            return false;
        }

        const parent = tableData.find(r => r.id === row.parentId);
        if (parent && parent.parentId !== null) {
            return isVisible(parent);
        }

        return true;
    };

    const formatNumber = (num) => {
        if (typeof num !== "number") return num;
        return num.toLocaleString();
    };

    const getRowStyle = (row) => {
        if (row.isHeader) return "bg-gray-200 font-bold ";
        if (row.isSubHeader) return "bg-gray-200 font-medium";
        return "";
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const dateHeaders = generateDatesArray(newData);

    return (
        <div className="bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg p-0">
            <div className="p-4 bg-white mt-4 mb-4 rounded-lg">
                <div className="relative" ref={tableContainerRef} style={{height: "70vh"}}>
                    <div className="overflow-auto h-full" style={{maxHeight: "calc(100% - 0px)"}}>
                        <table className="w-full border-collapse text-sm dark:text-gray-200 dark:bg-bodybg">
                            <thead className="sticky top-0 z-30">
                            <tr style={{backgroundColor: "#0b3588", color: "white"}}>
                                <th className="border border-gray-700 p-2 font-bold min-w-80 sticky left-0 z-40"
                                    style={{backgroundColor: "#0b3588", color: "white"}}>
                                    Store Type
                                </th>
                                {dateHeaders.map((date, index) => (
                                    <th
                                        key={index}
                                        className="border border-gray-700 p-2 font-normal text-center min-w-28"
                                    >
                                        {date}
                                    </th>
                                ))}
                                <th className="border border-gray-900 p-2 font-bold text-center min-w-28">
                                    Total
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {tableData.map((row, rowIndex) => {
                                if (!isVisible(row)) return null;

                                const rowTotal = row.values.reduce((acc, val) => acc + val, 0);
                                let leftColBgColor = "bg-white";

                                if (row.isHeader) {
                                    leftColBgColor = "bg-gray-200";
                                } else if (row.isSubHeader) {
                                    leftColBgColor = row.indent === 0 ? "bg-gray-200" :
                                        row.indent === 1 ? "bg-gray-200" :
                                            row.indent === 2 ? "bg-gray-200" : "bg-gray-200";
                                }

                                return (
                                    <tr key={rowIndex} className={getRowStyle(row)}>
                                        <td
                                            className={`border border-gray-300 p-2 sticky left-0 z-20 ${leftColBgColor} ${
                                                row.isHeader ? "font-bold" : row.isSubHeader ? "font-bold" : ""
                                            } ${row.hasChildren ? "cursor-pointer" : ""}`}
                                            style={{
                                                paddingLeft: row.indent ? `${row.indent}rem` : "0.5rem",
                                            }}
                                            onClick={() => row.hasChildren && toggleSection(row.id)}
                                        >
                                            {row.hasChildren && (
                                                <span className="mr-2">
                                                        {expandedSections[row.id] ? "▼" : "►"}
                                                    </span>
                                            )}
                                            {row.type}
                                            {row.fmStatus === 'Flagship' && (
                                                <i className="ri-vip-crown-2-fill ml-1" style={{color: "#F28B00"}}></i>
                                            )}
                                        </td>

                                        {row.values.map((value, valueIndex) => (
                                            <td
                                                key={valueIndex}
                                                className="border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg"
                                            >
                                                {formatNumber(value)}
                                            </td>
                                        ))}

                                        <td className="border border-gray-300 p-2 text-right font-bold dark:text-gray-200 dark:bg-bodybg"
                                            style={{backgroundColor: "rgb(37 73 177 / 85%)", color: "white"}}>
                                            {formatNumber(rowTotal)}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-4 text-xs text-danger text-left ml-4 font-bold">
                    <p>*Omni Added in E-Store and Excluded from B&M.</p>
                </div>
            </div>
        </div>
    );
};

export default StoreWise;