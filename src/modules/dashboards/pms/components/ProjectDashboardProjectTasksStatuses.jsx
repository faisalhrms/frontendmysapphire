import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useFetchWithFilters } from "@hooks/useFetchWithFilters.js";
import React from "react";
import TagsTableWrapper from "@modules/dashboards/pms/components/TagsTableWrapper.jsx";
import PrioritiesTable from "@modules/dashboards/pms/components/PrioritiesTableWrapper.jsx";
import TeamsTableWrapper from "@modules/dashboards/pms/components/TeamsTableWrapper.jsx";

const ProjectDashboardProjectTasksStatuses = ({ filters }) => {
    const { data, isLoading } = useFetchWithFilters('/dashboard/pms/project/tasks/statuses/', filters);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const postGoLiveIssueStatus = data?.post_go_live_issue_status?.by_priorities || {};
    const postGoLiveIssueStatusByTeam = data?.post_go_live_issue_status?.by_teams || {};
    const postGoLiveIssueStatusByTags = data?.post_go_live_issue_status?.by_tags || {};
    const statuses = postGoLiveIssueStatusByTags?.statuses || [];

    return (
        <div>
            <PrioritiesTable data={postGoLiveIssueStatus} statuses={statuses} />
            <TeamsTableWrapper data={postGoLiveIssueStatusByTeam} statuses={statuses} />
            <TagsTableWrapper byTags={postGoLiveIssueStatusByTags?.tags} statuses={statuses} />
        </div>
    );
};

export default React.memo(ProjectDashboardProjectTasksStatuses);
