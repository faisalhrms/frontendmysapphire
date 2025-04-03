import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatNumberWithCommas } from "@helpers/formatters.js";
import {generateDatesArray, prepareDataForTable} from "@modules/DailyReport/views/utils.js";

const downloadPDF = (items,filters , one , two , three , four , five , six) => {
    const doc = new jsPDF("landscape");
    // Format numbers with commas for thousands
    const formatNumber = (num) => new Intl.NumberFormat().format(num);

    const pageWidth = doc.internal.pageSize.getWidth();

    const table1 = {
        "data": [
            {
                "Date": "1",
                "Day": "Sat",
                "StoreType": "Offline",
                "FullPriceOfflineCY": 153797855,
                "FullPriceOfflineLY": 0,
                "FullPriceOfflineGrowth": 0,
                "DiscountedOfflineCY": 15530175,
                "DiscountedOfflineLY": 0,
                "DiscountedOfflineGrowth": 0,
                "TotalOfflineCY": 169328030,
                "TotalOfflineLY": 0,
                "TotalOfflineGrowth": 0,
                "FullPriceOnlineCY": 33665706,
                "FullPriceOnlineLY": 0,
                "FullPriceOnlineGrowth": 0,
                "DiscountedOnlineCY": 2711894,
                "DiscountedOnlineLY": 0,
                "DiscountedOnlineGrowth": 0,
                "TotalOnlineCY": 36377600,
                "TotalOnlineLY": 0,
                "TotalOnlineGrowth": 0,
                "TotalCY": 205705630,
                "TotalLY": 0,
                "TotalGrowth": 0
            },
            {
                "Date": "2",
                "Day": "Sun",
                "StoreType": "Offline",
                "FullPriceOfflineCY": 60968924,
                "FullPriceOfflineLY": 0,
                "FullPriceOfflineGrowth": 0,
                "DiscountedOfflineCY": 6477752,
                "DiscountedOfflineLY": 0,
                "DiscountedOfflineGrowth": 0,
                "TotalOfflineCY": 67446676,
                "TotalOfflineLY": 0,
                "TotalOfflineGrowth": 0,
                "FullPriceOnlineCY": 9594869,
                "FullPriceOnlineLY": 0,
                "FullPriceOnlineGrowth": 0,
                "DiscountedOnlineCY": 1550895,
                "DiscountedOnlineLY": 0,
                "DiscountedOnlineGrowth": 0,
                "TotalOnlineCY": 11145764,
                "TotalOnlineLY": 0,
                "TotalOnlineGrowth": 0,
                "TotalCY": 78592440,
                "TotalLY": 0,
                "TotalGrowth": 0
            }
        ],
        "totalsAch": {
            "FullPriceOfflineAch": 0,
            "DiscountedOfflineAch": 0,
            "TotalOfflineAch": 0,
            "FullPriceOnlineAch": 0,
            "DiscountedOnlineAch": 0,
            "TotalOnlineAch": 0,
            "TotalAch": 0
        },
        "totals": {
            "FullPriceOfflineCY": 214766779,
            "FullPriceOfflineLY": 0,
            "DiscountedOfflineCY": 22007927,
            "DiscountedOfflineLY": 0,
            "TotalOfflineCY": 236774706,
            "TotalOfflineLY": 0,
            "FullPriceOnlineCY": 43260575,
            "FullPriceOnlineLY": 0,
            "DiscountedOnlineCY": 4262789,
            "DiscountedOnlineLY": 0,
            "TotalOnlineCY": 47523364,
            "TotalOnlineLY": 0,
            "TotalCY": 284298070,
            "TotalLY": 0
        }
    }

    const table2 = prepareDataForTable(one)
    const table2Header = generateDatesArray(one)



/// Store Wise
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Store Wise", 8, 20);
    doc.setFontSize(12);
    doc.text(
        `DATE: ${filters?.date_from}`,
        pageWidth - 30,
        20,
        { align: "right" }
    );
    doc.setFont("helvetica", "normal");


    const buildRows = (data, indentLevel = 0) => {
        return data.map((row) => {
            const rowTotal = row.values.reduce((acc, val) => acc + val, 0);

            // Set background color based on header or subheader
            let leftColBgColor = row.isHeader || row.isSubHeader ? [200, 200, 200] : [255, 255, 255];

            // Create the row for the current item
            const currentRow = [
                {
                    content: `${"  ".repeat(indentLevel)}${row.type}`,
                    colSpan: indentLevel === 0 ? 1 : 0, // If it's a subheader, it spans multiple columns
                    styles: {
                        fontStyle: row.isHeader || row.isSubHeader ? "bold" : "normal",
                        halign: "left",
                        fillColor: leftColBgColor,
                    },
                },
                ...row.values.map((value) => ({
                    content: formatNumber(value),
                    styles: { halign: "right" },
                })),
                {
                    content: formatNumber(rowTotal),
                    styles: { halign: "right", fontStyle: "bold", fillColor: [37, 73, 177] },
                },
            ];

            // If the row has children (sub-rows), recursively add them
            if (row.hasChildren) {
                return [
                    ...currentRow,
                    ...buildRows(row.children || [], indentLevel + 1), // Recursively call for children
                ];
            }

            return currentRow;
        });
    };

    // Build all rows from the table data
    const rows = buildRows(table2);


    // Table create (CY Vs LY Growth)
    autoTable(doc, {
        startY: 30,
        margin: { left: 2, right: 2 },
        theme: "grid",
        headStyles: {
            fontSize: 7,
            textColor: "white",
            fillColor: [11, 53, 136],
            halign: "center",
            lineWidth: 0.5,
            lineColor: "#000000",
        },
        bodyStyles: {
            fontSize: 6,
            textColor: "#000000",
            lineColor: "#000",
            lineWidth: 0.5,
            valign: "middle",
        },
        alternateRowStyles: {
            fillColor: [250, 250, 250],
        },
        styles: {
            cellPadding: 2,
            font: "helvetica",
            overflow: "linebreak",
            lineWidth: 0.5,
            lineColor: "#000",
        },

        head: [
            ["Store Type", ...table2Header, "Totals"], // Dynamically add the dates from table2Header
        ],
        body: rows,

    });


    ///////
    var finalY = doc.lastAutoTable.finalY;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Daily Target Achievement", 8, finalY+20);
    doc.setFontSize(12);
    doc.text(
        `DATE: ${filters?.date_from}`,
        pageWidth - 30,
        finalY+20,
        { align: "right" }
    );
    doc.setFont("helvetica", "normal");


    // Table create (CY Vs LY Growth)
    autoTable(doc, {
        startY: finalY+30,
        margin: { left: 2, right: 2 },
        theme: "grid",
        headStyles: {
            fontSize: 7,
            textColor: "white",
            fillColor: [11, 53, 136],
            halign: "center",
            lineWidth: 0.5,
            lineColor: "#000000",
        },
        bodyStyles: {
            fontSize: 6,
            textColor: "#000000",
            lineColor: "#000",
            lineWidth: 0.5,
            valign: "middle",
        },
        alternateRowStyles: {
            fillColor: [250, 250, 250],
        },
        styles: {
            cellPadding: 2,
            font: "helvetica",
            overflow: "linebreak",
            lineWidth: 0.5,
            lineColor: "#000",
        },

        head: [
            ["","Store Type", { content: "Offline", colSpan: 9 },{ content: "Online", colSpan:9} ,{ content: "Total", colSpan:3 } ],
            ["","", { content: "Full Price", colSpan: 3 },{ content: "Discount", colSpan:3} ,{ content: "Total", colSpan:3 },{ content: "Full Price", colSpan: 3 },{ content: "Discount", colSpan:3} ,{ content: "Total", colSpan:3 } , {content:"",colSpan:3} ],
            [
                "Date",
                "Day",
                "Target",
                "Actual Sale",
                "Ach%",
                "Target",
                "Actual Sale",
                "Ach%",
                "Target",
                "Actual Sale",
                "Ach%",
                "Target",
                "Actual Sale",
                "Ach%",
                "Target",
                "Actual Sale",
                "Ach%",
                "Target",
                "Actual Sale",
                "Ach%",
                "Target",
                "Actual Sale",
                "Ach%",
            ],
        ],
        body: two.map((item, index) => {
            return [
                { content: item?.date },
                { content: item?.day },

                // Offline Full Price Columns
                { content: formatNumberWithCommas(item?.fullPriceOfflineTarget) },
                { content: formatNumberWithCommas(item?.fullPriceOfflineSale) },
                { content: item?.fullPriceOfflineAch },

                // Offline Discount Columns
                { content: formatNumberWithCommas(item?.discountedOfflineTarget) },
                { content: formatNumberWithCommas(item?.discountedOfflineSale) },
                { content: item?.discountedOfflineAch },

                // Offline Total Columns
                { content: formatNumberWithCommas(item?.totalOfflineTarget) },
                { content: formatNumberWithCommas(item?.totalOfflineSale) },
                { content: item?.totalOfflineAch },

                // Online Full Price Columns
                { content: formatNumberWithCommas(item?.fullPriceOnlineTarget) },
                { content: formatNumberWithCommas(item?.fullPriceOnlineSale) },
                { content: item?.fullPriceOnlineAch },

                // Online Discount Columns
                { content: formatNumberWithCommas(item?.discountedOnlineTarget) },
                { content: formatNumberWithCommas(item?.discountedOnlineSale) },
                { content: item?.discountedOnlineAch },

                // Online Total Columns
                { content: formatNumberWithCommas(item?.totalOnlineTarget) },
                { content: formatNumberWithCommas(item?.totalOnlineSale) },
                { content: item?.totalOnlineAch },

                // Total Target, Sale and Ach% Columns
                { content: formatNumberWithCommas(item?.totalTarget) },
                { content: formatNumberWithCommas(item?.totalSale) },
                { content: item?.totalAch },
            ];
        }),
    });



    ///////
    var finalY = doc.lastAutoTable.finalY;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CV vs LY Growth", 8, finalY+20);
    doc.setFontSize(12);
    doc.text(
        `DATE: ${filters?.date_from}`,
        pageWidth - 30,
        finalY+20,
        { align: "right" }
    );
    doc.setFont("helvetica", "normal");


    // Table create (CY Vs LY Growth)
    autoTable(doc, {
        startY: finalY+30,
        margin: { left: 2, right: 2 },
        theme: "grid",
        headStyles: {
            fontSize: 7,
            textColor: "white",
            fillColor: [11, 53, 136],
            halign: "center",
            lineWidth: 0.5,
            lineColor: "#000000",
        },
        bodyStyles: {
            fontSize: 6,
            textColor: "#000000",
            lineColor: "#000",
            lineWidth: 0.5,
            valign: "middle",
        },
        alternateRowStyles: {
            fillColor: [250, 250, 250],
        },
        styles: {
            cellPadding: 2,
            font: "helvetica",
            overflow: "linebreak",
            lineWidth: 0.5,
            lineColor: "#000",
        },

        head: [
            ["","Store Type", { content: "Offline", colSpan: 9 },{ content: "Online", colSpan:9} ,{ content: "Total", colSpan:3 } ],
            ["","", { content: "Full Price", colSpan: 3 },{ content: "Discount", colSpan:3} ,{ content: "Total", colSpan:3 },{ content: "Full Price", colSpan: 3 },{ content: "Discount", colSpan:3} ,{ content: "Total", colSpan:3 } , {content:"",colSpan:3} ],
            [
                "Date",
                "Day",
                "CY",
                "LY",
                "Growth%",
                "CY",
                "LY",
                "Growth%",
                "CY",
                "LY",
                "Growth%",
                "CY",
                "LY",
                "Growth%",
                "CY",
                "LY",
                "Growth%",
                "CY",
                "LY",
                "Growth%",
                "CY",
                "LY",
                "Growth%",
            ],
        ],
        body: three?.map((item, index) => {

            return [
                {
                    content: item?.Date,
                },
                {
                    content: item?.Day,
                },
                {
                    content: formatNumberWithCommas(item?.FullPriceOfflineCY),
                },
                {
                    content: formatNumberWithCommas(item?.FullPriceOfflineLY),
                },
                {
                    content: item?.FullPriceOfflineGrowth,
                },                {
                    content: formatNumberWithCommas(item?.DiscountedOfflineCY),
                },
                {
                    content: formatNumberWithCommas(item?.DiscountedOfflineLY),
                },
                {
                    content: item?.DiscountedOfflineGrowth,
                },
                {
                    content: formatNumberWithCommas(item?.TotalOfflineCY),
                },
                {
                    content: formatNumberWithCommas(item?.TotalOfflineLY),
                },
                {
                    content: item?.TotalOfflineGrowth,
                },
                {
                    content: formatNumberWithCommas(item?.FullPriceOnlineCY),
                },
                {
                    content: formatNumberWithCommas(item?.FullPriceOnlineLY),
                },
                {
                    content: item?.FullPriceOnlineGrowth,
                },
                {
                    content: formatNumberWithCommas(item?.DiscountedOnlineCY),
                },                {
                    content: formatNumberWithCommas(item?.DiscountedOnlineLY),
                },
                {
                    content: item?.DiscountedOnlineGrowth,
                },
                {
                    content: formatNumberWithCommas(item?.TotalOnlineCY),
                },
                {
                    content: formatNumberWithCommas(item?.TotalOnlineLY),
                },
                {
                    content: item?.TotalOnlineGrowth,
                },
                {
                    content: formatNumberWithCommas(item?.TotalCY),
                },                {
                    content: formatNumberWithCommas(item?.TotalLY),
                },
                {
                    content: item?.TotalGrowth,
                },

            ];
        }),
    });


    ///////
    var finalY = doc.lastAutoTable.finalY;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Online (Gross Sale before Return)", 8, finalY+20);
    doc.setFontSize(12);
    doc.text(
        `DATE: ${filters?.date_from}`,
        pageWidth - 30,
        finalY+20,
        { align: "right" }
    );
    doc.setFont("helvetica", "normal");


    // Table create (CY Vs LY Growth)
    autoTable(doc, {
        startY: finalY+30,
        margin: { left: 2, right: 2 },
        theme: "grid",
        headStyles: {
            fontSize: 7,
            textColor: "white",
            fillColor: [11, 53, 136],
            halign: "center",
            lineWidth: 0.5,
            lineColor: "#000000",
        },
        bodyStyles: {
            fontSize: 6,
            textColor: "#000000",
            lineColor: "#000",
            lineWidth: 0.5,
            valign: "middle",
        },
        alternateRowStyles: {
            fillColor: [250, 250, 250],
        },
        styles: {
            cellPadding: 2,
            font: "helvetica",
            overflow: "linebreak",
            lineWidth: 0.5,
            lineColor: "#000",
        },

        head: [

            ["Date","Day", "Full Price","Discount" ,"Total" ],
        ],
        body: four?.map((item, index) => {

            return [
                {
                    content: item?.date,
                },
                {
                    content: item?.day,
                },
                {
                    content: formatNumberWithCommas(item?.full_price),
                },
                {
                    content: formatNumberWithCommas(item?.discounted),
                },
                {
                    content: formatNumberWithCommas(item?.total)
                    ,
                },

            ];
        }),
    });




    ///////
    var finalY = doc.lastAutoTable.finalY;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Daily Sales Report - Store Wise", 8, finalY+20);
    doc.setFontSize(12);
    doc.text(
        `DATE: ${filters?.date_from}`,
        pageWidth - 30,
        finalY+20,
        { align: "right" }
    );

    doc.text("Last Day", 8, finalY+25);
    doc.setFont("helvetica", "normal");




    const mapData = (data) => {
        const tableRows = data?.classifications?.map((classification) => {
            // Start with the classification row
            const classificationRow = [
                { content: classification.classification_name },
                { content: formatNumberWithCommas(classification.fullprice_sale_qty) },
                { content: formatNumberWithCommas(classification.fullprice_sale_value) },
                { content: formatNumberWithCommas(classification.discounted_sale_qty) },
                { content: formatNumberWithCommas(classification.discounted_sale_value) },
                { content: formatNumberWithCommas(classification.total_sale_qty) },
                { content: formatNumberWithCommas(classification.total_sale_value) },
            ];

            // If regions exist for this classification
            if (classification?.regions) {
                const regionRows = classification.regions.map((region) => {
                    // Region row
                    const regionRow = [
                        { content: region.region },
                        { content: formatNumberWithCommas(region.fullprice_sale_qty) },
                        { content: formatNumberWithCommas(region.fullprice_sale_value) },
                        { content: formatNumberWithCommas(region.discounted_sale_qty) },
                        { content: formatNumberWithCommas(region.discounted_sale_value) },
                        { content: formatNumberWithCommas(region.total_sale_qty) },
                        { content: formatNumberWithCommas(region.total_sale_value) },
                    ];

                    // If stores exist for this region, map them as well
                    if (region?.stores) {
                        const storeRows = region.stores.map((store) => {
                            return [
                                { content: store.store_name },
                                { content: formatNumberWithCommas(store.fullprice_sale_qty) },
                                { content: formatNumberWithCommas(store.fullprice_sale_value) },
                                { content: formatNumberWithCommas(store.discounted_sale_qty) },
                                { content: formatNumberWithCommas(store.discounted_sale_value) },
                                { content: formatNumberWithCommas(store.total_sale_qty) },
                                { content: formatNumberWithCommas(store.total_sale_value) },
                            ];
                        });

                        // Return the region row followed by all its stores
                        return [regionRow, ...storeRows];
                    }

                    // If no stores exist, just return the region row
                    return regionRow;
                });

                // Merge classification and its regions (including stores)
                return [classificationRow, ...regionRows.flat()];
            }

            // If no regions exist, just return the classification row
            return classificationRow;
        }).flat();

        // Adding the "Total" row
        const totalRow = [
            { content: "Total" },
            { content: formatNumberWithCommas(data?.overall_fullprice_sale_qty) },
            { content: formatNumberWithCommas(data?.overall_fullprice_sale_value) },
            { content: formatNumberWithCommas(data?.overall_discounted_sale_qty) },
            { content: formatNumberWithCommas(data?.overall_discounted_sale_value) },
            { content: formatNumberWithCommas(data?.overall_total_sale_qty) },
            { content: formatNumberWithCommas(data?.overall_total_sale_value) },
        ];

        // Push the total row at the end
        tableRows.push(totalRow);

        return tableRows;
    };

// Usage
    const tableRows = mapData(five);
    // Table create (CY Vs LY Growth)
    autoTable(doc, {
        startY: finalY+30,
        margin: { left: 2, right: 2 },
        theme: "grid",
        headStyles: {
            fontSize: 7,
            textColor: "white",
            fillColor: [11, 53, 136],
            halign: "center",
            lineWidth: 0.5,
            lineColor: "#000000",
        },
        bodyStyles: {
            fontSize: 6,
            textColor: "#000000",
            lineColor: "#000",
            lineWidth: 0.5,
            valign: "middle",
        },
        alternateRowStyles: {
            fillColor: [250, 250, 250],
        },
        styles: {
            cellPadding: 2,
            font: "helvetica",
            overflow: "linebreak",
            lineWidth: 0.5,
            lineColor: "#000",
        },

        head: [
            ["Store Type", { content: "Full Price", colSpan: 2 },{ content: "Discounted", colSpan:2} ,{ content: "Total", colSpan:2 } ],
[
                "Store Name",
                "Sale QTY",
                "Sale Value",
    "Sale QTY",
    "Sale Value",
    "Sale QTY",
    "Sale Value",

            ],
        ],
        body: tableRows,
    });

    var finalY = doc.lastAutoTable.finalY;
    doc.text("MTD", 8, finalY+20);
    const tableRows2 = mapData(six);
    autoTable(doc, {
        startY: finalY+30,
        margin: { left: 2, right: 2 },
        theme: "grid",
        headStyles: {
            fontSize: 7,
            textColor: "white",
            fillColor: [11, 53, 136],
            halign: "center",
            lineWidth: 0.5,
            lineColor: "#000000",
        },
        bodyStyles: {
            fontSize: 6,
            textColor: "#000000",
            lineColor: "#000",
            lineWidth: 0.5,
            valign: "middle",
        },
        alternateRowStyles: {
            fillColor: [250, 250, 250],
        },
        styles: {
            cellPadding: 2,
            font: "helvetica",
            overflow: "linebreak",
            lineWidth: 0.5,
            lineColor: "#000",
        },

        head: [
            ["Store Type", { content: "Full Price", colSpan: 2 },{ content: "Discounted", colSpan:2} ,{ content: "Total", colSpan:2 } ],
            [
                "Store Name",
                "Sale QTY",
                "Sale Value",
                "Sale QTY",
                "Sale Value",
                "Sale QTY",
                "Sale Value",

            ],
        ],
        body: tableRows2,
    });




    doc.save("Daily Sales Report");
};

export default downloadPDF;

