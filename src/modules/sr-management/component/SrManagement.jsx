import React, { useState } from "react";
import PendingRequestsTable from "@modules/sr-management/pending-req-section/views/PendingReqTable.jsx";
import TaskGeneratedTable from "@modules/sr-management/task-genrated-section/views/TaskGeneratedTable.jsx";
import CompletedTasksTable from "@modules/sr-management/completed-task-section/views/CompletedTasksTable.jsx";
import { useNavigate } from "react-router-dom";
import TaskClosedTable from "@modules/sr-management/closed-task-section/views/TaskClosedTable.jsx";

const SrManagement = () => {
  const [activeTab, setActiveTab] = useState("pending-task");


  return (
      <div className="p-4">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Server Request Management</h2>
        </div>

        <div className="box">
          <div className="box-header sm:flex block !justify-start dark:bg-bodybg bg-white">
              <nav aria-label="Tabs" className="md:flex block !justify-start whitespace-nowrap">
                  <button
                      onClick={() => setActiveTab("pending-task")}
                      className={`m-1 block w-full py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                          activeTab === "pending-task"
                              ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                              : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                      }`}
                  >
                      Task Pending
                  </button>
                  <button
                      onClick={() => setActiveTab("generated-task")}
                      className={`m-1 block w-full py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                          activeTab === "generated-task"
                              ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                              : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                      }`}
                  >
                      Task Generated
                  </button>
                  <button
                      onClick={() => setActiveTab("completed-task")}
                      className={`m-1 block w-full py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                          activeTab === "completed-task"
                              ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                              : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                      }`}
                  >
                      Task Completed
                  </button>
                  <button
                      onClick={() => setActiveTab("closed-task")}
                      className={`m-1 block w-full py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                          activeTab === "closed-task"
                              ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                              : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                      }`}
                  >
                      Task Closed
                  </button>
              </nav>
          </div>

            <div className="box-content bg-white">
                {activeTab === "pending-task" && <PendingRequestsTable/>}
                {activeTab === "generated-task" && <TaskGeneratedTable/>}
                {activeTab === "completed-task" && <CompletedTasksTable/>}
                {activeTab === "closed-task" && <TaskClosedTable/>}
            </div>
        </div>
      </div>
  );
};

export default SrManagement;
