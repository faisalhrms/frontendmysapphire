import React, { useMemo } from "react";
import ApexChart from "@components/charts/ApexChart.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const OrdersBySourceChart = ({ data, loading }) => {
    const chartData = useMemo(() => {
        if (!data || !Array.isArray(data)) return { labels: [], series: [] };

        const labels = data.map(item => item.source_group);
        const series = data.map(item => parseInt(item.orders.toString().replace(/,/g, ""), 10));

        console.log(`this is label`, labels);
        console.log(`this is series`, series);

        return { labels, series };
    }, [data]);

    return (
        <div className="box  mt-4">
            <div className="box-header justify-between">
                <div className="box-title">Orders by Source Group</div>
            </div>
            <div className="box-body p-6">
                <div className="md:col-span-1">
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <ApexChart
                            chartType="donut"
                            height={250}
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
            </div>
            <div className="box-footer !p-0">
                <div className="grid grid-cols-12 justify-center">
                    {chartData.labels.map((label, index) => (
                        <div className="col-span-4 pe-0 text-center" key={index}>
                            <div className="sm:p-4 p-2">
                                <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem]">
                                    {label}
                                </span>
                                <span className="block text-[1rem] font-semibold">
                                    {chartData.series[index]}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrdersBySourceChart;
