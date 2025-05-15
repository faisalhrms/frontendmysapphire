import React, { useState } from "react";
import AllUserTable from "@modules/email-management/components/AllUserTable.jsx";
import PendingApprovalsTable from "@modules/email-management/components/PendingApprovalsTable.jsx";
import UserManagementList from "@modules/user/views/UserManagementList.jsx";

const EmailManagementList = () => {
    const [activeTab, setActiveTab] = useState("all-users");

    return (
        <div className="p-3">
            <div className="box">
                <div className="box-header sm:flex block !justify-start dark:bg-bodybg bg-white">
                    <nav aria-label="Tabs" className="md:flex block !justify-start whitespace-nowrap">
                        <button
                            onClick={() => setActiveTab("all-users")}
                            className={`m-1 block w-full py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                                activeTab === "all-users"
                                    ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                                    : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                            }`}
                        >
                            All Users
                        </button>
                        <button
                            onClick={() => setActiveTab("pending-approvals")}
                            className={`m-1 block w-full py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${
                                activeTab === "pending-approvals"
                                    ? "hs-tab-active:bg-primary/10 hs-tab-active:text-primary text-primary bg-primary/10"
                                    : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                            }`}
                        >
                            Pending Approvals
                        </button>
                    </nav>
                </div>

                <div className="box-content bg-white">
                    {activeTab === "all-users" && <UserManagementList />}
                    {activeTab === "pending-approvals" && <PendingApprovalsTable />}
                </div>
            </div>
        </div>
    );
};

export default EmailManagementList;
