import React from "react";
import ReactApexChart from "react-apexcharts";

export const BasiclineChart = ({ data }) => {
    const categories = data.map(item => item.department);
    const values = data.map(item => item.total_cost || 0);

    const chartData = {
        series: [
            {
                name: "Total Cost",
                data: values,
            },
        ],
        categories,
    };

    const options = {
        chart: {
            type: "line",
            height: 350,
            toolbar: { show: false },
            animations: { enabled: false },
            zoom: { enabled: false },
            parentHeightOffset: 20,
        },
        stroke: {
            curve: "smooth",
            width: 6,
        },
        markers: {
            size: 4,
            colors: ["#845adf"],
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: { size: 6 },
        },
        xaxis: {
            categories: chartData.categories,
            tickPlacement: "between",
            labels: {
                rotate: 0, // straight labels
                trim: false, // don’t cut text
                style: {
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: 1,
                    lineHeight: 1.8,
                },
                formatter: (val) => val,
            },
        },
        yaxis: {
            min: 0,
            forceNiceScale: true,
            labels: {
                style: { fontSize: "12px", fontWeight: 600 },
                formatter: (val) =>
                    val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toFixed(0),
            },
        },
        grid: {
            borderColor: "#e0e0e0",
            strokeDashArray: 0,
            padding: {
                left: 20,
                right: 20,
                bottom: 20,
            },
        },
        dataLabels: { enabled: false },
        colors: ["#845adf"],
    };

    return (
        <div className="xl:col-span-8 col-span-12">
            <div className="box overflow-x-auto">
                <div
                    className="box-body"
                    style={{ minWidth: `${chartData.categories.length * 200}px` }}
                >
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
