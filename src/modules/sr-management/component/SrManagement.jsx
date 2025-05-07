import React, { useState, useEffect } from "react";
import PendingRequestsTable from "@modules/sr-management/pending-req-section/views/PendingReqTable.jsx";
import TaskGeneratedTable from "@modules/sr-management/task-genrated-section/views/TaskGeneratedTable.jsx";
import CompletedTasksTable from "@modules/sr-management/completed-task-section/views/CompletedTasksTable.jsx";
import TaskClosedTable from "@modules/sr-management/closed-task-section/views/TaskClosedTable.jsx";
import { getUnreadCounts } from "@modules/sr-management/services/Pending.js";

const SrManagement = () => {
  const [activeTab, setActiveTab] = useState("pending-task");
  const [counts, setCounts] = useState({
    pending: 0,
    generated: 0,
    completed: 0,
    closed: 0,
  });

  useEffect(() => {
    getUnreadCounts().then(setCounts);
  }, []);

  const badge = (value) =>
    value > 0 && (
      <span className="flex absolute h-5 w-5 -top-[0.25rem] -right-[0.6rem] transition-all duration-200 ease-in-out">
        <span className="relative inline-flex rounded-full h-[14.7px] w-[14px] text-[0.625rem] bg-secondary text-white justify-center items-center transition-colors duration-200 ease-in-out">
          {value}
        </span>
      </span>
    );

  return (
    <div className="p-3">
      <div className="box">
        <div className="box-header sm:flex block !justify-start dark:bg-bodybg bg-white">
          <nav aria-label="Tabs" className="md:flex block !justify-start whitespace-nowrap">
            <button
              onClick={() => setActiveTab("pending-task")}
              className={`relative m-1 block w-full py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                activeTab === "pending-task"
                  ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                  : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
              }`}
            >
              Task Pending
              {badge(counts.pending)}
            </button>
            <button
              onClick={() => setActiveTab("generated-task")}
              className={`relative m-1 block w-full py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                activeTab === "generated-task"
                  ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                  : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
              }`}
            >
              Task Generated
              {badge(counts.generated)}
            </button>
            <button
              onClick={() => setActiveTab("completed-task")}
              className={`relative m-1 block w-full py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                activeTab === "completed-task"
                  ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                  : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
              }`}
            >
              Task Completed
              {badge(counts.completed)}
            </button>
            <button
              onClick={() => setActiveTab("closed-task")}
              className={`relative m-1 block w-full py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                activeTab === "closed-task"
                  ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                  : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
              }`}
            >
              Task Closed
              {badge(counts.closed)}
            </button>
          </nav>
        </div>
        <div className="box-content bg-white">
          {activeTab === "pending-task" && <PendingRequestsTable />}
          {activeTab === "generated-task" && <TaskGeneratedTable />}
          {activeTab === "completed-task" && <CompletedTasksTable />}
          {activeTab === "closed-task" && <TaskClosedTable />}
        </div>
      </div>
    </div>
  );
};

export default SrManagement;
