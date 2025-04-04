import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatNumberWithCommas } from "@helpers/formatters.js";
import {generateDatesArray, prepareDataForTable} from "@modules/DailyReport/views/utils.js";
import React from "react";

const loadImage = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Prevent CORS issues
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = url;
    });
};

const downloadPDF = async (items,filters , one , two , three , four , five , six) => {
    // const doc = new jsPDF("landscape");
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [400, 210] // Width: 350 mm, Height: 210 mm
    });


    // Format numbers with commas for thousands
    const formatNumber = (num) => new Intl.NumberFormat().format(num);

    const pageWidth = doc.internal.pageSize.getWidth();


    const table2 = prepareDataForTable(one)
    const table2Header = generateDatesArray(one)


    try {
        const logoImage = await loadImage('https://res.cloudinary.com/dsarj6ihu/image/upload/v1743765967/new-removebg-preview_xgyr3m.png'); // Replace with your image URL

        // Set your desired image width and height
        const imageWidth = 30;
        const imageHeight = 15;

        // Set the image position on the left side (X=0)
        const xPosition = 8;  // Position the image at the left edge of the page
        const yPosition = 5;  // Position the image at the top of the page

        // Add the image to the PDF (placed on the left side)
        doc.addImage(logoImage, 'JPEG', xPosition, yPosition, imageWidth, imageHeight);
    } catch (error) {
        console.error('Error loading image:', error);
    }

