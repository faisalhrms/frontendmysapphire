import React from "react";

const Tabs = ({ setActiveTab, activeTab }) => {
  return (
    <div className="flex space-x-6 mb-4 border-b-2 border-gray-200 bg-gray-50 border-radius-5 py-2 box-body">
      <button
        onClick={() => setActiveTab("pending")}
        className={`py-2 px-4 font-semibold ${
          activeTab === "pending"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-600"
        }`}
      >
       Task Pending
      </button>
      <button
        onClick={() => setActiveTab("task")}
        className={`py-2 px-4 font-semibold ${
          activeTab === "generated"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-600"
        }`}
      >
        Task Generated
      </button>
      <button
        onClick={() => setActiveTab("completed")}
        className={`py-2 px-4 font-semibold ${
          activeTab === "completed"
            ? "text-blue-600 border-b-2 border-blue-600"
            : "text-gray-600"
        }`}
      >
        Task Completed
      </button>
    </div>
  );
};

export default Tabs;
