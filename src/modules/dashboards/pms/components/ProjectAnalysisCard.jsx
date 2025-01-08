import React, {useMemo} from 'react';
import ApexChart from "@components/charts/ApexChart.jsx";
import {mapSeriesToColors, statusColorMapping} from "@helpers/statusStyles.js";

const ProjectAnalysisCard = ({ data }) => {

    const colors = useMemo(() => {
        return mapSeriesToColors(data?.series, statusColorMapping);
    }, [data?.series]);

    return (
        <div className="xl:col-span-8 col-span-12">
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">Project Analysis</div>
                </div>
                <div className="box-body">
                    <div id="projectAnalysis">
                        <ApexChart
                            additionalOptions={{
                                grid: { show: true },
                                legend: { position: 'top' }
                            }}
                            colors={colors}
                            columnWidth='90%'
                            height={355}
                            series={data.series}
                            categories={data.categories}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectAnalysisCard;
