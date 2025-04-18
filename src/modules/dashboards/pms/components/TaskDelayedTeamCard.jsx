import React, {useMemo} from 'react';
import ApexChart from "@components/charts/ApexChart.jsx";
import {mapSeriesToColors, statusColorMapping} from "@helpers/statusStyles.js";
import usePMSStatsDrillDown from "@modules/dashboards/pms/hooks/usePMSStatsDrillDown.js";
import {formatLabel} from "@helpers/formatters.js";
import TaskListModal from "@modules/project-management/components/model/TaskListModal.jsx";

const TaskDelayedTeamCard = ({ data, filters }) => {

    const { isTaskModalOpen, fetchData, tasks, loadingTasks, openTaskModal, closeTaskModal } = usePMSStatsDrillDown(
        'dashboard/pms/task/statistics/detail/',
        filters
    )

    const handlePointClick = async (event, chartContext, config) => {
        const {dataPointIndex} = config;
        await fetchData({
            type: 'delayed_by_team',
            category: data?.categories?.[dataPointIndex]
        });
    };

    return (
        <>
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">Delayed by team</div>
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

export default TaskDelayedTeamCard;
