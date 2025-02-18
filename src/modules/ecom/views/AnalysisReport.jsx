import React, { useState } from "react";
import { Link } from "react-router-dom";
import AnalysisTable from "../components/AnalysisTable.jsx";
import PageHeader from "../../layouts/includes/PageHeader.jsx";


const AnalysisReport = () => {
    const [activeTab, setActiveTab] = useState("orderSource");
    const [load, setLoad] = useState(false);

    return (
        <>
            <PageHeader currentpage="E-Commerce" />
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="bg-white flex items-center justify-between px-4 py-3 rounded-lg shadow-md">
                        <nav className="flex space-x-4">
                            <Link
                                to="#"
                                className={`m-1 block w-full hs-tab-active:bg-primary/10 hs-tab-active:text-primary cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md ${activeTab === "orderSource" ? "bg-primary text-white" : ""}`}
                                onClick={() => setActiveTab("orderSource")}
                            >
                                Order Source
                            </Link>
                        </nav>
                    </div>

                        <div className="tab-content">
                            <div className="bg-white mt-4 rounded-lg">
                                {activeTab === "orderSource" && (
                                    <div className="tab-pane show active" id="order-source"
                                         aria-labelledby="order-source" role="tabpanel">
                                        <AnalysisTable
                                            title="Order Source"
                                            headers={[
                                                { label: "Group", accessor: "group" },
                                                { label: "Orders", accessor: "site" },
                                                { label: "Orders Value", accessor: "orders" },
                                                { label: "Items Per Order", accessor: "itemsPerOrder" },
                                            ]}
                                            loading={load}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

            </div>
        </>
    );
};

export default AnalysisReport ;
