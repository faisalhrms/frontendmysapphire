import React from 'react'
import TaskTable from '../project/TaskTable'

const TaskTree = ({ task, openTaskModal, refetch }) => {
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
            <TaskTable projectUsers={task.project_users} tasks={task.children} openTaskModal={openTaskModal} isChild={true} refetch={refetch}  />
        </div>
      </div>
    </>
  )
}

export default TaskTree