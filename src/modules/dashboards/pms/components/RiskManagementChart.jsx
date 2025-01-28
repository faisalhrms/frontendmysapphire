import React, {useMemo} from 'react';
import ApexChart from "@components/charts/ApexChart.jsx";
import {mapSeriesToColors, statusColorMapping} from "@helpers/statusStyles.js";

const RiskAnalysisChart = ({ data }) => {

    const colors = useMemo(() => {
        return mapSeriesToColors(data?.series, statusColorMapping);
    }, [data?.series]);

    return (
        <div className="xl:col-span-12 col-span-12">
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">Risk Analysis</div>
                </div>
                <div className="box-body">
                    <div id="projectAnalysis">
                        <ApexChart
                            columnWidth="50%"
                            additionalOptions={{
                                legend: { position: 'top' },
                            }}
                            colors={colors}
                            categories={data.categories}
                            height={500}
                            series={data.series}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskAnalysisChart;
