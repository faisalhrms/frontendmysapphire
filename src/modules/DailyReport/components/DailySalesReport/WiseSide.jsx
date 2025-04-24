// import React, { useEffect, useState, useRef } from "react";
// import { fetchStoreWiseSaleData } from "@modules/DailyReport/services/wiseside_services.js";
//
// const StoreWise = ({ filters , newData , error , loading , expand  }) => {
//
//     const tableContainerRef = useRef(null);
//     const [tableData, setTableData] = useState([]);
//     const [expandedSections, setExpandedSections] = useState({});
//
//     const formatNumberWithCommas = (num) => {
//         if (num === 0 || num == null) return "-";
//         return num.toLocaleString();
//     };
//
//
//     const toggleSection = (id) => {
//         console.log(id);
//         setExpandedSections(prev => ({
//             ...prev,
//             [id]: !prev[id]
//         }));
//     };
//
//     useEffect(()=>{
//         toggleSection('ctype-Offline')
//     },[expand])
//
//
//     useEffect(() => {
//         if (Object.keys(newData).length > 0) {
//             const data = prepareDataForTable(newData);
//             setTableData(data);
//
//             // Initial expanded sections
//             const initialExpanded = {};
//
//             // Find "FOL" section and expand it by default
//             const folRow = data.find(row => row.type === "FOL");
//             if (folRow) {
//                 initialExpanded[folRow.id] = true;
//
//                 // Find sub-sections under "FOL" and expand them
//                 const folSubSections = data.filter(row => row.parentId === folRow.id && row.type === "FOL");
//                 folSubSections.forEach(subSection => {
//                     initialExpanded[subSection.id] = true;  // Expand all sub-sections under "FOL"
//                 });
//             }
//
//             // Find "Offline" section and expand it by default
//             const offlineRow = data.find(row => row.type === "Offline");
//             if (offlineRow) {
//                 initialExpanded[offlineRow.id] = true;
//
//                 // Find "A-Class" under "Offline" and expand it by default
//                 const aClassRow = data.find(row => row.parentId === offlineRow.id && row.type === "A-Class");
//                 if (aClassRow) {
//                     initialExpanded[aClassRow.id] = true;
//
//                     // Expand "Center", "North", and "South" regions under "A-Class"
//                     const centerRow = data.find(row => row.parentId === aClassRow.id && (row.type === "Center" || row.type === "Central"));
//                     const northRow = data.find(row => row.parentId === aClassRow.id && row.type === "North");
//                     const southRow = data.find(row => row.parentId === aClassRow.id && row.type === "South");
//
//                     if (centerRow) initialExpanded[centerRow.id] = true;
//                     if (northRow) initialExpanded[northRow.id] = true;
//                     if (southRow) initialExpanded[southRow.id] = true;
//                 }
//             }
//             setExpandedSections(initialExpanded);
//         }
//     }, [newData]);
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
//                 id: `ctype-${cType}`,
//                 parentId: null,
//                 hasChildren: true
//             });
//
//             Object.keys(structure[cType]).forEach((classificationName) => {
//                 tableData.push({
//                     type: classificationName,
//                     indent: 1,
//                     isSubHeader: true,
//                     values: Array(dates.length).fill(0),
//                     id: `classification-${cType}-${classificationName}`,
//                     parentId: `ctype-${cType}`,
//                     hasChildren: true
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
//
//                     Object.keys(structure[cType][classificationName]).forEach((regionName) => {
//                         if (regionName !== "flat") {
//                             tableData.push({
//                                 type: regionName,
//                                 indent: 2,
//                                 isSubHeader: true,
//                                 values: Array(dates.length).fill(0),
//                                 id: `region-${cType}-${classificationName}-${regionName}`,
//                                 parentId: `classification-${cType}-${classificationName}`,
//                                 hasChildren: true
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
//                                     id: `store-${cType}-${classificationName}-${regionName}-${storeName}`,
//                                     parentId: `region-${cType}-${classificationName}-${regionName}`,
//                                     hasChildren: false
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
//             id: "total",
//             parentId: null,
//             hasChildren: false
//         });
//
//         return tableData;
//     };
//
//
//
//
//
//     const isVisible = (row) => {
//         if (row.parentId === null) {
//             return true;
//         }
//
//         if (!expandedSections[row.parentId]) {
//             return false;
//         }
//
//         const parent = tableData.find(r => r.id === row.parentId);
//         if (parent && parent.parentId !== null) {
//             return isVisible(parent);
//         }
//
//         return true;
//     };
//
//     const formatNumber = (num) => {
//         if (typeof num !== "number") return num;
//         return num.toLocaleString();
//     };
//
//     const getRowStyle = (row) => {
//         if (row.isHeader) return "bg-gray-200 font-bold dark:text-gray-200 dark:bg-bodybg ";
//         if (row.isSubHeader) return "bg-gray-200 font-medium";
//         return "";
//     };
//
//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;
//
//     const dateHeaders = generateDatesArray(newData);
//
//     return (
//         <div className="bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg p-0 ">
//             <div className="p-4 bg-white mt-4 mb-4 rounded-lg dark:text-gray-200 dark:bg-bodybg">
//                 <div className="relative" ref={tableContainerRef} style={{height: "70vh"}}>
//                     <div className="overflow-auto h-full" style={{maxHeight: "calc(100% - 0px)"}}>
//                         <table className="w-full border-collapse text-sm dark:text-gray-200 dark:bg-bodybg">
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
//                                 if (!isVisible(row)) return null;
//
//                                 const rowTotal = row.values.reduce((acc, val) => acc + val, 0);
//                                 let leftColBgColor = "bg-white";
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
//                                     <tr key={rowIndex} className={getRowStyle(row)}>
//                                         <td
//                                             className={`border border-gray-300 p-2 sticky left-0 z-20 dark:text-gray-200 dark:bg-bodybg ${leftColBgColor} ${
//                                                 row.isHeader ? "font-bold" : row.isSubHeader ? "font-bold" : ""
//                                             } ${row.hasChildren ? "cursor-pointer" : ""}`}
//                                             style={{
//                                                 paddingLeft: row.indent ? `${row.indent}rem` : "0.5rem",
//                                             }}
//                                             onClick={() => row.hasChildren && toggleSection(row.id)}
//                                         >
//                                             {row.hasChildren && (
//                                                 <span className="mr-2">
//                                                         {expandedSections[row.id] ? "▼" : "►"}
//                                                     </span>
//                                             )}
//                                             {row.type}
//                                             {row.fmStatus === 'Flagship' && (
//                                                 <i className="ri-vip-crown-2-fill ml-1" style={{color: "#F28B00"}}></i>
//                                             )}
//                                         </td>
//
//                                         {row.values.map((value, valueIndex) => (
//                                             <td
//                                                 key={valueIndex}
//                                                 className="border border-gray-300 p-2 text-right dark:text-gray-200 dark:bg-bodybg"
//                                             >
//                                                 {formatNumberWithCommas(value)}
//                                             </td>
//                                         ))}
//
//                                         <td className="border border-gray-300 p-2 text-right font-bold dark:text-gray-200 dark:bg-bodybg"
//                                             style={{backgroundColor: "rgb(37 73 177 / 85%)", color: "white"}}>
//                                             {formatNumberWithCommas(rowTotal)}
//                                         </td>
//                                     </tr>
//                                 );
//                             })}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//                 <div className="mt-4 text-xs text-danger text-left ml-4 font-bold">
//                     <p>*Omni Added in E-Store and Excluded from B&M.</p>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default StoreWise;
import React, { useEffect, useState, useRef } from "react";
import { fetchStoreWiseSaleData } from "@modules/DailyReport/services/wiseside_services.js";

