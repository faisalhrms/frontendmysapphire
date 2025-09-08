// EquipmentPieChart.jsx
import React from "react";
import ReactApexChart from "react-apexcharts";

export const EquipmentPieChart = ({ data, labelKey = "name", valueKey = "count" }) => {
    const series = data?.map(item => item[valueKey] ?? 0) || [];

    const options = {
        labels: data?.map(item => item[labelKey] ?? "Unknown") || [],
        chart: {
            type: "pie",
            height: 300,
            events: {
                mounted: (chart) => chart.windowResizeHandler(),
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (_, opts) => {
                const val = series[opts.seriesIndex];
                return val > 0 ? val.toLocaleString() : "";
            },
            style: {
                fontSize: "14px",
                fontWeight: 600,
                colors: ["#495057"],
            },
            dropShadow: { enabled: false },
        },
        legend: {
            show: true,
            position: "bottom",
            labels: { colors: "#495057" },
            markers: { width: 12, height: 12, radius: 6 },
            itemMargin: { horizontal: 10, vertical: 5 },
        },
        stroke: { show: true, colors: ["#fff"], width: 1 },
        colors: [
            "rgb(132, 90, 223)",
            "rgb(35, 183, 229)",
            "rgb(245, 184, 73)",
            "rgb(34, 197, 94)",
            "rgb(239, 68, 68)",
            "rgb(149, 165, 166)",
            "rgb(211, 84, 0)",
        ],
    };

    return <ReactApexChart options={options} series={series} type="pie" height={300} />;
};
