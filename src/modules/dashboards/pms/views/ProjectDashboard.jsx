import ProjectStatusCard from "@modules/dashboards/pms/components/ProjectStatusCard.jsx";
import RecentProjectCard from "@modules/dashboards/pms/components/RecentProjectCard.jsx";
import React from "react";
import {useProjectDashboardStatistics} from "@modules/project-management/hooks/projectHooks.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import ProjectAnalysisCard from "@modules/dashboards/pms/components/ProjectAnalysisCard.jsx";
import ProjectTableCard from "@modules/dashboards/pms/components/ProjectTableCard.jsx";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import ProjectSummaryStats from "@modules/project-management/components/project/ProjectSummaryStats.jsx";
import ProjectUserSummaryStats from "@modules/project-management/components/project/ProjectUserSummaryStats.jsx";


const ProjectDashboard = () => {
    const { data, isLoading, refetch } = useProjectDashboardStatistics();
    return(
        <>
            <PageHeader currentpage="Project Dashboard" activepage="Dashboards" mainpage="Project Management System"/>
            {
                isLoading ?
                    <LoadingSpinner />
                    :
                    (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {data.statuses.map((item, index) => (
                                    <ProjectStatusCard
                                        key={index}
                                        item={item}
                                    />
                                ))}
                            </div>
                            <div className="grid grid-cols-12 gap-x-6">
                                <ProjectAnalysisCard
                                    data={data.monthly_series}
                                />
                                <RecentProjectCard
                                    projects={data.recent_projects}
                                />
                                <div className="xl:col-span-5 col-span-12">
                                    <ProjectSummaryStats summary={data.project_summary} statsFetching={isLoading} heading='Project Summary' />
                                </div>
                                <div className="xl:col-span-7 col-span-12">
                                    <ProjectUserSummaryStats summary={data.user_summary} statsFetching={isLoading}/>
                                </div>
                                <ProjectTableCard/>
                            </div>
                        </>
                    )
            }

        </>
    );
}

export default ProjectDashboard;
