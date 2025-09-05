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
            parentHeightOffset: 0,
        },
        stroke: {
            curve: "smooth",
            width: 4,
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
            tickPlacement: "on",
            labels: {
                style: { fontSize: "9px", fontWeight: 600 },
                offsetX: 0,
                rotate: -45,
                rotateAlways: true,
                trim: false,
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
            },
        },
        dataLabels: { enabled: false },
        colors: ["#845adf"],
    };

    return (
        <div className="xl:col-span-8 col-span-12">
            <div className="box overflow-x-auto">
                <div className="box-body min-w-[800px]"> 
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
