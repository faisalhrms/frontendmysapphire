import React from "react";
import AvatarList from "@components/AvatarList.jsx";

const TaskCard = ({ task }) => {
    const startedAt = task.started_at
        ? new Date(task.started_at).toLocaleDateString()
        : "N/A";

    const daysLeft = task.days_left != null ? `${task.days_left} days left` : "No deadline";

    return (
        <div className="box kanban-tasks">
            <div className="box-body !p-0">
                <div className="p-4 kanban-board-head">

                    <div className="flex text-[#8c9097] dark:text-white/50 justify-between mb-1 text-[.75rem] font-semibold">
                        <div>
                            <i className="ri-time-line align-middle" /> Created - {startedAt}
                        </div>
                        <div>{daysLeft}</div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="task-badges flex items-center gap-1 flex-wrap">
                            {/* Task No */}
                            <span className="badge bg-light text-default">{task.task_no}</span>

                            {/* Tags */}
                            {task.tags && task.tags.length > 0 && (
                                <span className="badge bg-primary/10 text-primary">
                  {task.tags.map((t) => t.name).join(", ")}
                </span>
                            )}

                        </div>
                    </div>

                    {/* Task title & description */}
                    <div className="kanban-content !mt-1">
                        <h6 className="font-semibold mb-1 text-[.9375rem]">{task.name}</h6>
                        <div className="kanban-task-description">
                            {task.description || "(No description)"}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t dark:border-defaultborder/10 border-dashed">
                    <div className="flex items-center justify-between">
                        <AvatarList users={task.users} />
                        {/* (Optional) Priority */}
                        {task.priority && (
                            <span className="badge bg-danger/10 text-danger">
                  {task.priority}
                </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
