import React from "react";
import AvatarList from "@components/AvatarList.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
import { formatDate } from "@helpers/dateTime.js";

const TaskKanbanCard = ({ task }) => {

    const daysLeft = task.days_left != null ? `${task.days_left} days left` : "No deadline";

    // Define task border styles inside the component
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

    // Define the function to get the correct border class based on task status
    const getTaskBorderClass = (status) => {
        if (!status) return ''; // Return an empty string if no status is provided
        const normalizedStatus = status.toLowerCase();
        return taskBorderStyles[normalizedStatus] || 'border-t-[3px] border-solid border-gray/30';
    };

    return (
        <div className={`box kanban-tasks ${getTaskBorderClass(task.status)}`}>
            <div className="box-body !p-0">
                <div className="p-4 kanban-board-head">
                    <div className="flex text-[#8c9097] dark:text-white/50 justify-between mb-1 text-[.75rem] font-semibold">
                        <div>
                            <i className="ri-time-line align-middle" /> Created - {formatDate(task.started_at)}
                        </div>

                        {task.status === "completed" ? (
                            <div className="text-success">
                                <i className="ri-check-fill me-1 align-middle"></i>Done
                            </div>
                        ) : task.status === "under_approval" ? (
                            <div className="text-info">
                                <i className="ri-information-line me-1 align-middle"></i>Under Approval
                            </div>
                        ) : (
                            <div>{daysLeft}</div>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="task-badges flex items-center gap-1 flex-wrap">
                            <span className="badge bg-light text-default">{task.task_no}</span>
                            <span className='space-x-1 rtl:space-x-reverse'>
                                {(
                                    task?.tags?.map(tag => (
                                        <span key={tag.id} className="badge bg-primary/10 text-primary">{ toTitleCase(tag.name) }</span>
                                    ))
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="kanban-content !mt-1">
                        <h6 className="font-semibold mb-1 text-[.9375rem]">{task.name}</h6>
                        <div className="kanban-task-description">
                            {task.description || "(No description)"}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t dark:border-defaultborder/10 border-dashed">
                    <div className="flex items-center justify-between">
                        <AvatarList users={task.users}/>
                        <span className={getBadgeClasses(task.priority)}>{toTitleCase(task.priority)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskKanbanCard;
