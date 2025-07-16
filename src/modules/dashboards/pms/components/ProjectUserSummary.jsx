import React from "react";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";
import ProjectUserSummaryStats from "@modules/project-management/components/project/ProjectUserSummaryStats.jsx";

const ProjectUserSummary = ({filters}) => {
    const { data, isLoading } = useFetchWithFilters(
        '/dashboard/pms/statistics/user-summary/', filters
    );
    return (
        <ProjectUserSummaryStats summary={data} statsFetching={isLoading}/>
    )
}

export default ProjectUserSummary