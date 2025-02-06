import React, {useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import ApexChart from "@components/charts/ApexChart.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import TasksStatsModal from "@modules/dashboards/pms/components/TasksStatsModal.jsx";
import {mapSeriesToColors, statusColorMapping} from "@helpers/statusStyles.js";
import {useProjectMilestoneDashboardStatistics} from "@modules/project-management/hooks/projectHooks.js";

const MilestonesStatsModal = React.memo(({ projectId, onClose }) => {

    const { data, isLoading } = useProjectMilestoneDashboardStatistics(projectId);

    const colors = useMemo(() => {
        return mapSeriesToColors(data?.series, statusColorMapping);
    }, [data?.series]);

    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedMilestoneId, setSelectedMilestoneId] = useState(null);

    const handlePointClick = (event, chartContext, config) => {
        const { dataPointIndex } = config;
        const milestoneId = data.details[dataPointIndex]?.id;
        if (milestoneId) {
            setSelectedMilestoneId(milestoneId);
            setIsTaskModalOpen(true);
        }
    };

    const closeTaskModal = () => {
        setIsTaskModalOpen(false);
        setSelectedMilestoneId(null);
    };

    return (
        <>
            <div id='milestoneStatsModal'
                 className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                 aria-modal="true"
                 role="dialog"
                 aria-labelledby="milestoneModalTitle">
                <div className="relative bg-white dark:bg-gray-800 w-full h-full max-w-7xl mx-auto">
                    <div className="flex justify-end p-4">
                        <button
                            onClick={onClose}
                            type="button"
                            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
                            aria-label="Close modal"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-col h-full p-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center flex-grow">
                                <LoadingSpinner/>
                            </div>
                        ) : data ? (
                            <div className="flex-grow">
                                <ApexChart
                                    columnWidth="25%"
                                    additionalOptions={{
                                        legend: {position: 'top'},
                                        plotOptions: {
                                            bar: {
                                                colors: {
                                                    ranges: [{
                                                        from: -100,
                                                        to: -0,
                                                        color: '#ebeff5'
                                                    }]
                                                }
                                            }
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            formatter: function (val) {
                                                return `${val}%`;
                                            },
                                        },
                                        chart: {
                                            toolbar: {
                                                show: true,
                                            },
                                        },
                                    }}
                                    colors={colors}
                                    categories={data.categories}
                                    height={500}
                                    series={data.series}
                                    xAxisTitle="Milestones"
                                    onPointClick={handlePointClick}
                                />
                            </div>

                        ) : (
                            <div className="flex justify-center items-center flex-grow">
                                <p>No milestone details available.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isTaskModalOpen && selectedMilestoneId && (
                <TasksStatsModal
                    onClose={closeTaskModal}
                    milestoneId={selectedMilestoneId}
                />
            )}

        </>
    );
});

MilestonesStatsModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    projectId: PropTypes.number.isRequired
};

export default React.memo(MilestonesStatsModal);
