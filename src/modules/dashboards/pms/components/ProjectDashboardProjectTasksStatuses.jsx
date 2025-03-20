import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";
import TagsTableWrapper from "@modules/dashboards/pms/components/TagsTableWrapper.jsx";
import PrioritiesTableWrapper from "@modules/dashboards/pms/components/PrioritiesTableWrapper.jsx";
import TeamsTableWrapper from "@modules/dashboards/pms/components/TeamsTableWrapper.jsx";

const ProjectDashboardProjectTasksStatuses = ({ data, isLoading, isActive }) => {

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
            <PrioritiesTableWrapper data={postGoLiveIssueStatus} statuses={statuses} />
            <TeamsTableWrapper data={postGoLiveIssueStatusByTeam} statuses={statuses} />
            <TagsTableWrapper byTags={postGoLiveIssueStatusByTags?.tags} statuses={statuses} />
        </div>
    );
};

export default React.memo(ProjectDashboardProjectTasksStatuses);
