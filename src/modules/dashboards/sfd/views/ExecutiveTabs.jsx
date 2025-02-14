
import React, { useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import ExecutiveForm from "@modules/dashboards/sfd/components/ExecutiveForm.jsx";
import AgingForm from "@modules/dashboards/sfd/components/AgingForm.jsx";

const ExecutiveTabs = () => {
    const [activeTab, setActiveTab] = useState("orderSource");
    const [load, setLoad] = useState(false);

    return (
        <>
            <PageHeader currentpage="Salesforce Dashboard" />
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="bg-white flex items-center justify-between px-4 py-3 rounded-lg shadow-md">
                        <nav className="flex space-x-4">
                            <Link
                                to="#"
                                className="m-1 block hs-tab-active:bg-primary/10 hs-tab-active:text-primary cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md hover:text-primary active"
                                id="Personal-item"
                                data-hs-tab="#generate-report"
                                aria-controls="#generate-report"
                            >
                                Executive Summary
                            </Link>
                            <Link
                                to="#"
                                className="m-1 block hs-tab-active:bg-primary/10 hs-tab-active:text-primary cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 text-[0.75rem] flex-grow font-medium rounded-md hover:text-primary"
                                id="account-item"
                                data-hs-tab="#replenishment-history"
                                aria-controls="replenishment-history"
                            >
                                Aging’s for Pending Liabilities
                            </Link>
                        </nav>
                    </div>

                    <div className="tab-content bg-white  rounded-lg shadow-md mt-4">
                        <div className="tab-pane show active" id="generate-report"
                             aria-labelledby="generate-report" role="tabpanel">
                            <ExecutiveForm/>
                        </div>


                        <div className="tab-pane hidden mt-6" id="replenishment-history"
                             aria-labelledby="replenishment-history" role="tabpanel">
                            <AgingForm/>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
};

export default ExecutiveTabs;
