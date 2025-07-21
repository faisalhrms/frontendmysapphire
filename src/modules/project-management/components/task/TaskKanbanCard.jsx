import React from "react";
import AvatarList from "@components/AvatarList.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";
import TaskStatusDropdown from "@modules/project-management/components/dropdowns/TaskStatusDropdown.jsx";
import {Link} from "react-router-dom";
import TaskDetailModalPortal from "@modules/project-management/components/task/TaskDetailModalPortal.jsx";
import {useTaskDetailModal} from "@modules/project-management/hooks/taskHooks.js";

const  TaskKanbanCard = ({ item, refetch }) => {

    const daysLeft = item.days_left != null ? `${item.days_left} days left` : "No deadline";
    const {
        openTaskDetailModal,
        closeTaskDetailModal,
        isTaskDetailModalOpen,
        isTaskDetailLoading,
        task,
    } = useTaskDetailModal()

    const taskBorderStyles = {
        open: 'border-t-[3px] border-solid border-primary/30',
        not_started: 'border-t-[3px] border-solid border-secondary/30',
        in_progress: 'border-t-[3px] border-solid border-info/30',
        half_completed: 'border-t-[3px] border-solid border-warning/30',
        near_completion: 'border-t-[3px] border-solid border-warning/30',
        completed: 'border-t-[3px] border-solid border-success/30',
        reopened: 'border-t-[3px] border-solid border-primary/30',
        on_hold: 'border-t-[3px] border-solid border-danger/30',
        cancelled: 'border-t-[3px] border-solid border-danger/30',
        rejected: 'border-t-[3px] border-solid border-danger/30',
        under_approval: 'border-t-[3px] border-solid border-info/30',
    };

    const getTaskBorderClass = (status) => {
        if (!status) return '';
        const normalizedStatus = status.toLowerCase();
        return taskBorderStyles[normalizedStatus] || 'border-t-[3px] border-solid border-gray/30';
    };


    return (
        <>
            <div className={`box kanban-tasks ${getTaskBorderClass(item.status)}`}>
                <div className="box-body !p-0">
                    <div className="p-4 kanban-board-head">
                        <div
                            className="flex text-[#8c9097] dark:text-white/50 justify-between mb-1 text-[.75rem] font-semibold">
                            <div>
                                <i className="ri-time-line align-middle"/> Created - {formatDate(item.started_at)}
                            </div>

                            {item.status === "completed" ? (
                                <div className="text-success">
                                    <i className="ri-check-fill me-1 align-middle"></i>Done
                                </div>
                            ) : item.status === "under_approval" ? (
                                <div className="text-info">
                                    <i className="ri-information-line me-1 align-middle"></i>Under Approval
                                </div>
                            ) : (
                                <div>{daysLeft}</div>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="task-badges flex items-center gap-1 flex-wrap">
                                <span className="badge bg-light text-default">{item.task_no}</span>
                                <span className='space-x-1 rtl:space-x-reverse'>
                                {(
                                    item?.tags?.map(tag => (
                                        <span key={tag.id}
                                              className="badge bg-primary/10 text-primary">{toTitleCase(tag.name)}</span>
                                    ))
                                )}
                            </span>
                            </div>
                        </div>

                        <div className="kanban-content !mt-1">
                            <Link
                                onClick={() => {
                                    openTaskDetailModal(item.id)
                                }}
                                to="#">
                                <h6 className="font-semibold mb-1 text-[.9375rem]">{item.name}</h6>
                                <div className="kanban-task-description">
                                    {item.description || "(No description)"}
                                </div>
                            </Link>
                        </div>
                    </div>

                    <div className="p-4 border-t dark:border-defaultborder/10 border-dashed">
                        <div className="flex items-center justify-between">
                            <AvatarList users={item.users}/>
                            {
                                item.status !== 'under_approval' &&
                                <div className="min-w-[9rem]">
                                    <TaskStatusDropdown status={item.status} taskId={item.id} refetch={refetch}/>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {
                    isTaskDetailModalOpen &&
                    <TaskDetailModalPortal
                        task={task}
                        isLoading={isTaskDetailLoading}
                        closeModal={closeTaskDetailModal}
                        viewOnly={false}
                    />
                }
            </div>
        </>
    );
};

export default TaskKanbanCard;
