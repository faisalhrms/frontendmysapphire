import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import {useTaskModal, useTaskWithChild} from '../hooks/taskHooks';
import {useParams} from "react-router-dom";
import TaskSummary from "../components/task/TaskSummary";
import TaskAdditionalDetail from '../components/task/TaskAdditionalDetail'
import TaskTree from '../components/task/TaskTree'
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import React from "react";
import TaskModel from "@modules/project-management/components/model/TaskModel.jsx";
import ProjectAttachment from "@modules/project-management/components/project/ProjectAttachment.jsx";
import ProjectTeam from "@modules/project-management/components/project/ProjectTeam.jsx";
import Discussion from "@components/Discussion.jsx";


const TaskDetail = () => {
    const {id} = useParams();
    const {task, isLoading, refetch} = useTaskWithChild(id);

    const {
        taskData,
        openTaskModal,
        closeTaskModal,
        control,
        errors,
        isSubmitting,
        handleSubmit,
        onSubmit,
        isEditMode,
        isModalOpen,
        milestoneDates
    } = useTaskModal(refetch);

    return (<>
        <PageHeader currentpage={`Task Detail`} activepage="Tasks" mainpage={task ? task.task_no : 'TSK - 00000000'}/>
        {isLoading ? (<LoadingSpinner/>) : (<div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-9 col-span-12">
                    <TaskSummary task={task} openTaskModal={openTaskModal}/>
                        {task.children.length > 0 && (<TaskTree task={task} openTaskModal={openTaskModal}/>)}
                    <Discussion title="Task Discussions" storeEndPoint={`/pms/tasks/${id}/discussion/`} getEndPoint={`/pms/tasks/${id}/discussions/`}/>
                </div>
                <div className="xl:col-span-3 col-span-12">
                    <TaskAdditionalDetail task={task}/>
                    <ProjectTeam users={task.users}/>
                    {task.attachments.length > 0 && (<ProjectAttachment attachments={task.attachments}/>)}
                </div>
            </div>)}

        {isModalOpen && <TaskModel
            projectId={task?.milestone?.project_id}
            isEditMode={isEditMode}
            taskData={taskData}
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            closeModal={closeTaskModal}
            startedAt={milestoneDates.startedAt}
            endedAt={milestoneDates.endedAt}
        />}
    </>)
}

export default TaskDetail