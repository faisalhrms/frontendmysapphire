// import ReactApexChart from "react-apexcharts";
// import { formatAmountWithCommas } from "@helpers/formatters.js"; // Ensure this is the correct path for the formatter
//
// export const BasiclineChart = ({ data }) => {
//     const series = [
//         {
//             name: 'Total Cost',
//             data: data.map(item => item.total_cost || 0),
//         },
//     ];
//
//     const options = {
//         chart: {
//             height: 320,
//             type: 'line',
//         },
//         xaxis: {
//             categories: data.map(item => item.department),
//             labels: { style: { fontSize: '11px', fontWeight: 600 } },
//         },
//         yaxis: {
//             labels: {
//                 style: { fontSize: '11px', fontWeight: 600 },
//                 formatter: (value) => formatAmountWithCommas(value), // Format the y-axis values
//             },
//         },
//         colors: ['#845adf'],
//         dataLabels: { enabled: false },
//         stroke: { curve: 'straight', width: 3 },
//         grid: { borderColor: '#f2f5f7' },
//     };
//
//     return <ReactApexChart options={options} series={series} type="line" height={320} />;
// };


import React from "react";
import ReactApexChart from "react-apexcharts";

export const BasiclineChart = ({ data }) => {
    const categories = data.map(item => item.department);
    const values = data.map(item => item.total_cost || 0);

    const chartData = {
        series: [{ name: "Total Cost", data: values }],
        categories,
    };

    const options = {
        chart: {
            type: "line",
            height: 350,
            toolbar: { show: false },
            animations: { enabled: false },
            zoom: { enabled: false },
            offsetX: 20,
        },
        stroke: { curve: "smooth", width: 4 },
        markers: {
            size: 4,
            colors: ["#845adf"],
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: { size: 6 },
        },xaxis: {
            categories: chartData.categories,
            labels: {
                style: { fontSize: "12px", fontWeight: 600 },
                offsetX: 15,
            },
            tickPlacement: "on",
        },

        yaxis: {
            min: 0,
            forceNiceScale: true,
            labels: {
                style: { fontSize: "12px", fontWeight: 600 },
                formatter: val => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toFixed(0)),
            },
        },
        grid: { borderColor: "#e0e0e0", strokeDashArray: 0 },
        dataLabels: { enabled: false },
        colors: ["#845adf"],
    };

    return (
        <div className="xl:col-span-8 col-span-12">
            <div className="box overflow-x-auto">
                <div className="box-body min-w-[1200px]"> {/* wider chart to allow scroll */}
                    <ReactApexChart
                        options={options}
                        series={chartData.series}
                        type="line"
                        height={350}
                    />
                </div>
            </div>
        </div>
    );
};
