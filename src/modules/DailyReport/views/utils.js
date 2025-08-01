export const prepareDataForTable = (allData) => {
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



const getMonthName = (monthNumber) => {
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return months[parseInt(monthNumber, 10) - 1];
};

export const generateDatesArray = (rawData) => {
    return Object.keys(rawData)
        .filter((dateKey) => dateKey !== "Total")
        .map((dateKey) => {
            const [year, month, day] = dateKey.split("-");
            return `${day.padStart(2, "0")}-${getMonthName(month)}-${year}`;
        });
};

// comparative sale report



const getComparativeReportDates = () => {
    const date = new Date();

    const yesterday = new Date(date);
    yesterday.setDate(date.getDate() - 1);
    const today = yesterday.toISOString().split('T')[0];

    const formattedStartOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    formattedStartOfMonth.setHours(0, 0, 0, 0);
    const startOfMonth = formattedStartOfMonth.toLocaleDateString('en-CA');

    const prevYearYesterday = new Date(date);
    prevYearYesterday.setFullYear(date.getFullYear() - 1);
    prevYearYesterday.setDate(date.getDate() - 1);
    const formattedPrevYearYesterday = prevYearYesterday.toISOString().split('T')[0];

    const prevYearStartOfMonth = new Date(date.getFullYear() - 1, date.getMonth(), 1);
    prevYearStartOfMonth.setHours(0, 0, 0, 0);
    const startOfPrevYear = prevYearStartOfMonth.toLocaleDateString('en-CA');

    return {
        today,
        startOfMonth,
        formattedPrevYearYesterday,
        startOfPrevYear
    };
};

export default getComparativeReportDates;


// utils.js

/**
 * Returns dynamic comparative report date ranges based on today's date.
 * - On the 1st of any month: CY is previous month full range, LY is same previous month last year
 * - Otherwise: CY is from 1st of current month to yesterday, LY is same for previous year
 *
 * @returns {{ cy_from: string, cy_to: string, ly_from: string, ly_to: string }}
 */export function getDynamicComparativeReportsDates() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-based (0=Jan, 1=Feb, ..., 7=Aug)
    const day = today.getDate();

    let cyFrom, cyTo;
    let lyFrom, lyTo;

    if (day === 1) {
        // Full previous month
        const prevMonth = (month + 11) % 12;
        const prevYear = month === 0 ? year - 1 : year;

        cyFrom = new Date(prevYear, prevMonth, 1);
        cyTo = new Date(prevYear, prevMonth + 1, 0);

        lyFrom = new Date(prevYear - 1, prevMonth, 1);
        lyTo = new Date(prevYear - 1, prevMonth + 1, 0);
    } else {
        // From 1st of current month to yesterday
        cyFrom = new Date(year, month, 1);
        cyTo = new Date(year, month, day - 1);

        // Same period last year
        lyFrom = new Date(year - 1, month, 1);
        lyTo = new Date(year - 1, month, day - 1);
    }

    // Format date as YYYY-MM-DD without timezone shifts
    function fmt(dateObj) {
        const y = dateObj.getFullYear();
        const m = String(dateObj.getMonth() + 1).padStart(2, '0');
        const d = String(dateObj.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    return {
        cy_from: fmt(cyFrom),
        cy_to: fmt(cyTo),
        ly_from: fmt(lyFrom),
        ly_to: fmt(lyTo),
    };
}


