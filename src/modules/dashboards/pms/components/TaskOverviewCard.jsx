import React, {useMemo} from 'react';
import ApexChart from "@components/charts/ApexChart.jsx";
import {mapSeriesToColors, statusColorMapping} from "@helpers/statusStyles.js";

const TaskOverviewCard = ({ data }) => {

    const colors = useMemo(() => {
        return mapSeriesToColors(data?.categories, statusColorMapping);
    }, [data?.categories]);

    return (
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">Overview</div>
                </div>
                <div className="box-body">
                    <div id="projectAnalysis">
                        <ApexChart
                            additionalOptions={{
                                grid: { show: true },
                                legend: { position: 'top' },
                                dataLabels: { enabled: true },
                                plotOptions: {
                                    bar: {
                                        distributed: true,
                                    },
                                },
                            }}
                            height={355}
                            colors={colors}
                            series={data?.series}
                            stacked={false}
                            categories={data?.categories}
                            baseWidthPerCategory={1}
                            chartWidth={400}
                        />
                    </div>
            </div>
        </div>
    );
};

export default TaskOverviewCard;