/// Store Wise
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Daily Sales Report", 8, 25);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(169, 169, 169);
    doc.text(
        `Date: ${filters?.date_from}`,
        8,
        30,
    );
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

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

    const baseFontSize = 7;
    const adjustedFontSize = table2Header.length < 10
        ? baseFontSize
        : 6;

    autoTable(doc, {
        startY: 40,
        margin: { left: 2, right: 2 },
        theme: "grid",
        headStyles: {
            fontSize: 14,
            textColor: "white",
            fillColor: [200, 200, 200],
            halign: "start",
        },


        head: [
            ["A) Store Wise"], // Dynamically add the dates from table2Header
        ],
    });
    // Table create (CY Vs LY Growth)
    autoTable(doc, {
        startY: 55,
        margin: { left: 2, right: 2 },
        theme: "grid",
        headStyles: {
            fontSize: adjustedFontSize,
            textColor: "white",
            fillColor: [11, 53, 136],
            halign: "center",
            lineWidth: 0.1,
            lineColor: [200, 200, 200],
        },
        bodyStyles: {
            fontSize: adjustedFontSize-1,
            textColor: "#000000",
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
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

        columnStyles: {
            0: { cellWidth: table2Header?.length>10?25:"auto" },
            [table2Header.length+1]: { textColor: "white" },
        },

        head: [
            ["Store Type", ...table2Header, "Totals"], // Dynamically add the dates from table2Header
        ],
        body: rows,

    });


    ///////

    var finalY = doc.lastAutoTable.finalY;
    var pageHeight = doc.internal.pageSize.height; // Get the page height
    var margin = 0; // Set a margin to leave space at the bottom of the page

    console.log(pageHeight)
// Check if the content exceeds the page height
    if (finalY + 190 > pageHeight - margin) {
        doc.addPage(); // Add a new page if the content goes beyond the page height
        finalY = 20; // Reset finalY after adding the new page
    }

    try {
        const logoImage = await loadImage('https://res.cloudinary.com/dsarj6ihu/image/upload/v1743765967/new-removebg-preview_xgyr3m.png'); // Replace with your image URL

        // Set your desired image width and height
        const imageWidth = 30;
        const imageHeight = 15;

        // Set the image position on the left side (X=0)
        const xPosition = 8;  // Position the image at the left edge of the page
        const yPosition = 5;  // Position the image at the top of the page

        // Add the image to the PDF (placed on the left side)
        doc.addImage(logoImage, 'JPEG', xPosition, yPosition, imageWidth, imageHeight);
    } catch (error) {
        console.error('Error loading image:', error);
    }

/// Store Wise
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Daily Sales Report", 8, 25);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(169, 169, 169);
    doc.text(
        `Date: ${filters?.date_from}`,
        8,
        30,
    );
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    autoTable(doc, {
        startY: 40,
        margin: { left: 2, right: 2 },
        theme: "grid",
        headStyles: {
            fontSize: 14,
            textColor: "white",
            fillColor: [200, 200, 200],
            halign: "start",
        },


        head: [
            ["B) Daily Target Achievement"], // Dynamically add the dates from table2Header
        ],
    });

    const getAchIcon = (achPercentage) => {
        return achPercentage < 0 ? '' : '';
    };

    const calcAch1 = (sale, target) => {
        if (!target || target === 0) return 0;
        const result = ((sale / target) - 1) * 100;
        return Number(result.toFixed(2));
    };

    // Totals calculations
    const totals1 = two?.reduce(
        (acc, row) => {
            acc.fullPriceOfflineTarget += row.fullPriceOfflineTarget || 0;
            acc.fullPriceOfflineSale += row.fullPriceOfflineSale || 0;
            acc.discountedOfflineTarget += row.discountedOfflineTarget || 0;
            acc.discountedOfflineSale += row.discountedOfflineSale || 0;
            acc.totalOfflineTarget += row.totalOfflineTarget || 0;
            acc.totalOfflineSale += row.totalOfflineSale || 0;
            acc.fullPriceOnlineTarget += row.fullPriceOnlineTarget || 0;
            acc.fullPriceOnlineSale += row.fullPriceOnlineSale || 0;
            acc.discountedOnlineTarget += row.discountedOnlineTarget || 0;
            acc.discountedOnlineSale += row.discountedOnlineSale || 0;
            acc.totalOnlineTarget += row.totalOnlineTarget || 0;
            acc.totalOnlineSale += row.totalOnlineSale || 0;
            acc.totalTarget += row.totalTarget || 0;
            acc.totalSale += row.totalSale || 0;
            return acc;
        },
        {
            fullPriceOfflineTarget: 0,
            fullPriceOfflineSale: 0,
            discountedOfflineTarget: 0,
            discountedOfflineSale: 0,
            totalOfflineTarget: 0,
            totalOfflineSale: 0,
            fullPriceOnlineTarget: 0,
            fullPriceOnlineSale: 0,
            discountedOnlineTarget: 0,
            discountedOnlineSale: 0,
            totalOnlineTarget: 0,
            totalOnlineSale: 0,
            totalTarget: 0,
            totalSale: 0,
        }
    );

    const totalsAch1 = {
        fullPriceOfflineAch: calcAch1(totals1.fullPriceOfflineSale, totals1.fullPriceOfflineTarget),
        discountedOfflineAch: calcAch1(totals1.discountedOfflineSale, totals1.discountedOfflineTarget),
        totalOfflineAch: calcAch1(totals1.totalOfflineSale, totals1.totalOfflineTarget),
        fullPriceOnlineAch: calcAch1(totals1.fullPriceOnlineSale, totals1.fullPriceOnlineTarget),
        discountedOnlineAch: calcAch1(totals1.discountedOnlineSale, totals1.discountedOnlineTarget),
        totalOnlineAch: calcAch1(totals1.totalOnlineSale, totals1.totalOnlineTarget),
        totalAch: calcAch1(totals1.totalSale, totals1.totalTarget),
    };

// Create your totals row with bold text and a light gray background ([249, 249, 249] corresponds to "#f9f9f9")
    const totalsRow1 = [
        { content: "", styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "center" } },
        { content: "Total", styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "center" } },
        { content: formatNumberWithCommas(totals1.fullPriceOfflineTarget), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: formatNumberWithCommas(totals1.fullPriceOfflineSale), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: `${getAchIcon(totalsAch1.fullPriceOfflineAch)} ${totalsAch1.fullPriceOfflineAch}`, styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "center" } },
        { content: formatNumberWithCommas(totals1.discountedOfflineTarget), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: formatNumberWithCommas(totals1.discountedOfflineSale), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: `${getAchIcon(totalsAch1.discountedOfflineAch)} ${totalsAch1.discountedOfflineAch}`, styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "center" } },
        { content: formatNumberWithCommas(totals1.totalOfflineTarget), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: formatNumberWithCommas(totals1.totalOfflineSale), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: `${getAchIcon(totalsAch1.totalOfflineAch)} ${totalsAch1.totalOfflineAch}`, styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "center" } },
        { content: formatNumberWithCommas(totals1.fullPriceOnlineTarget), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: formatNumberWithCommas(totals1.fullPriceOnlineSale), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: `${getAchIcon(totalsAch1.fullPriceOnlineAch)} ${totalsAch1.fullPriceOnlineAch}`, styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "center" } },
        { content: formatNumberWithCommas(totals1.discountedOnlineTarget), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: formatNumberWithCommas(totals1.discountedOnlineSale), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: `${getAchIcon(totalsAch1.discountedOnlineAch)} ${totalsAch1.discountedOnlineAch}`, styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "center" } },
        { content: formatNumberWithCommas(totals1.totalOnlineTarget), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: formatNumberWithCommas(totals1.totalOnlineSale), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: `${getAchIcon(totalsAch1.totalOnlineAch)} ${totalsAch1.totalOnlineAch}`, styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "center" } },
        { content: formatNumberWithCommas(totals1.totalTarget), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: formatNumberWithCommas(totals1.totalSale), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: `${getAchIcon(totalsAch1.totalAch)} ${totalsAch1.totalAch}`, styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "center" } },
    ];

