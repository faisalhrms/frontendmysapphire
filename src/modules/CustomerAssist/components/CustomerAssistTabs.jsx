import LoadingSpinner from "@components/LoadingSpinner.jsx";
import FormSection from "@modules/CustomerAssist/components/CustomerAssistMainList.jsx";
import ComplainOnlineForm from "@modules/CustomerAssist/components/ComplainOnlineForm.jsx";
import React, { useState } from "react";
import ComplainAtStoreForm from "@modules/CustomerAssist/components/ComplainAtStoreForm.jsx";


const CustomerAssistTabs = ({ error, isLoading, data }) => {
    const [activeTab, setActiveTab] = useState("online_customer");

    return (
        <>
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <div className="box-header sm:flex block !justify-start">
                            <nav aria-label="Tabs" className="md:flex block !justify-start whitespace-nowrap">
                                <button
                                    onClick={() => setActiveTab("online_customer")}
                                    className={`m-1 block w-full cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md hover:text-primary ${
                                        activeTab === "online_customer" ? "bg-primary/10 text-primary" : ""
                                    }`}
                                >
                                    Online Customer
                                </button>
                                <button
                                    onClick={() => setActiveTab("complain_at_store")}
                                    className={`m-1 block w-full cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md hover:text-primary ${
                                        activeTab === "complain_at_store" ? "bg-primary/10 text-primary" : ""
                                    }`}
                                >
                                    Complain At Store
                                </button>
                                <button
                                    onClick={() => setActiveTab("complain_online_dynamics")}
                                    className={`m-1 block w-full cursor-pointer text-defaulttextcolor dark:text-defaulttextcolor/70 py-2 px-3 flex-grow text-[0.75rem] font-medium rounded-md hover:text-primary ${
                                        activeTab === "complain_online_dynamics" ? "bg-primary/10 text-primary" : ""
                                    }`}
                                >
                                    Complain Online Dynamics
                                </button>
                            </nav>
                        </div>

                        <div className="box-body">
                            {activeTab === "online_customer" && (
                                <div>
                                    {error && (
                                        <div className="mt-2 text-rose-600 text-center font-medium bg-rose-50 border border-rose-200 p-2 rounded-md">
                                            {error}
                                        </div>
                                    )}
                                    {isLoading ? (
                                        <div className="flex justify-center mt-4">
                                            <LoadingSpinner />
                                        </div>
                                    ) : (
                                        data && <FormSection data={data} />
                                    )}
                                </div>
                            )}

                            {activeTab === "complain_at_store" && (
                                <div>
                                    <ComplainAtStoreForm />
                                </div>
                            )}

                            {activeTab === "complain_online_dynamics" && (
                                <div>
                                    <ComplainOnlineForm />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CustomerAssistTabs;

