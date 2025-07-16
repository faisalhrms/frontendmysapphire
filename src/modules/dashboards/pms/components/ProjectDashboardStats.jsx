import LoadingSpinner from "@components/LoadingSpinner.jsx";
import ProjectStatusCard from "@modules/dashboards/pms/components/ProjectStatusCard.jsx";
import ProjectAnalysisCard from "@modules/dashboards/pms/components/ProjectAnalysisCard.jsx";
import RecentProjectCard from "@modules/dashboards/pms/components/RecentProjectCard.jsx";
import ProjectSummaryStats from "@modules/project-management/components/project/ProjectSummaryStats.jsx";
import ProjectUserSummaryStats from "@modules/project-management/components/project/ProjectUserSummaryStats.jsx";
import ProjectTableCard from "@modules/dashboards/pms/components/ProjectTableCard.jsx";
import React from "react";
import RiskAnalysisChart from "@modules/dashboards/pms/components/RiskManagementChart.jsx";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import ProjectSummary from "@modules/dashboards/pms/components/ProjectSummary.jsx";
import ProjectUserSummary from "@modules/dashboards/pms/components/ProjectUserSummary.jsx";

const ProjectDashboardStats = ({isActive, filters}) => {
    if (!isActive){
        return null
    }
    const { data: statuses, isLoading } = useFetchWithFilters(
        '/dashboard/pms/statistics/statuses/', filters
    );
    if (isLoading) {
        return <LoadingSpinner/>;
    }
    return (
            <>
                <div
                    className="grid grid-cols-3 gap-4">
                    {statuses.map((item, index) => (
                        <ProjectStatusCard
                            key={index}
                            item={item}
                        />))}
                </div>
                <div className="grid grid-cols-12 gap-x-6 mt-6">
                    <ProjectAnalysisCard filters={filters} />
                    <RecentProjectCard filters={filters} />
                    <div className="xl:col-span-5 col-span-12">
                        <ProjectSummary />
                    </div>
                    <div className="xl:col-span-7 col-span-12">
                        <ProjectUserSummary filters={filters} />
                    </div>
                        <RiskAnalysisChart filters={filters} />
                        <ProjectTableCard filters={filters} />
                    </div>
                </>
                )
          }
export default React.memo(ProjectDashboardStats)