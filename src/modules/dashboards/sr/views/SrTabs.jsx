import React, { useState } from "react";
import SrDashboard from "@modules/dashboards/sr/views/SrDashboard.jsx";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import PersonView from "@modules/dashboards/sr/views/PersonView.jsx";


const SrTabs = () => {
  const [activeTab, setActiveTab] = useState("sr-dashboard");


  return (
      <div className="p-2">
        <div className="box">
          <div className="box-header sm:flex block !justify-start dark:bg-bodybg bg-white">
              <nav aria-label="Tabs" className="md:flex block !justify-start whitespace-nowrap">
                  <button
                      onClick={() => setActiveTab("sr-dashboard")}
                      className={`m-1 block w-full py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                          activeTab === "sr-dashboard"
                              ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                              : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                      }`}
                  >
                      SR Dashboard
                  </button>
                  <button
                      onClick={() => setActiveTab("person-view")}
                      className={`m-1 block w-full py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                          activeTab === "person-view"
                              ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                              : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                      }`}
                  >
                      Person View
                  </button>

              </nav>
          </div>


        </div>
          {activeTab === "sr-dashboard" && <SrDashboard/>}
          {activeTab === "person-view" && <PersonView/>}

      </div>

  );
};

export default SrTabs;
