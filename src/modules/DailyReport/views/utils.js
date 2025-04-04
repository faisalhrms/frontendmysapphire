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