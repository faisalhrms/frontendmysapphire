import React from "react";
import AvatarList from "@components/AvatarList.jsx"; // Assuming AvatarList is a separate component to render avatars

const TaskCard = ({ task }) => {
    // Fallbacks if any field is missing
    const startedAt = task.started_at
        ? new Date(task.started_at).toLocaleDateString()
        : "N/A";

    const daysLeft = task.days_left != null ? `${task.days_left} days left` : "No deadline";

    return (
        <div className="box kanban-tasks">
            <div className="box-body !p-0">
                <div className="p-4 kanban-board-head">

                    {/* Top row: Created date & Days left */}
                    <div className="flex text-[#8c9097] dark:text-white/50 justify-between mb-1 text-[.75rem] font-semibold">
                        <div>
                            <i className="ri-time-line align-middle" /> Created - {startedAt}
                        </div>
                        <div>{daysLeft}</div>
                    </div>

                    {/* Task No, Tags, Status, Priority badges (optional) */}
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

                            {/* (Optional) Status */}
                            {task.status && (
                                <span className="badge bg-warning/10 text-warning">
                  {task.status}
                </span>
                            )}

                            {/* (Optional) Priority */}
                            {task.priority && (
                                <span className="badge bg-danger/10 text-danger">
                  {task.priority}
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

                {/* Bottom row: Avatars, progress, etc. */}
                <div className="p-4 border-t dark:border-defaultborder/10 border-dashed">
                    <div className="flex items-center justify-between">
                        <AvatarList users={task.users} />
                        {/* If you have progress or other info, you could show it here */}
                        {/* <div>Progress: {task.progress || 0}%</div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
