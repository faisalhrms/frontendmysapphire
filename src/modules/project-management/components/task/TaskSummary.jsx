import {calculateEffort, formatDate} from "@helpers/dateTime.js";
import React from "react";
import ProgressBar from "@components/ProgressBar.jsx";
import HasProjectPermission from "@modules/project-management/components/project/HasProjectPermission.jsx";

const TaskSummary = ({task, openTaskModal}) => {
    return (
        <>
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">Task Summary</div>
                    <div className="btn-list">
                        <HasProjectPermission globalPermission='change_task' users={task.project_users}>
                        {
                            task.status !=='under_approval' && (
                                <>
                                    <button type="button"
                                            onClick={() => openTaskModal(task.milestone_id, task.started_at, task.ended_at, task.requires_approval, task.id)}
                                            className="hs-dropdown-toggle ti-btn ti-btn-success-full !py-1 mr-3 !px-2 !text-[0.75rem]">
                                        <i className="ri-add-line font-semibold align-middle"></i> Add Sub task
                                    </button>
                                    <button
                                        className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                                        onClick={() => openTaskModal(task.id, task.milestone.started_at, task.milestone.ended_at, task.requires_approval, null, true)}>
                                        <i className="ri-edit-line me-1 align-middle"></i>Edit Task
                                    </button>
                                </>
                            )
                        }
                        </HasProjectPermission>
                    </div>

                </div>
                <div className="box-body">
                    <h5 className="font-semibold mb-4 task-title text-[1.25rem]">
                        {task.name}
                    </h5>
                    <div className="text-[.9375rem] font-semibold mb-2">Task Description :</div>
                    <p className="text-[#8c9097] dark:text-white/50 task-description">{task.description}</p>
                </div>
                <div className="box-footer">
                    <div className="flex items-center justify-between gap-2 flex-wrap">

                        <div>
                            <span
                                className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">Assigned Date</span>
                            <span
                                className="block text-[.875rem] font-semibold dark:text-defaulttextcolor/70 {formatDate(task.started_at)}">{formatDate(task.started_at)}</span>
                        </div>
                        <div>
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">Due Date</span>
                            <span
                                className="block text-[.875rem] font-semibold dark:text-defaulttextcolor/70 {formatDate(task.ended_at)}">{formatDate(task.ended_at)}</span>
                        </div>
                        <div className="task-details-progress">
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem] mb-1">Progress</span>
                            <div className="flex items-center flex-wrap">
                                <ProgressBar
                                    value={task.progress}
                                    withStatus={false}
                                />
                            </div>
                        </div>
                        <div>
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">Efforts</span>
                            <span
                                className="block text-[.875rem]  dark:text-defaulttextcolor/70 font-semibold">{calculateEffort(task.started_at, task.ended_at)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TaskSummary