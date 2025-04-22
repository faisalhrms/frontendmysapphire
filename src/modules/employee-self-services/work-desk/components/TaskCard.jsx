import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toTitleCase } from "@helpers/formatters.js";
import { format } from "date-fns";

const TaskCard = ({ task, statusLabel }) => {
  const [borderColor, setBorderColor] = useState("rgba(132, 90 ,223,0.4)");

  useEffect(() => {
    if (!task.is_read) {
    const colors = ["rgba(255,99,132,0.4)", "rgba(54,162,235,0.4)"];
      let i = 0;
      const id = setInterval(() => {
        i = 1 - i;
        setBorderColor(colors[i]);
      }, 1000);
      return () => clearInterval(id);
    }
  }, [task.is_read]);

  let daysLeft = "";
  if (task.need_by_date) {
    const diff = Math.ceil((new Date(task.need_by_date) - new Date()) / (1000 * 60 * 60 * 24));
    daysLeft = diff > 0 ? `${diff} days left` : "0 days left";
  } else daysLeft = "N/A";

  const assignees = task.sr_tasks?.[0]?.assignees || [];
  const assigneeNames = assignees.map(a => a.name).join(", ") || "Unassigned";
  const priority = task.sr_tasks?.[0]?.priority;
  const status = task.sr_tasks?.[0]?.status;

  return (
    <div
      style={{ borderInlineStart: `0.45rem solid ${!task.is_read ? borderColor : "transparent"}` }}
      className="box flex flex-col h-auto"
    >
      <div className="box-body flex flex-col">
        <div className="flex justify-between mb-1 text-[.75rem] font-semibold">
          <span className="text-primary">{task.sr_number}</span>
          <span className="text-[#8c9097] dark:text-white/50">{daysLeft}</span>
        </div>
        <p className="font-semibold mb-2">{task.request_title}</p>
        <p className="mb-1 flex items-center">
          <span>Assigned On:</span>
          <span className="ml-2 text-[0.75rem] text-[#8c9097] dark:text-white/50">
            {format(new Date(task.created_at), "MMM d, yyyy, h:mm a")}
          </span>
        </p>
        <p className="mb-1 flex items-center">
          <span>Need By Date:</span>
          <span className="ml-2 text-[0.75rem] text-[#8c9097] dark:text-white/50">
            {format(new Date(task.need_by_date), "MMM d, yyyy, h:mm a")}
          </span>
        </p>
        <p className="mb-1 flex items-center">
          <span>Requester:</span>
          <span className="ml-2 text-[0.75rem] text-[#8c9097] dark:text-white/50">{task.reporter}</span>
        </p>
        <p className="mb-1 flex items-center">
          <span>Assigned To:</span>
          <span className="ml-2 text-[0.75rem] text-[#8c9097] dark:text-white/50">{assigneeNames}</span>
        </p>
      </div>
      <div className="border-t px-4 pt-2 pb-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {priority && (
            <span className={`badge ${priority === "high" ? "bg-danger/10 text-danger" : priority === "medium" ? "bg-secondary/10 text-secondary" : "bg-green/10 text-success"}`}>
              {toTitleCase(priority)}
            </span>
          )}
          <span className={`badge ${status === "Not-Started" ? "bg-info/10 text-info" : "bg-warning/10 text-warning"}`}>
            {status || statusLabel}
          </span>
        </div>
        <Link to={`/module/srm/taskgeneratedform/${task.id}`} className="ti-btn ti-btn-sm ti-btn-primary">
          <i className="ri-eye-line"></i>
        </Link>
      </div>
    </div>
  );
};

const TaskList = ({ tasks, statusLabel }) => {
  if (!tasks || tasks.length === 0) {
    return <div className="text-center">No tasks available for {statusLabel}.</div>;
  }

  return (
    <div className="tab-pane !p-0">
      <div className="grid grid-cols-12 gap-5 items-start">
        {tasks.map(task => (
          <div key={task.id} className="xl:col-span-4 col-span-12">
            <TaskCard task={task} statusLabel={statusLabel} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
