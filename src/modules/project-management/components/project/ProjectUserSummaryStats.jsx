import React, {useMemo} from "react";

import ApexChart from "@components/charts/ApexChart.jsx";
import {mapSeriesToColors, statusColorMapping,} from "@helpers/statusStyles.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const ProjectUserSummaryStats = ({summary, statsFetching, height = 315}) => {

    const colors = useMemo(() => {
        return mapSeriesToColors(summary?.series, statusColorMapping);
    }, []);

    return (
        <div className="box">
            <div className="box-header justify-between">
                <div className="box-title">Resource Planning Summary</div>
            </div>
            <div className="box-body !p-0">
                {statsFetching ? (<LoadingSpinner/>) : (<div className="p-6 pb-2">
                        <ApexChart
                            colors={colors}
                            height={height}
                            columnWidth='80%'
                            categories={summary.categories}
                            series={summary.series}
                            stacked={false}
                            additionalOptions={{
                                stroke: {
                                    width: 2,
                                }
                            }}
                            baseWidthPerCategory={200}
                        />
                    </div>)}
            </div>
        </div>);
};

export default ProjectUserSummaryStats;
