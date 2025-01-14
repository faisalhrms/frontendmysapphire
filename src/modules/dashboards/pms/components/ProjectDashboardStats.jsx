import LoadingSpinner from "@components/LoadingSpinner.jsx";
import ProjectStatusCard from "@modules/dashboards/pms/components/ProjectStatusCard.jsx";
import ProjectAnalysisCard from "@modules/dashboards/pms/components/ProjectAnalysisCard.jsx";
import RecentProjectCard from "@modules/dashboards/pms/components/RecentProjectCard.jsx";
import ProjectSummaryStats from "@modules/project-management/components/project/ProjectSummaryStats.jsx";
import ProjectUserSummaryStats from "@modules/project-management/components/project/ProjectUserSummaryStats.jsx";
import ProjectTableCard from "@modules/dashboards/pms/components/ProjectTableCard.jsx";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import React from "react";

const ProjectDashboardStats = ({filters}) => {
    const {data, isLoading} = useFetchWithFilters('/dashboard/pms/statistics/', filters);
    if (isLoading) {
        return <LoadingSpinner/>;
    }
    return (
            <>
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {data.statuses.map((item, index) => (<ProjectStatusCard
                            key={index}
                            item={item}
                        />))}
                </div>
                <div className="grid grid-cols-12 gap-x-6">
                    <ProjectAnalysisCard
                        data={data.monthly_series}
                    />
                    <RecentProjectCard
                        projects={data.recent_projects}
                    />
                    <div className="xl:col-span-5 col-span-12">
                        <ProjectSummaryStats summary={data.project_summary} statsFetching={isLoading}
                                             heading='Project Summary'/>
                    </div>
                    <div className="xl:col-span-7 col-span-12">
                        <ProjectUserSummaryStats summary={data.user_summary} statsFetching={isLoading}/>
                    </div>
                    <ProjectTableCard/>
                </div>
            </>
        )
}

export default React.memo(ProjectDashboardStats)