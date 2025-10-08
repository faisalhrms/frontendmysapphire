import LoadingSpinner from "@components/LoadingSpinner.jsx";
import ProjectSummaryStats from "@modules/project-management/components/project/ProjectSummaryStats.jsx";
import ProjectTaskStatusStats from "@modules/project-management/components/project/ProjectTaskStatusStats.jsx";
import ProjectTaskMonthlyStats from "@modules/project-management/components/project/ProjectTaskMonthlyStats.jsx";
import React from "react";
import ProjectUserSummaryStatsReChart
    from "@modules/project-management/components/project/ProjectUserSummaryStatsReChart.jsx";

const ProjectOverviewTab = ({statsFetching, statistics}) => {
    return(
        <>
            {statsFetching ? (
                <LoadingSpinner />
            ) : statistics?.month_over_month ? (
                <>
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-3">
                            <div className="box !mb-0 border border-success !bg-success/10">
                                <div className="box-body !pb-[0.9rem]">
                                    <div className="flex items-start">
                                        <div className="me-4 gap-0">
                                            <div
                                                className="svg-icon-background bg-success text-white !fill-success me-3">
                                                <i className="bi bi-check-circle text-lg"></i>
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex mb-1 items-start justify-between"><h5
                                                className="font-semibold mb-0 leading-none text-[1.25rem]">{statistics?.last_7_days?.completed} completed</h5>
                                            </div>
                                            <p className="mb-0 text-[0.625rem] opacity-[0.7] text-[#8c9097] dark:text-white/50 font-semibold uppercase">in
                                                the last 7 days</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-3">
                            <div className="box !mb-0 border border-info !bg-info/10">
                                <div className="box-body !pb-[0.9rem]">
                                    <div className="flex items-start">
                                        <div className="me-4 gap-0">
                                            <div
                                                className="svg-icon-background bg-info text-white !fill-info me-3">
                                                <i className="bi bi-pencil-square text-lg"></i>
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex mb-1 items-start justify-between"><h5
                                                className="font-semibold mb-0 leading-none text-[1.25rem]">{statistics?.last_7_days?.updated} updated</h5>
                                            </div>
                                            <p className="mb-0 text-[0.625rem] opacity-[0.7] text-[#8c9097] dark:text-white/50 font-semibold uppercase">in
                                                the last 7 days</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-3">
                            <div className="box !mb-0 border border-primary !bg-primary/10">
                                <div className="box-body !pb-[0.9rem]">
                                    <div className="flex items-start">
                                        <div className="me-4 gap-0">
                                            <div
                                                className="svg-icon-background bg-primary text-white !fill-primary me-3">
                                                <i className="bi bi-clipboard2-check text-lg"></i>
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex mb-1 items-start justify-between"><h5
                                                className="font-semibold mb-0 leading-none text-[1.25rem]">{statistics?.last_7_days?.created} created</h5>
                                            </div>
                                            <p className="mb-0 text-[0.625rem] opacity-[0.7] text-[#8c9097] dark:text-white/50 font-semibold uppercase">in
                                                the last 7 days</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-3">
                            <div className="box !mb-0 border border-red !bg-red/10">
                                <div className="box-body !pb-[0.9rem]">
                                    <div className="flex items-start">
                                        <div className="me-4 gap-0">
                                            <div
                                                className="svg-icon-background bg-red text-white !fill-red me-3">
                                                <i className="bi bi-calendar-x text-lg"></i>
                                            </div>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex mb-1 items-start justify-between"><h5
                                                className="font-semibold mb-0 leading-none text-[1.25rem]">{statistics?.last_7_days?.due_soon} due soon</h5>
                                            </div>
                                            <p className="mb-0 text-[0.625rem] opacity-[0.7] text-[#8c9097] dark:text-white/50 font-semibold uppercase">in
                                                the next 7 days</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="xl:col-span-9 sm:col-span-9 2xl:col-span-8 col-span-12">
                            <ProjectUserSummaryStatsReChart
                                summary={statistics.user_summary}
                                statsFetching={statsFetching}
                                height={450}
                            />
                            <ProjectSummaryStats
                                summary={statistics.task_summary}
                                statsFetching={statsFetching}
                                height={385}
                            />
                        </div>

                        <div className="xl:col-span-3 sm:col-span-3 2xl:col-span-4 col-span-12">
                            <div className="bg-white shadow-md rounded-lg mb-4">
                                <ProjectTaskStatusStats
                                    monthOverMonth={statistics?.month_over_month}
                                    statsFetching={statsFetching}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12">
                            <ProjectTaskMonthlyStats
                                months={statistics.n_months}
                                statsFetching={statsFetching}
                            />
                        </div>
                    </div>
                </>
            ) : null}
        </>
    )
}
export default ProjectOverviewTab