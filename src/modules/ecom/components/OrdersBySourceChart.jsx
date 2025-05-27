import React, { useMemo } from "react";
import ApexChart from "@components/charts/ApexChart.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import {formatAmountWithCommas} from "../../../helpers/formatters.js";

const OrdersBySourceChart = ({ data, loading }) => {

    const chartDataOrders = useMemo(() => {
        if (!data || !Array.isArray(data)) return { labels: [], series: [] };

        const labels = data.map(item => item.source_group);
        const series = data.map(item => parseInt(item.orders.toString().replace(/,/g, ""), 10));

        return { labels, series };
    }, [data]);

    const chartDataMerchandiseTotal = useMemo(() => {
        if (!data || !Array.isArray(data)) return { labels: [], series: [] };

        const labels = data.map(item => item.source_group);
        const series = data.map(item => parseInt(item.merchandise_total.toString().replace(/,/g, ""), 10));

        return { labels, series };
    }, [data]);

    return (
        <div className="grid grid-cols-12 gap-x-6 mt-4">
            {/* Orders Chart */}
            <div className="xl:col-span-6 col-span-12">
                <div className="box">
                    <div className="box-header justify-between">
                        <div className="box-title">
                            Orders by Source Group
                        </div>
                    </div>
                    <div className="box-body !p-0">
                        {loading ? (
                            <LoadingSpinner/>
                        ) : (
                            <div className="p-6 pb-2">
                                <ApexChart
                                    chartType="donut"
                                    chartWidth={200}
                                    height={300}
                                    labels={chartDataOrders.labels}
                                    series={chartDataOrders.series}
                                    additionalOptions={{
                                        legend: { position: "left" },
                                        stroke: {
                                            curve: "smooth",
                                            lineCap: "round",
                                            colors: ["#fff"],
                                            width: 2,
                                        },
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="box-footer !p-0">
                        <div className="grid grid-cols-12 justify-center">
                            {chartDataOrders.labels.map((label, index) => (
                                <div className="col-span-2 pe-0 text-center" key={index}>
                                    <div className="sm:p-4 p-2">
                                        <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem]">{label}</span>
                                        <span className="block text-[1rem] font-semibold">{formatAmountWithCommas(chartDataOrders.series[index])}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Merchandise Total Chart */}
            <div className="xl:col-span-6 col-span-12">
                <div className="box">
                    <div className="box-header justify-between">
                        <div className="box-title">
                            Merchandise Total by Source Group
                        </div>
                    </div>
                    <div className="box-body !p-0">
                        {loading ? (
                            <LoadingSpinner/>
                        ) : (
                            <div className="p-6 pb-2">
                                <ApexChart
                                    chartType="donut"
                                    chartWidth={200}
                                    height={300}
                                    labels={chartDataMerchandiseTotal.labels}
                                    series={chartDataMerchandiseTotal.series}
                                    additionalOptions={{
                                        legend: { position: "left" },
                                        stroke: {
                                            curve: "smooth",
                                            lineCap: "round",
                                            colors: ["#fff"],
                                            width: 2,
                                        },
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <div className="box-footer !p-0">
                        <div className="grid grid-cols-12 justify-center">
                            {chartDataMerchandiseTotal.labels.map((label, index) => (
                                <div className="col-span-2 pe-0 text-center" key={index}>
                                    <div className="sm:p-4 p-2">
                                        <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem]">{label}</span>
                                        <span className="block text-[1rem] font-semibold">{formatAmountWithCommas(chartDataMerchandiseTotal.series[index])}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersBySourceChart;
