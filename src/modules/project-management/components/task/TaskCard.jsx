// src/modules/project-management/components/TaskCard.jsx

import React from 'react';
import AvatarList from "@components/AvatarList.jsx"; // Assuming AvatarList is a separate component to render avatars

const TaskCard = ({ task }) => {
    return (
        <div className="box kanban-tasks" key={task.id}>
            <div className="box-body !p-0">
                <div className="p-4 kanban-board-head">
                    {/* Top row: Date & Days left */}
                    <div className="flex text-[#8c9097] dark:text-white/50 justify-between mb-1 text-[.75rem] font-semibold">
                        <div>
                            <i className="ri-time-line align-middle"></i>{" "}
                            Created - {new Date(task.started_at).toLocaleDateString()}
                        </div>
                        <div>{task.days_left} days left</div>
                    </div>

                    {/* Title row: Task badges */}
                    <div className="flex items-center justify-between">
                        <div className="task-badges">
              <span className="badge bg-light text-default">
                {task.task_no}
              </span>
                            {/* If there are tags, show them */}
                            {task.tags && task.tags.length > 0 && (
                                <span className="ms-1 badge bg-primary/10 text-primary">
                  {task.tags.map((t) => t.name).join(", ")}
                </span>
                            )}
                        </div>
                    </div>

                    {/* Task Title & Description */}
                    <div className="kanban-content !mt-1">
                        <h6 className="font-semibold mb-1 text-[.9375rem]">{task.name}</h6>
                        <div className="kanban-task-description">{task.description}</div>
                    </div>
                </div>

                <div className="p-4 border-t dark:border-defaultborder/10 border-dashed">
                    <div className="flex items-center justify-between">
                        <AvatarList users={task.users} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