// Map your data rows for the table body (example using your "two" array)
    const bodyRows1 = two.map((item) => [
        { content: item?.date },
        { content: item?.day },
        { content: formatNumberWithCommas(item?.fullPriceOfflineTarget) },
        { content: formatNumberWithCommas(item?.fullPriceOfflineSale) },
        { content: item?.fullPriceOfflineAch },
        { content: formatNumberWithCommas(item?.discountedOfflineTarget) },
        { content: formatNumberWithCommas(item?.discountedOfflineSale) },
        { content: item?.discountedOfflineAch },
        { content: formatNumberWithCommas(item?.totalOfflineTarget) },
        { content: formatNumberWithCommas(item?.totalOfflineSale) },
        { content: item?.totalOfflineAch },
        { content: formatNumberWithCommas(item?.fullPriceOnlineTarget) },
        { content: formatNumberWithCommas(item?.fullPriceOnlineSale) },
        { content: item?.fullPriceOnlineAch },
        { content: formatNumberWithCommas(item?.discountedOnlineTarget) },
        { content: formatNumberWithCommas(item?.discountedOnlineSale) },
        { content: item?.discountedOnlineAch },
        { content: formatNumberWithCommas(item?.totalOnlineTarget) },
        { content: formatNumberWithCommas(item?.totalOnlineSale) },
        { content: item?.totalOnlineAch },
        { content: formatNumberWithCommas(item?.totalTarget) },
        { content: formatNumberWithCommas(item?.totalSale) },
        { content: item?.totalAch },
    ]);

