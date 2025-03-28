import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatNumberWithCommas } from "@helpers/formatters.js";

const downloadPDF = (items,filters) => {
    const doc = new jsPDF("landscape");

    const pageWidth = doc.internal.pageSize.getWidth();


    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CY Vs LY Growth", 8, 20);
    doc.setFontSize(12);
    doc.text(
        `DATE: ${filters?.date_from}`,
        pageWidth - 30,
        20,
        { align: "right" }
    );
    doc.setFont("helvetica", "normal");


    // Table create (CY Vs LY Growth)
    autoTable(doc, {
        startY: 30,
        margin: { left: 8, right: 0 },
        theme: "grid",
        headStyles: {
            fontSize: 7,
            textColor: "white",
            fillColor: [11, 53, 136],
            halign: "center",
            lineWidth: 0.5,
            lineColor: "#edeef0",
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
        body: items?.data?.map((item, index) => {

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

    // let finalY = doc.lastAutoTable.finalY;
    // doc.setFont("helvetica", "bold");
    // doc.text("Online (Gross Sale before Return)", 8, finalY+20);
    // doc.text(
    //     `DATE: ${filters?.date_from}`,
    //     pageWidth - 30, // X position near the right edge
    //     finalY+20, // Same Y position as the first text
    //     { align: "right" }
    // );
    // doc.setFont("helvetica", "normal");
    // autoTable(doc, {
    //     startY: 30,
    //     margin: { left: 8, right: 0 },
    //     theme: "grid",
    //     headStyles: {
    //         fontSize: 7,
    //         textColor: "white",
    //         fillColor: [11, 53, 136],
    //         halign: "center",
    //         lineWidth: 0.5,
    //         lineColor: "#edeef0",
    //     },
    //     bodyStyles: {
    //         fontSize: 6,
    //         textColor: "#000000",
    //         lineColor: "#000",
    //         lineWidth: 0.5,
    //         valign: "middle",
    //     },
    //     alternateRowStyles: {
    //         fillColor: [250, 250, 250],
    //     },
    //     styles: {
    //         cellPadding: 2,
    //         font: "helvetica",
    //         overflow: "linebreak",
    //         lineWidth: 0.5,
    //         lineColor: "#000",
    //     },
    //
    //     head: [
    //         [
    //             "Date",
    //             "Day",
    //             "Full Time",
    //             "Discounted",
    //             "Total",
    //
    //         ],
    //     ],
    //     body: items?.data?.map((item, index) => {
    //
    //         return [
    //
    //             {
    //                 content: (item?.date),
    //             },
    //             {
    //                 content: (item?.day),
    //             },
    //             {
    //                 content: formatNumberWithCommas(item?.full_price),
    //             },                {
    //                 content: formatNumberWithCommas(item?.discounted),
    //             },
    //             {
    //                 content: formatNumberWithCommas(item?.total),
    //             },
    //
    //
    //         ];
    //     }),
    // });


    doc.save("Daily Sales Report");
};

export default downloadPDF;

