import React from 'react';
import PropTypes from 'prop-types';
import ApexChart from "@components/charts/ApexChart.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import {useProjectMilestoneTaskDashboardStatistics} from "@modules/project-management/hooks/projectHooks.js";

const TasksStatsModal = React.memo(({ milestoneId, onClose }) => {

    const { data, isLoading } = useProjectMilestoneTaskDashboardStatistics(milestoneId);

    return (
        <>
            <div id='TaskStatsModal'
                 className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                 aria-modal="true"
                 role="dialog"
                 aria-labelledby="milestoneModalTitle">
                <div className="relative bg-white dark:bg-gray-800 w-full h-full mx-auto">
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
                        ) : data && data.categories && data.series ? (
                            <div className="flex-grow">
                                <ApexChart
                                    columnWidth="25%"
                                    additionalOptions={{
                                        legend: {position: 'top'},
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
                                    categories={data.categories}
                                    height={500}
                                    series={data.series}
                                    chartWidth={2000}
                                    xAxisTitle="Tasks"
                                    yAxisTitle="Progress"
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

        </>
    );
});

TasksStatsModal.propTypes = {
    onClose: PropTypes.func.isRequired,
    milestoneId: PropTypes.number.isRequired,
};

export default React.memo(TasksStatsModal);
