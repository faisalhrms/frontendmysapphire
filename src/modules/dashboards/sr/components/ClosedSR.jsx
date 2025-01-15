import React, { useMemo } from "react";
import ApexChart from "@components/charts/ApexChart.jsx";
import { mapSeriesToColors, statusColorMapping } from "@helpers/statusStyles.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const ClosedSR = ({ summary = {}, statsFetching, heading = "Closed SR Summary" }) => {
    // Safeguard against missing categories or series
    const categories = summary?.categories || []; // Use categories for team_view
    const series = summary?.series || []; // Default to empty array if series are undefined

    // Use colors from mapping
    const colors = useMemo(() => {
        return mapSeriesToColors(categories, statusColorMapping);
    }, [categories]);

    return (
        <div className="box">
            <div className="box-header justify-between">
                <div className="box-title">{heading}</div>
            </div>
            <div className="box-body !p-0">
                {statsFetching ? (
                    <LoadingSpinner />
                ) : (
                    <div className="p-6 pb-2">
                        <ApexChart
                            chartType="donut"
                            height={250}
                            labels={categories} // Use categories dynamically
                            additionalOptions={{
                                legend: { position: "left" },
                                stroke: {
                                    curve: "smooth",
                                    lineCap: "round",
                                    colors: ["#fff"],
                                    width: 0,
                                    dashArray: 0,
                                },
                            }}
                            series={series} // Use the safe series variable
                        />
                    </div>
                )}
            </div>
            <div className="box-footer !p-0">
                <div className="grid grid-cols-12 justify-center">
                    {categories.map((category, index) => (
                        <div className="col-span-3 pe-0 text-center" key={index}>
                            <div className="sm:p-4 p-2">
                                <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem]">
                                    {category}
                                </span>
                                <span className="block text-[1rem] font-semibold">
                                    {series[index] || 0} {/* Safeguard against undefined series[index] */}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClosedSR;