const StoreWise = ({ filters , newData , error , loading , expand  }) => {

    const tableContainerRef = useRef(null);
    const [tableData, setTableData] = useState([]);
    const [expandedSections, setExpandedSections] = useState({});

    const formatNumberWithCommas = (num) => {
        if (num === 0 || num == null) return "-";
        return num.toLocaleString();
    };


    const toggleSection = (id) => {
        console.log(id);
        setExpandedSections(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    useEffect(()=>{
        toggleSection('ctype-Offline')
    },[expand])


    useEffect(() => {
        if (Object.keys(newData).length > 0) {
            const data = prepareDataForTable(newData);
            setTableData(data);

            // Initial expanded sections
            const initialExpanded = {};

            // Find "FOL" section and expand it by default
            const folRow = data.find(row => row.type === "FOL");
            if (folRow) {
                initialExpanded[folRow.id] = true;

                // Find sub-sections under "FOL" and expand them
                const folSubSections = data.filter(row => row.parentId === folRow.id && row.type === "FOL");
                folSubSections.forEach(subSection => {
                    initialExpanded[subSection.id] = true;  // Expand all sub-sections under "FOL"
                });
            }

            // Find "Offline" section and expand it by default
            const offlineRow = data.find(row => row.type === "Offline");
            if (offlineRow) {
                initialExpanded[offlineRow.id] = true;

                // Find "A-Class" under "Offline" and expand it by default
                const aClassRow = data.find(row => row.parentId === offlineRow.id && row.type === "A-Class");
                if (aClassRow) {
                    initialExpanded[aClassRow.id] = true;

                    // Expand "Center", "North", and "South" regions under "A-Class"
                    const centerRow = data.find(row => row.parentId === aClassRow.id && (row.type === "Center" || row.type === "Central"));
                    const northRow = data.find(row => row.parentId === aClassRow.id && row.type === "North");
                    const southRow = data.find(row => row.parentId === aClassRow.id && row.type === "South");

                    if (centerRow) initialExpanded[centerRow.id] = true;
                    if (northRow) initialExpanded[northRow.id] = true;
                    if (southRow) initialExpanded[southRow.id] = true;
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
        if (row.isHeader) return "bg-gray-200 font-bold dark:text-gray-200 dark:bg-bodybg ";
        if (row.isSubHeader) return "bg-gray-200 font-medium";
        return "";
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const dateHeaders = generateDatesArray(newData);

    return (
        <div className="bg-white mt-4 mb-4 rounded-lg shadow-md dark:text-gray-200 dark:bg-bodybg p-0 ">
            <div className="p-2 sm:p-4 bg-white rounded-lg dark:text-gray-200 dark:bg-bodybg">
                <div className="relative" ref={tableContainerRef} style={{height: "70vh"}}>
                    <div className="overflow-auto h-full" style={{maxHeight: "calc(100% - 0px)"}}>
                        <table className="w-full border-collapse text-sm dark:text-gray-200 dark:bg-bodybg min-w-max">
                            <thead className="sticky top-0 z-30">
                            <tr style={{backgroundColor: "#0b3588", color: "white"}}>
                                <th className="border border-gray-700 p-2 font-bold min-w-60 sticky left-0 z-40 bg-[#0b3588] text-white"
                                    style={{backgroundColor: "#0b3588", color: "white"}}>
                                    Store Type
                                </th>
                                {dateHeaders.map((date, index) => (
                                    <th
                                        key={index}
                                        className="border border-gray-700 p-2 font-normal text-center min-w-28 bg-[#0b3588] text-white"
                                    >
                                        {date}
                                    </th>
                                ))}
                                <th className="border border-gray-900 p-2 font-bold text-center min-w-28 bg-[#0b3588] text-white">
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
                                            className={`border border-gray-300 p-2 sticky left-0 z-20 dark:text-gray-200 dark:bg-bodybg ${leftColBgColor} ${
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
                                                {formatNumberWithCommas(value)}
                                            </td>
                                        ))}

                                        <td className="border border-gray-300 p-2 text-right font-bold dark:text-gray-200 dark:bg-bodybg"
                                            style={{backgroundColor: "rgb(37 73 177 / 85%)", color: "white"}}>
                                            {formatNumberWithCommas(rowTotal)}
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
