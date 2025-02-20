
import React, { useMemo } from "react";
import ApexChart from "@components/charts/ApexChart.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const OrdersBySourceChart = ({ data, loading }) => {
    const chartData = useMemo(() => {
        if (!data || !Array.isArray(data)) return { labels: [], series: [] };

        const labels = data.map(item => item.source_group);
        const series = data.map(item => parseInt(item.orders.toString().replace(/,/g, ""), 10));

        return { labels, series };
    }, [data]);

    return (
        <div className="bg-white shadow rounded-lg p-4 w-64 md:w-3/5 mt-4 ">
            <div className="flex justify-between items-center mb-4">
                <div className="font-semibold text-lg">Orders by Source Group</div>
            </div>

            <div className="flex justify-center">
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <ApexChart
                        chartType="donut"
                        height={200}
                        labels={chartData.labels}
                        series={chartData.series}
                        additionalOptions={{
                            legend: { position: "bottom" },
                            stroke: {
                                curve: "smooth",
                                lineCap: "round",
                                colors: ["#fff"],
                                width: 2,
                            },
                        }}
                    />
                )}
            </div>


            <div className="grid grid-cols-5 gap-2 mt-4 text-center">
                {chartData.labels.map((label, index) => (
                    <div key={index} className="p-2">
                        <span className="text-gray-500 text-xs">{label}</span>
                        <span className="block text-lg font-semibold">{chartData.series[index]}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersBySourceChart;
