import React from 'react';
import ApexChart from "@components/charts/ApexChart.jsx";

const TaskOverviewCompletedCard = ({ data }) => {

    return (
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">Overview Completed Task</div>
                </div>
                <div className="box-body">
                    <div id="projectAnalysis">
                        <ApexChart
                            additionalOptions={{
                                grid: { show: true },
                                dataLabels: { enabled: true },
                            }}
                            height={355}
                            series={data?.series}
                            stacked={false}
                            categories={data?.categories}
                            baseWidthPerCategory={1}
                            chartWidth={200}
                        />
                    </div>
            </div>
        </div>
    );
};

export default TaskOverviewCompletedCard;
