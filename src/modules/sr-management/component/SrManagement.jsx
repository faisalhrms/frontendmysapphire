import React, { useState } from "react";
import PendingRequestsTable from "@modules/sr-management/pending-req-section/views/PendingReqTable.jsx";
import TaskGeneratedTable from "@modules/sr-management/task-genrated-section/views/TaskGeneratedTable.jsx";
import CompletedTasksTable from "@modules/sr-management/completed-task-section/views/CompletedTasksTable.jsx";
import { useNavigate } from "react-router-dom";

const SrManagement = () => {
  const [activeTab, setActiveTab] = useState("pending");


  return (
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Server Request Management</h2>
        </div>

        <div className="box">
          <div className="box-header sm:flex block !justify-start dark:bg-bodybg bg-white">
            <nav aria-label="Tabs" className="md:flex block !justify-start whitespace-nowrap">
              <button
                  onClick={() => setActiveTab("pending")}
                  className={`m-1 block w-full py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                      activeTab === "pending"
                          ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                          : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                  }`}
              >
               Task Pending
              </button>
              <button
                  onClick={() => setActiveTab("task")}
                  className={`m-1 block w-full py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                      activeTab === "task"
                          ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                          : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                  }`}
              >
                Task Generated
              </button>
              <button
                  onClick={() => setActiveTab("completed")}
                  className={`m-1 block w-full py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                      activeTab === "completed"
                          ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                          : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                  }`}
              >
                Task Completed
              </button>
            </nav>
          </div>

          <div className="box-content bg-white">
            {activeTab === "pending" && <PendingRequestsTable  />}
            {activeTab === "task" && <TaskGeneratedTable />}
            {activeTab === "completed" && <CompletedTasksTable />}
          </div>
        </div>
      </div>
  );
};

export default SrManagement;
