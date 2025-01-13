import React, { useMemo } from "react";

import ApexChart from "@components/charts/ApexChart.jsx";
import { mapSeriesToColors, statusColorMapping } from "@helpers/statusStyles.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const ClosedSR = ({ summary, statsFetching, heading = "Closed SR Summary" }) => {
    // Use colors from mapping
    const colors = useMemo(() => {
        return mapSeriesToColors(summary?.labels, statusColorMapping);
    }, [summary?.labels]);

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
                            labels={summary.labels}
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
                            series={summary.series}
                        />
                    </div>
                )}
            </div>
            <div className="box-footer !p-0">
                <div className="grid grid-cols-12 justify-center">
                    {summary?.labels.map((label, index) => (
                        <div className="col-span-3 pe-0 text-center" key={index}>
                            <div className="sm:p-4 p-2">
                                <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem]">
                                    {label}
                                </span>
                                <span className="block text-[1rem] font-semibold">
                                    {summary.series[index]}
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
