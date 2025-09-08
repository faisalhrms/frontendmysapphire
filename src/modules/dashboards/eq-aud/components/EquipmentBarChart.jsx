// EquipmentBarChart.jsx
import React from "react";
import ReactApexChart from "react-apexcharts";

export const EquipmentBarChart = ({ data, labelKey = "name", valueKey = "count" }) => {
    const categories = data.map(item => item[labelKey] ?? "Unknown");
    const values = data.map(item => item[valueKey] ?? 0);

    const chartWidth = categories.length * 160;

    const departmentColors = [
        "#4A90E2",
        "#F5A623",
        "#7B68EE",
        "#F8E71C",
        "#E74C3C",
        "#2ECC71",
        "#9B59B6",
    ];

    const options = {
        chart: {
            height: 370,
            type: "bar",
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "50%",
                borderRadius: 4,
                distributed: true,
                dataLabels: {
                    position: "top",
                },
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => (val > 0 ? val.toLocaleString() : ""),
            offsetY: -20,
            style: {
                fontSize: "11px",
                fontWeight: "bold",
                colors: ["#495057"],
            },
        },
        xaxis: {
            categories,
            labels: {
                rotate: 0,
                trim: false,
                style: {
                    fontSize: "10px",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    lineHeight: "1.1rem",
                    maxWidth: 500,
                },
            },
        },
        yaxis: {
            tickAmount: 5,
        },
        colors: departmentColors,
        legend: { show: false },
        grid: {
            borderColor: "#f1f1f1",
            strokeDashArray: 4,
            padding: { top: 30, bottom: 60 },
        },
    };

    return (
        <div style={{ overflowX: "auto", width: "100%" }}>
            <div style={{ minWidth: chartWidth }}>
                <ReactApexChart
                    options={options}
                    series={[{ name: "Count", data: values }]}
                    type="bar"
                    height={370}
                />
            </div>
        </div>
    );
};
