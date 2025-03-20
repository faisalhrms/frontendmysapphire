import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";
import TaskPrioritiesTableWrapper from "@modules/dashboards/pms/components/TaskPrioritiesTableWrapper.jsx";

const ProjectDashboardProjectTasksPriorities = ({ data, isLoading, isActive }) => {
    if (!isActive){
        return null
    }
    if (isLoading) {
        return <LoadingSpinner />;
    }
    return (
        <div>
            <TaskPrioritiesTableWrapper data={data?.closed_tasks} title='Closed tasks within 2 weeks' />
            <TaskPrioritiesTableWrapper data={data?.new_tasks} title='New tasks within 2 weeks' />
            <TaskPrioritiesTableWrapper data={data?.pending_tasks} />
        </div>
    );
};

export default React.memo(ProjectDashboardProjectTasksPriorities);
