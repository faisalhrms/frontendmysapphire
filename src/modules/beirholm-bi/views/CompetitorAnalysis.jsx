import React from "react";
import { useForm } from "react-hook-form";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import { competitorData } from "@modules/beirholm-bi/services/competitorData.js";
import Chart from "react-apexcharts";

const companyOptions = [
    { label: "Faisal Spinning Mills", value: "FAISAL_SPINNING" },
    { label: "Gul Ahmed Textile Mills", value: "GUL_AHMED" },
    { label: "J.K. Spinning Mills", value: "JK_SPINNING" },
    { label: "Kohinoor Mills Limited", value: "KOHINOOR_MILLS" },
    { label: "Sapphire Textile Mills", value: "SAPPHIRE_TEXTILE" }
];

const filterOptions = [
    { label: "Financial Analysis", value: "financialAnalysis" },
    { label: "Infrastructure", value: "infrastructure" },
    { label: "Sustainability", value: "sustainability" }
];

const currencyOptions = [
    { label: "PKR", value: "PKR" },
    { label: "EUR", value: "EUR" }
];

const CompetitorAnalysis = () => {
    const { control, watch, formState: { errors } } = useForm({
        defaultValues: {
            filter: "financialAnalysis",
            company: "FAISAL_SPINNING",
            currency: "PKR"
        }
    });

    const selectedFilter = watch("filter");
    const selectedCompany = watch("company");
    const selectedCurrency = watch("currency");

    if (!competitorData[selectedCompany]) {
        return <div>Invalid company selection.</div>;
    }

    let tableTitle;
    let tableHeaders = [];
    let tableData = [];
    let ratioHeaders = [];
    let ratioData = [];

    if (selectedFilter === "financialAnalysis") {
        const analysis = competitorData[selectedCompany].financialAnalysis;
        tableTitle = analysis.title;
        tableHeaders = analysis.headers;
        tableData = analysis.values[selectedCurrency] || [];
        ratioHeaders = analysis.ratios.headers;
        ratioData = analysis.ratios.data;
    } else {
        const analysis = competitorData[selectedCompany][selectedFilter];
        tableTitle = analysis.title;
        tableHeaders = analysis.headers;
        tableData = analysis.data;
    }

    const chartData = competitorData[selectedCompany]?.financialAnalysis?.values[selectedCurrency] || [];
    const years = tableHeaders.slice(2);

    const convertToMillions = (arr) => {
        return arr
            ? arr.slice(2).map(value => Number(value.replace(/,/g, "")) / 1_000_000)
            : [];
    };

    const revenue = convertToMillions(chartData.find(row => row[0] === "Revenue"));
    const grossProfit = convertToMillions(chartData.find(row => row[0] === "Gross Profit"));
    const profitAfterTax = convertToMillions(chartData.find(row => row[0] === "Profit After Tax"));

    const equity = convertToMillions(chartData.find(row => row[0] === "Equity"));
    const currentLiabilities = convertToMillions(chartData.find(row => row[0] === "Current Liabilities"));
    const nonCurrentLiabilities = convertToMillions(chartData.find(row => row[0] === "Non-Current Liabilities"));

    const revenueChartOptions = {
        chart: { type: "bar", height: 350 },
        xaxis: { categories: years },
        yaxis: { title: { text: `Value (Million) in ${selectedCurrency}` } },
        tooltip: { shared: true, intersect: false },
        stroke: { width: [0, 2, 2], curve: "smooth" },
        colors: ["#3b82f6", "#22c55e", "#f97316"]
    };

    const revenueChartSeries = [
        { name: "Revenue", type: "column", data: revenue },
        { name: "Gross Profit", type: "line", data: grossProfit },
        { name: "Profit After Tax", type: "line", data: profitAfterTax }
    ];

    const equityChartOptions = {
        chart: { type: "bar", height: 350, stacked: true },
        plotOptions: {
            bar: { horizontal: true }
        },
        xaxis: {
            categories: years,
            labels: { style: { fontSize: "12px" } }
        },
        yaxis: {
            title: { text: `Value (Million) in ${selectedCurrency}` },
            labels: { style: { fontSize: "12px" } }
        },
        tooltip: { shared: true, intersect: false },
        colors: ["#374151", "#6B7280", "#1E3A8A"]
    };

    const equityChartSeries = [
        { name: "Equity", data: equity },
        { name: "Current Liabilities", data: currentLiabilities },
        { name: "Non-Current Liabilities", data: nonCurrentLiabilities }
    ];

    return (
        <>
        <PageHeader currentpage="Competitor Analysis" mainpage="Competitor Analysis"/>
        <div className="bg-white p-4 shadow-md rounded-lg mb-6">
            <div className="flex space-x-4 mb-4">
                <div className="w-1/3">
                    <FormSelect name="filter" isClearable={false} control={control} errors={errors}
                                options={filterOptions} placeholder="Select Analysis Type"/>
                </div>
                <div className="w-1/3">
                    <FormSelect name="company" isClearable={false} control={control} errors={errors}
                                options={companyOptions} placeholder="Select Company"/>
                </div>
                <div className="w-1/3">
                    <FormSelect name="currency" control={control} errors={errors} options={currencyOptions}
                                placeholder="Select Currency"/>
                </div>
            </div>

            <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-3 text-lg font-semibold text-gray-900 border-b bg-gray-100 text-left">
                    {tableTitle}
                </div>
                <div className="w-full flex justify-center items-center">
                    <table className="w-full table-fixed border-collapse">
                        <thead style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
                        <tr className="custom-table-header">
                            {tableHeaders.map((header, index) => (
                                <th key={index} className="p-2 border border-gray-400 text-center">{header}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="text-gray-800">
                        {tableData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="p-2 border border-gray-400 text-center">{cell}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden mt-6">
                <div className="p-3 text-lg font-semibold text-gray-900 border-b bg-gray-100 text-left">
                    Financial Ratios
                </div>
                <div className="w-full flex justify-center items-center">
                    <table className="w-full table-fixed border-collapse">
                        <thead style={{ backgroundColor: "rgba(30, 58, 138, 0.85)", color: "white" }}>
                        <tr className="custom-table-header">
                            {ratioHeaders.map((header, index) => (
                                <th key={index} className="p-2 border border-gray-400 text-center">{header}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="text-gray-800">
                        {ratioData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex} className="p-2 border border-gray-400 text-center">{cell}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

             <div className="grid grid-cols-12 gap-x-6 mt-6">
                <div className="xl:col-span-6 col-span-12">
                    <Chart options={revenueChartOptions} series={revenueChartSeries} type="line" height={350} />
                </div>
                <div className="xl:col-span-6 col-span-12">
                    <Chart options={equityChartOptions} series={equityChartSeries} type="bar" height={350} />
                </div>
            </div>
        </div>
        </>
    );
};

export default CompetitorAnalysis;