// Combine your data rows and add the totals row at the end
    const finalBody1 = [...bodyRows1, totalsRow1];



    // Table create (CY Vs LY Growth)
    autoTable(doc, {
        startY: 55,
        margin: { left: 2, right: 2 },
        theme: "grid",
        headStyles: {
            fontSize: 7,
            textColor: "white",
            fillColor: [11, 53, 136],
            halign: "center",
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
        },
        bodyStyles: {
            fontSize: 6,
            textColor: "#000000",
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
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
        // body: two.map((item, index) => {
        //     return [
        //         { content: item?.date },
        //         { content: item?.day },
        //
        //         // Offline Full Price Columns
        //         { content: formatNumberWithCommas(item?.fullPriceOfflineTarget) },
        //         { content: formatNumberWithCommas(item?.fullPriceOfflineSale) },
        //         { content: item?.fullPriceOfflineAch },
        //
        //         // Offline Discount Columns
        //         { content: formatNumberWithCommas(item?.discountedOfflineTarget) },
        //         { content: formatNumberWithCommas(item?.discountedOfflineSale) },
        //         { content: item?.discountedOfflineAch },
        //
        //         // Offline Total Columns
        //         { content: formatNumberWithCommas(item?.totalOfflineTarget) },
        //         { content: formatNumberWithCommas(item?.totalOfflineSale) },
        //         { content: item?.totalOfflineAch },
        //
        //         // Online Full Price Columns
        //         { content: formatNumberWithCommas(item?.fullPriceOnlineTarget) },
        //         { content: formatNumberWithCommas(item?.fullPriceOnlineSale) },
        //         { content: item?.fullPriceOnlineAch },
        //
        //         // Online Discount Columns
        //         { content: formatNumberWithCommas(item?.discountedOnlineTarget) },
        //         { content: formatNumberWithCommas(item?.discountedOnlineSale) },
        //         { content: item?.discountedOnlineAch },
        //
        //         // Online Total Columns
        //         { content: formatNumberWithCommas(item?.totalOnlineTarget) },
        //         { content: formatNumberWithCommas(item?.totalOnlineSale) },
        //         { content: item?.totalOnlineAch },
        //
        //         // Total Target, Sale and Ach% Columns
        //         { content: formatNumberWithCommas(item?.totalTarget) },
        //         { content: formatNumberWithCommas(item?.totalSale) },
        //         { content: item?.totalAch },
        //     ];
        // }),

        body:finalBody1
    });



    ///////
    var finalY = doc.lastAutoTable.finalY;
    var pageHeight = doc.internal.pageSize.height; // Get the page height
    var margin = 0; // Set a margin to leave space at the bottom of the page

    console.log(pageHeight)
// Check if the content exceeds the page height
    if (finalY + 190 > pageHeight - margin) {
        doc.addPage(); // Add a new page if the content goes beyond the page height
        finalY = 20; // Reset finalY after adding the new page
    }

    try {
        const logoImage = await loadImage('https://res.cloudinary.com/dsarj6ihu/image/upload/v1743765967/new-removebg-preview_xgyr3m.png'); // Replace with your image URL

        // Set your desired image width and height
        const imageWidth = 30;
        const imageHeight = 15;

        // Set the image position on the left side (X=0)
        const xPosition = 8;  // Position the image at the left edge of the page
        const yPosition = 5;  // Position the image at the top of the page

        // Add the image to the PDF (placed on the left side)
        doc.addImage(logoImage, 'JPEG', xPosition, yPosition, imageWidth, imageHeight);
    } catch (error) {
        console.error('Error loading image:', error);
    }

/// Store Wise
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Daily Sales Report", 8, 25);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(169, 169, 169);
    doc.text(
        `Date: ${filters?.date_from}`,
        8,
        30,
    );
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    autoTable(doc, {
        startY: 40,
        margin: { left: 2, right: 2 },
        theme: "grid",
        headStyles: {
            fontSize: 14,
            textColor: "white",
            fillColor: [200, 200, 200],
            halign: "start",
        },


        head: [
            ["C) CV vs LY Growth"], // Dynamically add the dates from table2Header
        ],
    });

    const calcAch = (LY, CY) => {
        if (!CY || LY === 0) return 0;
        const result = (((CY-LY)/LY)*100);
        return Number(result.toFixed(2));
    };

    const totals = three?.reduce(
        (acc, row) => {
            acc.FullPriceOfflineCY += row.FullPriceOfflineCY || 0;
            acc.FullPriceOfflineLY += row.FullPriceOfflineLY || 0;

            acc.DiscountedOfflineCY += row.DiscountedOfflineCY || 0;
            acc.DiscountedOfflineLY += row.DiscountedOfflineLY || 0;

            acc.TotalOfflineCY += row.TotalOfflineCY || 0;
            acc.TotalOfflineLY += row.TotalOfflineLY || 0;

            acc.FullPriceOnlineCY += row.FullPriceOnlineCY || 0;
            acc.FullPriceOnlineLY += row.FullPriceOnlineLY || 0;

            acc.DiscountedOnlineCY += row.DiscountedOnlineCY || 0;
            acc.DiscountedOnlineLY += row.DiscountedOnlineLY || 0;

            acc.TotalOnlineCY += row.TotalOnlineCY || 0;
            acc.TotalOnlineLY += row.TotalOnlineLY || 0;

            acc.TotalCY += row.TotalCY || 0;
            acc.TotalLY += row.TotalLY || 0;

            return acc;
        },
        {
            FullPriceOfflineCY: 0,
            FullPriceOfflineLY: 0,
            DiscountedOfflineCY: 0,
            DiscountedOfflineLY: 0,
            TotalOfflineCY: 0,
            TotalOfflineLY: 0,
            FullPriceOnlineCY: 0,
            FullPriceOnlineLY: 0,
            DiscountedOnlineCY: 0,
            DiscountedOnlineLY: 0,
            TotalOnlineCY: 0,
            TotalOnlineLY: 0,
            TotalCY: 0,
            TotalLY: 0,
        }
    );

    const totalsAch = {
        FullPriceOfflineAch: calcAch(totals.FullPriceOfflineLY, totals.FullPriceOfflineCY),
        DiscountedOfflineAch: calcAch(totals.DiscountedOfflineLY, totals.DiscountedOfflineCY),
        TotalOfflineAch: calcAch(totals.TotalOfflineLY, totals.TotalOfflineCY),

        FullPriceOnlineAch: calcAch(totals.FullPriceOnlineLY, totals.FullPriceOnlineCY),
        DiscountedOnlineAch: calcAch(totals.DiscountedOnlineLY, totals.DiscountedOnlineCY),
        TotalOnlineAch: calcAch(totals.TotalOnlineLY, totals.TotalOnlineCY),

        TotalAch: calcAch(totals.TotalLY, totals.TotalCY),
    };



    // Map your data rows for the table body
    const bodyRows = three?.map((item) => {
        return [
            { content: item?.Date },
            { content: item?.Day },
            { content: formatNumberWithCommas(item?.FullPriceOfflineCY), styles: { halign: "right" } },
            { content: formatNumberWithCommas(item?.FullPriceOfflineLY), styles: { halign: "right" } },
            { content: item?.FullPriceOfflineGrowth, styles: { halign: "center" } },
            { content: formatNumberWithCommas(item?.DiscountedOfflineCY), styles: { halign: "right" } },
            { content: formatNumberWithCommas(item?.DiscountedOfflineLY), styles: { halign: "right" } },
            { content: item?.DiscountedOfflineGrowth, styles: { halign: "center" } },
            { content: formatNumberWithCommas(item?.TotalOfflineCY), styles: { halign: "right" } },
            { content: formatNumberWithCommas(item?.TotalOfflineLY), styles: { halign: "right" } },
            { content: item?.TotalOfflineGrowth, styles: { halign: "center" } },
            { content: formatNumberWithCommas(item?.FullPriceOnlineCY), styles: { halign: "right" } },
            { content: formatNumberWithCommas(item?.FullPriceOnlineLY), styles: { halign: "right" } },
            { content: item?.FullPriceOnlineGrowth, styles: { halign: "center" } },
            { content: formatNumberWithCommas(item?.DiscountedOnlineCY), styles: { halign: "right" } },
            { content: formatNumberWithCommas(item?.DiscountedOnlineLY), styles: { halign: "right" } },
            { content: item?.DiscountedOnlineGrowth, styles: { halign: "center" } },
            { content: formatNumberWithCommas(item?.TotalOnlineCY), styles: { halign: "right" } },
            { content: formatNumberWithCommas(item?.TotalOnlineLY), styles: { halign: "right" } },
            { content: item?.TotalOnlineGrowth, styles: { halign: "center" } },
            { content: formatNumberWithCommas(item?.TotalCY), styles: { halign: "right" } },
            { content: formatNumberWithCommas(item?.TotalLY), styles: { halign: "right" } },
            { content: item?.TotalGrowth, styles: { halign: "center" } },
        ];
    });

// Create totals row with cell-specific styles (bold and gray background)
// Here [249, 249, 249] corresponds to "#f9f9f9"
    const totalsRowThree = [
        { content: "", styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "center" } },
        { content: "Total", styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "center" } },
        { content: formatNumberWithCommas(totals.FullPriceOfflineCY), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: formatNumberWithCommas(totals.FullPriceOfflineLY), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        {
            content: `${getAchIcon(totalsAch.FullPriceOfflineAch)} ${totalsAch.FullPriceOfflineAch}`,
            styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "center" },
        },
        { content: formatNumberWithCommas(totals.DiscountedOfflineCY), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: formatNumberWithCommas(totals.DiscountedOfflineLY), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        {
            content: `${getAchIcon(totalsAch.DiscountedOfflineAch)} ${totalsAch.DiscountedOfflineAch}`,
            styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "center" },
        },
        { content: formatNumberWithCommas(totals.TotalOfflineCY), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: formatNumberWithCommas(totals.TotalOfflineLY), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        {
            content: `${getAchIcon(totalsAch.TotalOfflineAch)} ${totalsAch.TotalOfflineAch}`,
            styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "center" },
        },
        { content: formatNumberWithCommas(totals.FullPriceOnlineCY), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: formatNumberWithCommas(totals.FullPriceOnlineLY), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        {
            content: `${getAchIcon(totalsAch.FullPriceOnlineAch)} ${totalsAch.FullPriceOnlineAch}`,
            styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "center" },
        },
        { content: formatNumberWithCommas(totals.DiscountedOnlineCY), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: formatNumberWithCommas(totals.DiscountedOnlineLY), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        {
            content: `${getAchIcon(totalsAch.DiscountedOnlineAch)} ${totalsAch.DiscountedOnlineAch}`,
            styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "center" },
        },
        { content: formatNumberWithCommas(totals.TotalOnlineCY), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: formatNumberWithCommas(totals.TotalOnlineLY), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        {
            content: `${getAchIcon(totalsAch.TotalOnlineAch)} ${totalsAch.TotalOnlineAch}`,
            styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "center" },
        },
        { content: formatNumberWithCommas(totals.TotalCY), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        { content: formatNumberWithCommas(totals.TotalLY), styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "right" } },
        {
            content: `${getAchIcon(totalsAch.TotalAch)} ${totalsAch.TotalAch}`,
            styles: { fontStyle: "bold", fillColor: [249, 249, 249], halign: "center" },
        },
    ];

