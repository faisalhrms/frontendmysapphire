import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";
import TaskPrioritiesTableWrapper from "@modules/dashboards/pms/components/TaskPrioritiesTableWrapper.jsx";
import usePMSStatsDrillDown from "@modules/dashboards/pms/hooks/usePMSStatsDrillDown.js";
import TaskListModal from "@modules/project-management/components/model/TaskListModal.jsx";

const ProjectDashboardProjectTasksPriorities = ({ data, isLoading, isActive, filters }) => {
    if (!isActive){
        return null
    }
    if (isLoading) {
        return <LoadingSpinner />;
    }

    const { isTaskModalOpen, tasks, loadingTasks, handleRowClick, openTaskModal, closeTaskModal } = usePMSStatsDrillDown(
        'dashboard/pms/project/tasks/priority/detail/',
        filters
    )

    console.log(isTaskModalOpen)
    return (
        <>
            <TaskPrioritiesTableWrapper data={data?.closed_tasks} handleRowClick={handleRowClick} title='Closed tasks within 2 weeks' />
            <TaskPrioritiesTableWrapper data={data?.new_tasks} handleRowClick={handleRowClick} title='New tasks within 2 weeks' />
            <TaskPrioritiesTableWrapper data={data?.pending_tasks} handleRowClick={handleRowClick} />
            {
                isTaskModalOpen &&
                <TaskListModal
                    tasks={tasks}
                    isLoading={loadingTasks}
                    closeModal={closeTaskModal}
                />
            }
        </>
    );
};

export default React.memo(ProjectDashboardProjectTasksPriorities);
