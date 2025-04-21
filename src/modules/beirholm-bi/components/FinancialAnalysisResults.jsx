import React from "react";
import Chart from "react-apexcharts";

const FinancialAnalysisResults = ({analysis, currencyValue, convertToMillions}) => {
    const tableHeaders = analysis.headers;
    const tableData = analysis.values[currencyValue] || [];
    const ratioHeaders = analysis.ratios.headers;
    const ratioData = analysis.ratios.data;
    const years = tableHeaders.slice(2);

    const revenue = convertToMillions(tableData.find(r => r[0] === "Revenue"));
    const grossProfit = convertToMillions(tableData.find(r => r[0] === "Gross Profit"));
    const profitAfterTax = convertToMillions(tableData.find(r => r[0] === "Profit After Tax"));
    const equity = convertToMillions(tableData.find(r => r[0] === "Equity"));
    const currentLiabilities = convertToMillions(tableData.find(r => r[0] === "Current Liabilities"));
    const nonCurrentLiabilities = convertToMillions(tableData.find(r => r[0] === "Non-Current Liabilities"));

    const formatSuffix = v => {
        const n = Number(v)
        const a = Math.abs(n)
        if (a >= 1e3) return (n / 1e3).toFixed(2) + "B"
        if (a >= 1) return n.toFixed(2) + "M"
        return (n * 1e3).toFixed(2) + "K"
    }
    const revenueChartOptions = {
        chart: {type: "line", height: 350},
        stroke: {width: [0, 2, 2], curve: "smooth"},
        colors: ["#1E3A8A", "#10B981", "#F59E0B"],
        plotOptions: {bar: {dataLabels: {position: "top"}}},
        xaxis: {
            categories: years,
            labels: {style: {colors: years.map(() => "#757575")}}
        },
        yaxis: [
            {
                labels: {formatter: formatSuffix, style: {colors: ["#757575"]}},
                title: {text: `Revenue in ${currencyValue}`, style: {color: "#757575"}}
            },
            {
                opposite: true,
                labels: {formatter: formatSuffix, style: {colors: ["#757575"]}},
                title: {text: `Profit Metrics in ${currencyValue}`, style: {color: "#757575"}}
            }
        ],
        dataLabels: {
            enabled: true,
            enabledOnSeries: [0],
            formatter: formatSuffix,
            offsetY: -18,
            style: {fontSize: "12px", colors: ["#757575"]}
        },
        tooltip: {shared: true, intersect: false, y: {formatter: formatSuffix}}
    }


    const revenueChartSeries = [
        {name: "Revenue", type: "column", data: revenue},
        {name: "Gross Profit", type: "line", data: grossProfit},
        {name: "Profit After Tax", type: "line", data: profitAfterTax}
    ]

    const equityChartOptions = {
        chart: {type: "bar", stacked: true, height: 350},
        plotOptions: {bar: {horizontal: true, dataLabels: {position: "center"}}},
        colors: ["#1E3A8A", "#64748B", "#94A3B8"],
        xaxis: {categories: years, labels: {formatter: formatSuffix}},
        yaxis: {title: {text: `Value in ${currencyValue}`}},
        dataLabels: {enabled: true, formatter: formatSuffix, style: {fontSize: "12px"}},
        tooltip: {shared: true, intersect: false, y: {formatter: formatSuffix}}
    };

    const equityChartSeries = [
        {name: "Equity", data: equity},
        {name: "Current Liabilities", data: currentLiabilities},
        {name: "Non-Current Liabilities", data: nonCurrentLiabilities}
    ];

    return (
        <div>
            <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                <div className="p-3 text-lg font-semibold text-gray-900 border-b bg-gray-100 text-left"></div>
                <div className="w-full flex justify-center items-center">
                    <table className="w-full table-fixed border-collapse">
                        <thead style={{backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white"}}>
                        <tr>
                            {tableHeaders.map((h, i) => (
                                <th key={i} className="p-2 border border-gray-400 text-center">{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="text-gray-800">
                        {tableData.map((row, ri) => (
                            <tr key={ri}>
                                {row.map((cell, ci) => (
                                    <td key={ci} className="p-2 border border-gray-400 text-center">{cell}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {ratioHeaders.length > 0 && (
                <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                    <div className="p-3 text-lg font-semibold text-gray-900 border-b bg-gray-100 text-left"></div>
                    <div className="w-full flex justify-center items-center">
                        <table className="w-full table-fixed border-collapse">
                            <thead style={{backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white"}}>
                            <tr>
                                {ratioHeaders.map((h, i) => (
                                    <th key={i} className="p-2 border border-gray-400 text-center">{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody className="text-gray-800">
                            {ratioData.map((row, ri) => (
                                <tr key={ri}>
                                    {row.map((cell, ci) => (
                                        <td key={ci} className="p-2 border border-gray-400 text-center">{cell}</td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-12 gap-x-6 mb-6">
                <div className="xl:col-span-6 col-span-12">
                    <Chart options={revenueChartOptions} series={revenueChartSeries} type="bar" height={350}/>
                </div>
                <div className="xl:col-span-6 col-span-12">
                    <Chart options={equityChartOptions} series={equityChartSeries} type="bar" height={350}/>
                </div>
            </div>
        </div>
    );
};

export default FinancialAnalysisResults;
