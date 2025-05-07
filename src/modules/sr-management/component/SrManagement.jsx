import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PendingRequestsTable from "@modules/sr-management/pending-req-section/views/PendingReqTable.jsx";
import TaskGeneratedTable from "@modules/sr-management/task-genrated-section/views/TaskGeneratedTable.jsx";
import CompletedTasksTable from "@modules/sr-management/completed-task-section/views/CompletedTasksTable.jsx";
import TaskClosedTable from "@modules/sr-management/closed-task-section/views/TaskClosedTable.jsx";
import { getUnreadCounts } from "@modules/sr-management/services/Pending.js";

const SrManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeStatus, setActiveStatus] = useState(() => searchParams.get("status") || "pending-task");
  const [counts, setCounts] = useState({
    pending: 0,
    generated: 0,
    completed: 0,
    closed: 0,
  });

  useEffect(() => {
    getUnreadCounts().then(setCounts);
  }, []);

  useEffect(() => {
    setActiveStatus(searchParams.get("status") || "pending-task");
  }, [searchParams]);

  const badge = (value) =>
    value > 0 && (
    <span className="absolute -top-1 -right-2 z-10 transition-all duration-200 ease-in-out">
      <span className="flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full text-[10px] bg-secondary text-white leading-none">
        {value}
      </span>
    </span>
    );

  return (
    <div className="p-3">
      <div className="box">
        <div className="box-header sm:flex block !justify-start dark:bg-bodybg bg-white">
          <nav aria-label="Statuses" className="md:flex block !justify-start whitespace-nowrap">
            <button
              onClick={() => setSearchParams({ status: "pending-task" })}
              className={`relative m-1 block w-full py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                activeStatus === "pending-task"
                  ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                  : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
              }`}
            >
              Task Pending
              {badge(counts.pending)}
            </button>
            <button
              onClick={() => setSearchParams({ status: "generated-task" })}
              className={`relative m-1 block w-full py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                activeStatus === "generated-task"
                  ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                  : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
              }`}
            >
              Task Generated
              {badge(counts.generated)}
            </button>
            <button
              onClick={() => setSearchParams({ status: "completed-task" })}
              className={`relative m-1 block w-full py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                activeStatus === "completed-task"
                  ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                  : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
              }`}
            >
              Task Completed
              {badge(444)}
            </button>
            <button
              onClick={() => setSearchParams({ status: "closed-task" })}
              className={`relative m-1 block w-full py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                activeStatus === "closed-task"
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
          {activeStatus === "pending-task" && <PendingRequestsTable />}
          {activeStatus === "generated-task" && <TaskGeneratedTable />}
          {activeStatus === "completed-task" && <CompletedTasksTable />}
          {activeStatus === "closed-task" && <TaskClosedTable />}
        </div>
      </div>
    </div>
  );
};

export default SrManagement;
