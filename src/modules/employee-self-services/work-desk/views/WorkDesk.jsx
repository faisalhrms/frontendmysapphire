import React, {Fragment, useState} from "react";
import {Link} from "react-router-dom";
import Pagination from "@components/Pagination.jsx";
import {useSearchHook} from "@hooks/useSearchHook.js";
import {
    useCompleted,
    useInProgress,
    usePending
} from "@modules/employee-self-services/hooks/work-desk/workDeskHooks.js";
import TaskList from "@modules/employee-self-services/work-desk/components/TaskCard.jsx";

const WorkDesk = () => {
    const [activeTab, setActiveTab] = useState("pending");
    const { searchTerm, currentPage, setCurrentPage, handleSearchChange } = useSearchHook();

    const { pendingData, isLoading: isPendingLoading } = activeTab === "pending" ? usePending(currentPage, 8, searchTerm) : {};
    const { inProgressData, isLoading: isInProgressLoading } = activeTab === "in-progress" ? useInProgress(currentPage, 8, searchTerm) : {};
    const { completedData, isLoading: isCompletedLoading } = activeTab === "completed" ? useCompleted(currentPage, 8, searchTerm) : {};

    const totalPages = Math.ceil(
        (activeTab === "pending" ? pendingData?.total :
        activeTab === "in-progress" ? inProgressData?.total :
        completedData?.total) / 8
    ) || 0;

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <Fragment>
            <div className="grid grid-cols-12 gap-6 mt-1">
                <div className="xl:col-span-12 col-span-12">
                    <div className="grid grid-cols-12 gap-x-6">
                        <div className="xl:col-span-12 col-span-12">
                            <div className="box">
                                <div className="box-body !p-0">
                                    <div className="md:flex px-4 py-6 items-center justify-between">
                                        <div>
                                            <h6 className="font-semibold mb-0 text-[1rem]">My Work Desk</h6>
                                        </div>
                                        <div className="mt-2 md:mt-0">
                                            <nav className="flex sm:space-x-6 flex-wrap">
                                                <button
                                                    onClick={() => setActiveTab("pending")}
                                                    className={`w-full sm:w-auto hs-tab-active:font-semibold hs-tab-active:text-primary hs-tab-active:bg-primary/10 rounded-md py-2 px-3 text-sm ${
                                                        activeTab === "pending"
                                                            ? "text-primary bg-primary/10"
                                                            : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                                                    }`}
                                                >
                                                    Pending
                                                </button>
                                                <button
                                                    onClick={() => setActiveTab("in-progress")}
                                                    className={`w-full sm:w-auto hs-tab-active:font-semibold hs-tab-active:text-primary hs-tab-active:bg-primary/10 rounded-md py-2 px-3 text-sm ${
                                                        activeTab === "in-progress"
                                                            ? "text-primary bg-primary/10"
                                                            : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                                                    }`}
                                                >
                                                    In Progress
                                                </button>
                                                <button
                                                    onClick={() => setActiveTab("completed")}
                                                    className={`w-full sm:w-auto hs-tab-active:font-semibold hs-tab-active:text-primary hs-tab-active:bg-primary/10 rounded-md py-2 px-3 text-sm ${
                                                        activeTab === "completed"
                                                            ? "text-primary bg-primary/10"
                                                            : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                                                    }`}
                                                >
                                                    Completed
                                                </button>
                                            </nav>
                                        </div>
                                        <div className="mt-2 md:mt-0">
                                            <div className="hs-dropdown ti-dropdown">
                                                <button type="button" aria-label="button"
                                                        className="ti-btn ti-btn-sm ti-btn-light !mb-0"
                                                        aria-expanded="false">
                                                    <i className="ti ti-dots-vertical"></i>
                                                </button>
                                                <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="xl:col-span-12 col-span-12">
                            <div className="tab-content task-tabs-container">
                                {activeTab === "pending" && (
                                    <TaskList tasks={pendingData?.rows} statusLabel="Pending"/>
                                )}
                                {activeTab === "in-progress" && (
                                    <TaskList tasks={inProgressData?.rows} statusLabel="In Progress"/>
                                )}
                                {activeTab === "completed" && (
                                    <TaskList tasks={completedData?.rows} statusLabel="Completed"/>
                                )}
                            </div>
                        <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                paginationDisabled={
                                    activeTab === "pending" && isPendingLoading ||
                                    activeTab === "in-progress" && isInProgressLoading ||
                                    activeTab === "completed" && isCompletedLoading
                                }
                                onPageChange={handlePageChange}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </Fragment>
    );
};

export default WorkDesk;
