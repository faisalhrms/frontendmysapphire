import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {getBadgeClasses} from "@helpers/badges.js";
import {toTitleCase} from "@helpers/formatters.js";
import {format} from "date-fns";

const TaskList = ({tasks, statusLabel}) => {
    const navigate = useNavigate();

    if (!tasks || tasks.length === 0) {
        return <div className="text-center">No tasks available for {statusLabel}.</div>;
    }


    const onViewTask = (id) => {
        navigate(`/module/srm/taskgeneratedform/${id}`);
    };

    return (
<div className="tab-pane !p-0">
  <div className="grid grid-cols-12 gap-5 items-start">
    {tasks.map((task) => {
      let daysLeft = ""
      if (task.need_by_date) {
        const currentDate = new Date()
        const needByDate = new Date(task.need_by_date)
        const diff = Math.ceil((needByDate - currentDate) / (1000 * 60 * 60 * 24))
        daysLeft = diff > 0 ? `${diff} days left` : "0 days left"
      } else {
        daysLeft = "N/A"
      }
      const assignees = task.sr_tasks?.[0]?.assignees || []
      const assigneeNames = assignees.map((assignee) => assignee.name).join(", ") || "Unassigned"
      const priority = task.sr_tasks?.[0]?.priority
      const status = task.sr_tasks?.[0]?.status
      return (
        <div key={task.id} className="xl:col-span-4 col-span-12">
          <div className="box task-pending-card flex flex-col h-auto">
            <div className="box-body flex flex-col">
              <div className="flex justify-between mb-1 text-[.75rem] font-semibold">
                <span className="text-primary">{task.sr_number}</span>
                <span className="text-[#8c9097] dark:text-white/50">{daysLeft}</span>
              </div>
              <p className="font-semibold mb-2">{task.request_title}</p>
              <p className="mb-1 flex items-center">
                <span>Assigned On:</span>
                <span className="ml-2 text-[0.75rem] mb-1 text-[#8c9097] dark:text-white/50">
                    {format(new Date(task.created_at), "MMM d, yyyy, h:mm a")}
                </span>
              </p>
              <p className="mb-1 flex items-center">
                <span>Need By Date:</span>
                <span className="ml-2 text-[0.75rem] mb-1 text-[#8c9097] dark:text-white/50">
                    {format(new Date(task?.need_by_date), "MMM d, yyyy, h:mm a")}
                </span>
              </p>
                <p className="mb-1 flex items-center">
                <span>Requester:</span>
                <span className="ml-2 text-[0.75rem] mb-1 text-[#8c9097] dark:text-white/50">
                 {task.reporter}
                </span>
              </p>
              <p className="mb-1 flex items-center">
                <span>Assigned To:</span>
                <span className="ml-2 text-[0.75rem] mb-1 text-[#8c9097] dark:text-white/50">
                  {assigneeNames}
                </span>
              </p>
            </div>
            <div className="border-t px-4 pt-2 pb-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {priority && (
                  <span
                    className={`badge ${
                      priority === "high"
                        ? "bg-danger/10 text-danger"
                        : priority === "medium"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-green/10 text-success"
                    }`}
                  >
                    {toTitleCase(priority)}
                  </span>
                )}
                <span
                  className={`badge ${
                    status === "Not-Started"
                      ? "bg-info/10 text-info"
                      : "bg-warning/10 text-warning"
                  }`}
                >
                  {status || statusLabel}
                </span>
              </div>
            <div>
                <Link
                    aria-label="anchor"
                    to={`/module/srm/taskgeneratedform/${task.id}`}
                    rel="noopener noreferrer"
                    className="ti-btn ti-btn-sm ti-btn-primary"
                >
                    <i className="ri-eye-line"></i>
                </Link>
            </div>

            </div>
          </div>
        </div>
      )
    })}
  </div>
</div>

    );
};

export default TaskList;
