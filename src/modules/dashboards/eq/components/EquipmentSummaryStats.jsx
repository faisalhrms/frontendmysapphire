// src/modules/inventory/components/EquipmentSummaryStats.jsx

import React, { useMemo } from "react";
import ApexChart from "@components/charts/ApexChart.jsx";
import { mapSeriesToColors, statusColorMapping } from "@helpers/statusStyles.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import CountUp from "react-countup";

const EquipmentSummaryStats = ({ summary, statsFetching, heading = 'Asset Summary' }) => {
    // Transform the summary data into labels and series for the chart
    const chartData = useMemo(() => {
        const { total_equipments, ...statusCounts } = summary;
        const labels = Object.keys(statusCounts).map(key => {
            // Convert snake_case to Titlm,.e Case with spaces and replace "No Status" with "N/A"
            const formattedLabel = key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
            return formattedLabel === "No Status" ? "N/A" : formattedLabel;
        });
        const series = Object.values(statusCounts);
        return { labels, series };
    }, [summary]);

    // Generate colors based on the statusColorMapping
    const colors = useMemo(() => {
        return mapSeriesToColors(chartData.labels, statusColorMapping);
    }, [chartData.labels]);

    return (
        <div className="box">
            <div className="box-header justify-between">
                <div className="box-title">
                    {heading}
                </div>
            </div>
            <div className="box-body p-6">
                {/* Donut Chart */}
                <div className="md:col-span-1">
                    {statsFetching ? (
                        <LoadingSpinner />
                    ) : (
                        <ApexChart
                            colors={colors}
                            chartType='donut'
                            height={250}
                            labels={chartData.labels}
                            chartWidth='70%'
                            additionalOptions={{
                                legend: { position: 'left' },
                                stroke: {
                                    curve: 'smooth',
                                    lineCap: 'round',
                                    colors: ["#fff"],
                                    width: 2, // Increased stroke width for better visibility
                                    dashArray: 0
                                }
                            }}
                            series={chartData.series}
                        />
                    )}
                </div>


            </div>
            {/* Footer with Detailed Counts */}
            <div className="box-footer !p-0">
                <div className="grid grid-cols-12 justify-center">
                    {chartData.labels.map((label, index) => (
                        <div className="col-span-4 pe-0 text-center" key={index}>
                            <div className="sm:p-4 p-2">
                                <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem]">{label}</span>
                                <span className="block text-[1rem] font-semibold">{chartData.series[index]}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

};

export default EquipmentSummaryStats;
