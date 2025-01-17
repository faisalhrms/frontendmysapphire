import React from "react";
import { useNavigate } from "react-router-dom";

const TaskList = ({ tasks, statusLabel }) => {
        const navigate = useNavigate();

    if (!tasks || tasks.length === 0) {
        return <div className="text-center">No tasks available for {statusLabel}.</div>;
    }


    const onViewTask = (id) => {
        navigate(`/module/srm/taskgeneratedform/${id}`);
    };

    return (
        <div className="tab-pane !p-0">
            <div className="grid grid-cols-12 gap-6">
                {tasks.map((task) => {
                    const assignees = task.sr_tasks?.[0]?.assignees || [];
                    const assigneeNames = assignees.map((assignee) => assignee.name).join(", ") || "Unassigned";

                    return (
                        <div key={task.id} className="xl:col-span-4 col-span-12">
                            <div className="box task-pending-card">
                                <div className="box-body">
                                    <div className="flex justify-between flex-wrap gap-2">
                                        <div>
                                            <p className="font-semibold mb-2 flex items-center text-primary">
                                                {task.sr_number}
                                            </p>
                                            <p className="font-semibold mb-4 flex items-center">
                                                {task.request_title}
                                            </p>
                                            <p className="mb-2">Assigned On: <span
                                                className="text-[0.75rem] mb-1 text-[#8c9097] dark:text-white/50">
                                                    {new Date(task.created_at).toLocaleDateString()}
                                                </span></p>
                                            <p className="mb-2">Need By Date: <span
                                                className="text-[0.75rem] mb-1 text-[#8c9097] dark:text-white/50">
                                                    {task.need_by_date ? new Date(task.need_by_date).toLocaleDateString() : "N/A"}
                                                </span></p>
                                            <p className="mb-2">Assigned To: <span
                                                className="text-[0.75rem] mb-1 text-[#8c9097] dark:text-white/50">
                                                    {assigneeNames}
                                                </span></p>
                                        </div>
                                        <div>
                                            <div className="btn-list">
                                                <button
                                                    type="button"
                                                    aria-label="button"
                                                    onClick={() => onViewTask(task.id)}
                                                    className="ti-btn ti-btn-sm ti-btn-primary me-[0.375rem]"
                                                >
                                                    <i className="ri-eye-line"></i>
                                                </button>
                                            </div>
                                            <span
                                                className={`badge ${
                                                    task.sr_tasks && task.sr_tasks.length > 0 && task.sr_tasks[0].status === "Not-Started"
                                                        ? "bg-info/10"
                                                        : "bg-warning/10"
                                                } text-warning block`}
                                            >
                                                {task.sr_tasks && task.sr_tasks.length > 0
                                                    ? task.sr_tasks[0].status
                                                    : statusLabel}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TaskList;
