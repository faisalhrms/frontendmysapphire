import React from 'react'
import TaskTable from '../project/TaskTable'
import {useTaskOverdueModal} from "@modules/project-management/hooks/taskHooks.js";
import TaskOverdueModal from "@modules/project-management/components/model/TaskOverdueModal.jsx";

const TaskTree = ({ task, openTaskModal, refetch }) => {
    const {
        taskName,
        openTaskOverdueModal,
        closeTaskOverdueModal,
        control:overDueControl,
        errors: overDueErrors,
        isSubmitting: overDueSubmitting,
        handleSubmit: overDueSubmit,
        onOverdueTaskSubmit,
        isOverdueTaskModalOpen
    } = useTaskOverdueModal(refetch)
  return (
    <>
      <div className="box">
      <div className="box-header">
          <div className="box-title">
              Sub Task Detail
          </div>
          <div className="flex items-center space-x-2">
              <div className="flex space-x-2">

              </div>
          </div>
      </div>
        <div className="box-body">
            <TaskTable
                projectUsers={task.project_users}
                milestoneLaunch={task.milestone.ended_at}
                milestoneStatus={task.milestone.status}
                startedAt={task.started_at}
                endedAt={task.ended_at}
                tasks={task.children}
                openTaskModal={openTaskModal}
                openTaskOverdueModal={openTaskOverdueModal}
                isChild={true}
                refetch={refetch}
            />
        </div>
      </div>

        {
            isOverdueTaskModalOpen &&
            <TaskOverdueModal
                taskName={taskName}
                control={overDueControl}
                errors={overDueErrors}
                isSubmitting={overDueSubmitting}
                handleSubmit={overDueSubmit}
                onSubmit={onOverdueTaskSubmit}
                closeModal={closeTaskOverdueModal}
            />
        }

    </>
  )
}

export default TaskTree