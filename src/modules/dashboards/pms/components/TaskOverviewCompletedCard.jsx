import React from 'react';
import ApexChart from "@components/charts/ApexChart.jsx";
import usePMSStatsDrillDown from "@modules/dashboards/pms/hooks/usePMSStatsDrillDown.js";
import TaskListModal from "@modules/project-management/components/model/TaskListModal.jsx";

const TaskOverviewCompletedCard = ({ data, filters }) => {
    const { isTaskModalOpen, fetchData, tasks, loadingTasks, openTaskModal, closeTaskModal } = usePMSStatsDrillDown(
        'dashboard/pms/task/statistics/detail/',
        filters
    )

    const handlePointClick = async (event, chartContext, config) => {
        const {dataPointIndex} = config;
        await fetchData({
            type: 'timeline_group',
            category: data?.categories?.[dataPointIndex]
        });
    };
    return (
        <>
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">Overview Completed Task</div>
                </div>
                <div className="box-body">
                    <div id="projectAnalysis">
                        <ApexChart
                            additionalOptions={{
                                grid: {show: true},
                                dataLabels: {enabled: true},
                            }}
                            height={355}
                            series={data?.series}
                            stacked={false}
                            categories={data?.categories}
                            baseWidthPerCategory={1}
                            chartWidth={200}
                            onPointClick={handlePointClick}
                        />
                    </div>
                </div>
            </div>
            {
                isTaskModalOpen &&
                <TaskListModal
                    tasks={tasks}
                    isLoading={loadingTasks}
                    closeModal={closeTaskModal}
                />
            }
        </>
    );
};

export default TaskOverviewCompletedCard;
