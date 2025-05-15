import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";
import TagsTableWrapper from "@modules/dashboards/pms/components/TagsTableWrapper.jsx";
import PrioritiesTableWrapper from "@modules/dashboards/pms/components/PrioritiesTableWrapper.jsx";
import TeamsTableWrapper from "@modules/dashboards/pms/components/TeamsTableWrapper.jsx";

const ProjectDashboardProjectTasksStatuses = ({ data, isLoading, isActive, filters }) => {

    if (isLoading) {
        return <LoadingSpinner />;
    }
    if (!isActive){
        return null
    }
    const postGoLiveIssueStatus = data?.post_go_live_issue_status?.by_priorities || {};
    const postGoLiveIssueStatusByTeam = data?.post_go_live_issue_status?.by_teams || {};
    const postGoLiveIssueStatusByTags = data?.post_go_live_issue_status?.by_tags || {};
    const statuses = postGoLiveIssueStatusByTags?.statuses || [];

    return (
        <div>
            <PrioritiesTableWrapper data={postGoLiveIssueStatus} statuses={statuses} filters={filters} />
            <TeamsTableWrapper data={postGoLiveIssueStatusByTeam} statuses={statuses} filters={filters} />
            <TagsTableWrapper byTags={postGoLiveIssueStatusByTags?.tags} statuses={statuses} filters={filters} />
        </div>
    );
};

export default React.memo(ProjectDashboardProjectTasksStatuses);
