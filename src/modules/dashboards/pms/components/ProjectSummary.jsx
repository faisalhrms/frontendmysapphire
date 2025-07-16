import ProjectSummaryStats from "@modules/project-management/components/project/ProjectSummaryStats.jsx";
import React from "react";
import {useFetchWithFilters} from "@hooks/useFetchWithFilters.js";

const ProjectSummary = ({filters}) => {
    const { data, isLoading } = useFetchWithFilters(
        '/dashboard/pms/statistics/project-summary/', filters
    );
    return (
        <ProjectSummaryStats summary={data} statsFetching={isLoading} heading='Project Summary'/>
    )
}

export default ProjectSummary