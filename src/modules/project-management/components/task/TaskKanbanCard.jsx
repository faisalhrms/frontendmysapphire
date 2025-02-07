import React from "react";
import AvatarList from "@components/AvatarList.jsx";
import { getTaskBorderClass } from "@helpers/KanbanStatuses.js";
import {toTitleCase} from "@helpers/formatters.js";
import {getBadgeClasses} from "@helpers/badges.js";
import {formatDate} from "@helpers/dateTime.js";

const TaskKanbanCard = ({ task }) => {

    const daysLeft = task.days_left != null ? `${task.days_left} days left` : "No deadline";

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
