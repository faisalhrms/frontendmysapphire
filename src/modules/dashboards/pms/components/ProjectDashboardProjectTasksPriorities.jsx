import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";
import TaskPrioritiesTableWrapper from "@modules/dashboards/pms/components/TaskPrioritiesTableWrapper.jsx";

const ProjectDashboardProjectTasksPriorities = ({ data, isLoading, isActive, filters }) => {
    if (!isActive){
        return null
    }
    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <>
            <TaskPrioritiesTableWrapper data={data?.closed_tasks} title='Closed tasks within 2 weeks' filters={filters} type='closed' />
            <TaskPrioritiesTableWrapper data={data?.new_tasks} title='New tasks within 2 weeks' filters={filters} type='new' />
            <TaskPrioritiesTableWrapper data={data?.pending_tasks} filters={filters} />
        </>
    );
};

export default React.memo(ProjectDashboardProjectTasksPriorities);
