import React, {useMemo} from 'react';
import ApexChart from "@components/charts/ApexChart.jsx";
import {mapSeriesToColors, statusColorMapping} from "@helpers/statusStyles.js";
import usePMSStatsDrillDown from "@modules/dashboards/pms/hooks/usePMSStatsDrillDown.js";
import TaskListModal from "@modules/project-management/components/model/TaskListModal.jsx";
import {formatLabel} from "@helpers/formatters.js";

const TaskOverviewCard = ({ data, filters }) => {

    const colors = useMemo(() => {
        return mapSeriesToColors(data?.categories, statusColorMapping);
    }, [data?.categories]);

    const { isTaskModalOpen, fetchData, tasks, loadingTasks, openTaskModal, closeTaskModal } = usePMSStatsDrillDown(
        'dashboard/pms/task/statistics/detail/',
        filters
    )

    const handlePointClick = async (event, chartContext, config) => {
        const {dataPointIndex} = config;
        await fetchData({
            type: 'overview',
            category: formatLabel(data?.categories?.[dataPointIndex])
        });
    };

    return (
        <>
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">Overview</div>
                </div>
                <div className="box-body">
                    <div id="projectAnalysis">
                        <ApexChart
                            additionalOptions={{
                                grid: {show: true},
                                legend: {position: 'top'},
                                dataLabels: {enabled: true},
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

export default TaskOverviewCard;