// Build the final table body including your data rows and the totals row
    const finalBody = [
        ...bodyRows,
        totalsRowThree,
    ];

    // Table create (CY Vs LY Growth)
    autoTable(doc, {
        startY: 55,
        margin: { left: 2, right: 2 },
        theme: "grid",
        headStyles: {
            fontSize: 7,
            textColor: "white",
            fillColor: [11, 53, 136],
            halign: "center",
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
        },
        bodyStyles: {
            fontSize: 6,
            textColor: "#000000",
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
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
        // body: three?.map((item, index) => {
        //
        //     return [
        //         {
        //             content: item?.Date,
        //         },
        //         {
        //             content: item?.Day,
        //         },
        //         {
        //             content: formatNumberWithCommas(item?.FullPriceOfflineCY),
        //         },
        //         {
        //             content: formatNumberWithCommas(item?.FullPriceOfflineLY),
        //         },
        //         {
        //             content: item?.FullPriceOfflineGrowth,
        //         },                {
        //             content: formatNumberWithCommas(item?.DiscountedOfflineCY),
        //         },
        //         {
        //             content: formatNumberWithCommas(item?.DiscountedOfflineLY),
        //         },
        //         {
        //             content: item?.DiscountedOfflineGrowth,
        //         },
        //         {
        //             content: formatNumberWithCommas(item?.TotalOfflineCY),
        //         },
        //         {
        //             content: formatNumberWithCommas(item?.TotalOfflineLY),
        //         },
        //         {
        //             content: item?.TotalOfflineGrowth,
        //         },
        //         {
        //             content: formatNumberWithCommas(item?.FullPriceOnlineCY),
        //         },
        //         {
        //             content: formatNumberWithCommas(item?.FullPriceOnlineLY),
        //         },
        //         {
        //             content: item?.FullPriceOnlineGrowth,
        //         },
        //         {
        //             content: formatNumberWithCommas(item?.DiscountedOnlineCY),
        //         },                {
        //             content: formatNumberWithCommas(item?.DiscountedOnlineLY),
        //         },
        //         {
        //             content: item?.DiscountedOnlineGrowth,
        //         },
        //         {
        //             content: formatNumberWithCommas(item?.TotalOnlineCY),
        //         },
        //         {
        //             content: formatNumberWithCommas(item?.TotalOnlineLY),
        //         },
        //         {
        //             content: item?.TotalOnlineGrowth,
        //         },
        //         {
        //             content: formatNumberWithCommas(item?.TotalCY),
        //         },                {
        //             content: formatNumberWithCommas(item?.TotalLY),
        //         },
        //         {
        //             content: item?.TotalGrowth,
        //         },
        //
        //     ];
        // }),
        body:finalBody
    });


    ///////
    var finalY = doc.lastAutoTable.finalY;
    var pageHeight = doc.internal.pageSize.height; // Get the page height
    var margin = 0; // Set a margin to leave space at the bottom of the page

    console.log(pageHeight)
// Check if the content exceeds the page height
    if (finalY + 190 > pageHeight - margin) {
        doc.addPage(); // Add a new page if the content goes beyond the page height
        finalY = 20; // Reset finalY after adding the new page
    }

    try {
        const logoImage = await loadImage('https://res.cloudinary.com/dsarj6ihu/image/upload/v1743765967/new-removebg-preview_xgyr3m.png'); // Replace with your image URL

        // Set your desired image width and height
        const imageWidth = 30;
        const imageHeight = 15;

        // Set the image position on the left side (X=0)
        const xPosition = 8;  // Position the image at the left edge of the page
        const yPosition = 5;  // Position the image at the top of the page

        // Add the image to the PDF (placed on the left side)
        doc.addImage(logoImage, 'JPEG', xPosition, yPosition, imageWidth, imageHeight);
    } catch (error) {
        console.error('Error loading image:', error);
    }

/// Store Wise
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Daily Sales Report", 8, 25);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(169, 169, 169);
    doc.text(
        `Date: ${filters?.date_from}`,
        8,
        30,
    );
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    autoTable(doc, {
        startY: 40,
        margin: { left: 2, right: 2 },
        theme: "grid",
        headStyles: {
            fontSize: 14,
            textColor: "white",
            fillColor: [200, 200, 200],
            halign: "start",
        },


        head: [
            ["D) Online (Gross Sale before Return)"], // Dynamically add the dates from table2Header
        ],
    });

// Calculate totals
    const totalFullPrice = four.reduce((acc, item) => acc + (item?.full_price || 0), 0);
    const totalDiscounted = four.reduce((acc, item) => acc + (item?.discounted || 0), 0);
    const totalTotal = four.reduce((acc, item) => acc + (item?.total || 0), 0);

// Map your data rows
    const dataRows = four?.map((item) => [
        { content: item?.date },
        { content: item?.day },
        { content: formatNumberWithCommas(item?.full_price) },
        { content: formatNumberWithCommas(item?.discounted) },
        { content: formatNumberWithCommas(item?.total) },
    ]);

// Create totals row
    const totalsRow = [
        { content: "", styles: { fontStyle: "bold", fillColor: [220, 220, 220] } },
        { content: "Totals", styles: { fontStyle: "bold", fillColor: [220, 220, 220] } },
        { content: formatNumberWithCommas(totalFullPrice), styles: { fontStyle: "bold", fillColor: [220, 220, 220] } },
        { content: formatNumberWithCommas(totalDiscounted), styles: { fontStyle: "bold", fillColor: [220, 220, 220] } },
        { content: formatNumberWithCommas(totalTotal), styles: { fontStyle: "bold", fillColor: [220, 220, 220] } },
    ];
    // Table create (CY Vs LY Growth)
    autoTable(doc, {
        startY: 55,
        margin: { left: 2, right: 2 },
        theme: "grid",
        headStyles: {
            fontSize: 7,
            textColor: "white",
            fillColor: [11, 53, 136],
            halign: "center",
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
        },
        bodyStyles: {
            fontSize: 6,
            textColor: "#000000",
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
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
        body: [
            ...dataRows,
            totalsRow,
        ],
    });




    ///////
    var finalY = doc.lastAutoTable.finalY;
    var pageHeight = doc.internal.pageSize.height; // Get the page height
    var margin = 0; // Set a margin to leave space at the bottom of the page

    console.log(pageHeight)
// Check if the content exceeds the page height
    if (finalY + 190 > pageHeight - margin) {
        doc.addPage(); // Add a new page if the content goes beyond the page height
        finalY = 20; // Reset finalY after adding the new page
    }

    try {
        const logoImage = await loadImage('https://res.cloudinary.com/dsarj6ihu/image/upload/v1743765967/new-removebg-preview_xgyr3m.png'); // Replace with your image URL

        // Set your desired image width and height
        const imageWidth = 30;
        const imageHeight = 15;

        // Set the image position on the left side (X=0)
        const xPosition = 8;  // Position the image at the left edge of the page
        const yPosition = 5;  // Position the image at the top of the page

        // Add the image to the PDF (placed on the left side)
        doc.addImage(logoImage, 'JPEG', xPosition, yPosition, imageWidth, imageHeight);
    } catch (error) {
        console.error('Error loading image:', error);
    }

/// Store Wise
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Daily Sales Report", 8, 25);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(169, 169, 169);
    doc.text(
        `Date: ${filters?.date_from}`,
        8,
        30,
    );
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    autoTable(doc, {
        startY: 40,
        margin: { left: 2, right: 2 },
        theme: "grid",
        headStyles: {
            fontSize: 14,
            textColor: "white",
            fillColor: [200, 200, 200],
            halign: "start",
        },


        head: [
            ["E) Daily Sales Report - Store Wise (Last Day)"], // Dynamically add the dates from table2Header
        ],
    });


    const mapData = (data) => {
        // Map each classification to its rows (including regions and stores)
        const tableRows = data?.classifications?.map((classification) => {
            // Build the classification row with a custom flag
            const classificationRow = [
                { content: classification.classification_name },
                { content: formatNumberWithCommas(classification.fullprice_sale_qty) },
                { content: formatNumberWithCommas(classification.fullprice_sale_value) },
                { content: formatNumberWithCommas(classification.discounted_sale_qty) },
                { content: formatNumberWithCommas(classification.discounted_sale_value) },
                { content: formatNumberWithCommas(classification.total_sale_qty) },
                { content: formatNumberWithCommas(classification.total_sale_value) },
            ];
            // Attach a custom flag to identify this as a classification row
            classificationRow.rowType = "classification";

            let rows = [classificationRow];

            // If regions exist, map them (and their stores if available)
            if (classification?.regions) {
                classification.regions.forEach((region) => {
                    // Build the region row
                    const regionRow = [
                        { content: region.region },
                        { content: formatNumberWithCommas(region.fullprice_sale_qty) },
                        { content: formatNumberWithCommas(region.fullprice_sale_value) },
                        { content: formatNumberWithCommas(region.discounted_sale_qty) },
                        { content: formatNumberWithCommas(region.discounted_sale_value) },
                        { content: formatNumberWithCommas(region.total_sale_qty) },
                        { content: formatNumberWithCommas(region.total_sale_value) },
                    ];
                    // (Optional) You can mark region rows too if needed:
                    regionRow.rowType = "region";
                    rows.push(regionRow);

                    // If stores exist, map each store row
                    if (region?.stores && region.stores.length > 0) {
                        region.stores.forEach((store) => {
                            const storeRow = [
                                { content: store.store_name },
                                { content: formatNumberWithCommas(store.fullprice_sale_qty) },
                                { content: formatNumberWithCommas(store.fullprice_sale_value) },
                                { content: formatNumberWithCommas(store.discounted_sale_qty) },
                                { content: formatNumberWithCommas(store.discounted_sale_value) },
                                { content: formatNumberWithCommas(store.total_sale_qty) },
                                { content: formatNumberWithCommas(store.total_sale_value) },
                            ];
                            // (Optional) Mark store rows if needed:
                            storeRow.rowType = "store";
                            rows.push(storeRow);
                        });
                    }
                });
            }
            return rows;
        }).flat() || [];

        // Filter out any rows that are entirely empty
        const filteredRows = tableRows.filter(row =>
            row.some(cell => cell.content !== "" && cell.content !== null && cell.content !== undefined)
        );

        // Add the "Total" row at the end (without a custom flag)
        const totalRow = [
            { content: "Total" },
            { content: formatNumberWithCommas(data?.overall_fullprice_sale_qty) },
            { content: formatNumberWithCommas(data?.overall_fullprice_sale_value) },
            { content: formatNumberWithCommas(data?.overall_discounted_sale_qty) },
            { content: formatNumberWithCommas(data?.overall_discounted_sale_value) },
            { content: formatNumberWithCommas(data?.overall_total_sale_qty) },
            { content: formatNumberWithCommas(data?.overall_total_sale_value) },
        ];

        filteredRows.push(totalRow);

        return filteredRows;
    };

// Usage
    const tableRows = mapData(five);
    // Table create (CY Vs LY Growth)
    autoTable(doc, {
        startY: 50,
        margin: { left: 2, right: 2 },
        theme: "grid",
        headStyles: {
            fontSize: 7,
            textColor: "white",
            fillColor: [11, 53, 136],
            halign: "center",
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
        },
        bodyStyles: {
            fontSize: 6,
            textColor: "#000000",
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
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
        didParseCell: function (data) {
            // Assuming the "Total" row is the last row
            if (data.row.index === tableRows.length - 1) {
                data.cell.styles.fontStyle = "bold";       // Bold text
                data.cell.styles.fillColor = [211, 211, 211]; // Gray background
            }

            if (data.row.raw.rowType === "classification") {
                data.cell.styles.fontStyle = "bold";       // Bold text
                data.cell.styles.fillColor = [211, 211, 211]; // Gray background
            }

            if (data.row.raw.rowType === "region") {
                data.cell.styles.fontStyle = "bold";       // Bold text
                data.cell.styles.fillColor = [211, 211, 211];
            }
        },
    });

    var finalY = doc.lastAutoTable.finalY;
    var pageHeight = doc.internal.pageSize.height; // Get the page height
    var margin = 0; // Set a margin to leave space at the bottom of the page

    console.log(pageHeight)
// Check if the content exceeds the page height
    if (finalY + 190 > pageHeight - margin) {
        doc.addPage(); // Add a new page if the content goes beyond the page height
        finalY = 20; // Reset finalY after adding the new page
    }

    try {
        const logoImage = await loadImage('https://res.cloudinary.com/dsarj6ihu/image/upload/v1743765967/new-removebg-preview_xgyr3m.png'); // Replace with your image URL

        // Set your desired image width and height
        const imageWidth = 30;
        const imageHeight = 15;

        // Set the image position on the left side (X=0)
        const xPosition = 8;  // Position the image at the left edge of the page
        const yPosition = 5;  // Position the image at the top of the page

        // Add the image to the PDF (placed on the left side)
        doc.addImage(logoImage, 'JPEG', xPosition, yPosition, imageWidth, imageHeight);
    } catch (error) {
        console.error('Error loading image:', error);
    }

/// Store Wise
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Daily Sales Report", 8, 25);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(169, 169, 169);
    doc.text(
        `Date: ${filters?.date_from}`,
        8,
        30,
    );
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    autoTable(doc, {
        startY: 40,
        margin: { left: 2, right: 2 },
        theme: "grid",
        headStyles: {
            fontSize: 14,
            textColor: "white",
            fillColor: [200, 200, 200],
            halign: "start",
        },


        head: [
            ["F) Daily Sales Report - Store Wise (MTD)"], // Dynamically add the dates from table2Header
        ],
    });
    const tableRows2 = mapData(six);
    autoTable(doc, {
        startY: 55,
        margin: { left: 2, right: 2 },
        theme: "grid",
        headStyles: {
            fontSize: 7,
            textColor: "white",
            fillColor: [11, 53, 136],
            halign: "center",
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
        },
        bodyStyles: {
            fontSize: 6,
            textColor: "#000000",
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
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
        didParseCell: function (data) {
            // Assuming the "Total" row is the last row
            if (data.row.index === tableRows2.length - 1) {
                data.cell.styles.fontStyle = "bold";       // Bold text
                data.cell.styles.fillColor = [211, 211, 211]; // Gray background
            }

            if (data.row.raw.rowType === "classification") {
                data.cell.styles.fontStyle = "bold";       // Bold text
                data.cell.styles.fillColor = [211, 211, 211]; // Gray background
            }

            if (data.row.raw.rowType === "region") {
                data.cell.styles.fontStyle = "bold";       // Bold text
                data.cell.styles.fillColor = [211, 211, 211];
            }
        },
    });




    doc.save("Daily Sales Report");
};

export default downloadPDF;

