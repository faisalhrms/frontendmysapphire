import React, { Fragment, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Pagination from "@components/Pagination.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useSearchHook } from "@hooks/useSearchHook.js";
import {
  useCompleted,
  useInProgress,
  usePending,
  useClosed,
  useUnreadAssignedCounts
} from "@modules/employee-self-services/hooks/work-desk/workDeskHooks.js";
import TaskList from "@modules/employee-self-services/work-desk/components/TaskCard.jsx";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";

const WorkDesk = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get("status") || "pending");
  const { searchTerm, currentPage, setCurrentPage, handleSearchChange } = useSearchHook();

  const { data: pendingData, isLoading: isPendingLoading } =
    activeTab === "pending" ? usePending(currentPage, 9, searchTerm) : {};
  const { data: inProgressData, isLoading: isInProgressLoading } =
    activeTab === "in-progress" ? useInProgress(currentPage, 9, searchTerm) : {};
  const { data: completedData, isLoading: isCompletedLoading } =
    activeTab === "completed" ? useCompleted(currentPage, 9, searchTerm) : {};
  const { data: closedData, isLoading: isClosedLoading } =
    activeTab === "closed" ? useClosed(currentPage, 9, searchTerm) : {};

  const { unreadCounts, refetch: refetchUnread } = useUnreadAssignedCounts();

  useEffect(() => {
    setActiveTab(searchParams.get("status") || "pending");
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  useEffect(() => {
    refetchUnread();
  }, [activeTab, refetchUnread]);

  const totalPages =
    Math.ceil(
      (activeTab === "pending"
        ? pendingData?.total
        : activeTab === "in-progress"
        ? inProgressData?.total
        : activeTab === "completed"
        ? completedData?.total
        : closedData?.total || 0) / 9
    ) || 0;

  const rows =
    activeTab === "pending"
      ? pendingData?.rows || []
      : activeTab === "in-progress"
      ? inProgressData?.rows || []
      : activeTab === "completed"
      ? completedData?.rows || []
      : closedData?.rows || [];

  const filteredRows = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return rows.filter(task => {
      const sr = task.sr_number.toLowerCase();
      const reporter = task.reporter.toLowerCase();
      return sr.includes(term) || reporter.includes(term);
    });
  }, [rows, searchTerm]);

  const handlePageChange = newPage => {
    setCurrentPage(newPage);
  };

  const badge = value =>
    value > 0 && (
      <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-white text-[0.625rem] transition-all duration-200 ease-in-out">
        {value}
      </span>
    );

  const isLoading =
    activeTab === "pending"
      ? isPendingLoading
      : activeTab === "in-progress"
      ? isInProgressLoading
      : activeTab === "completed"
      ? isCompletedLoading
      : isClosedLoading;

  return (
    <Fragment>
      <PageHeader currentpage="Work Desk" activepage="work desk" mainpage="work desk" />
      <div className="grid grid-cols-12 gap-6 mt-1">
        <div className="xl:col-span-12 col-span-12">
          <div className="grid grid-cols-12 gap-x-6">
            <div className="xl:col-span-12 col-span-12">
              <div className="box">
                <div className="box-body !p-0">
                  <div className="md:flex px-4 py-6 items-center justify-between">
                    <h6 className="font-semibold mb-0 text-[1rem]">My Work Desk</h6>
                    <nav className="flex sm:space-x-6 flex-wrap">
                      <button
                        onClick={() => setSearchParams({ status: "pending" })}
                        className={`relative w-full sm:w-auto hs-tab-active:font-semibold hs-tab-active:text-primary hs-tab-active:bg-primary/10 rounded-md py-2 px-3 text-sm ${
                          activeTab === "pending"
                            ? "text-primary bg-primary/10"
                            : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                        }`}
                      >
                        Pending
                        {badge(unreadCounts.pending)}
                      </button>
                      <button
                        onClick={() => setSearchParams({ status: "in-progress" })}
                        className={`relative w-full sm:w-auto hs-tab-active:font-semibold hs-tab-active:text-primary hs-tab-active:bg-primary/10 rounded-md py-2 px-3 text-sm ${
                          activeTab === "in-progress"
                            ? "text-primary bg-primary/10"
                            : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                        }`}
                      >
                        In Progress
                        {badge(unreadCounts.generated)}
                      </button>
                      <button
                        onClick={() => setSearchParams({ status: "completed" })}
                        className={`relative w-full sm:w-auto hs-tab-active:font-semibold hs-tab-active:text-primary hs-tab-active:bg-primary/10 rounded-md py-2 px-3 text-sm ${
                          activeTab === "completed"
                            ? "text-primary bg-primary/10"
                            : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                        }`}
                      >
                        Completed
                        {badge(unreadCounts.completed)}
                      </button>
                      <button
                        onClick={() => setSearchParams({ status: "closed" })}
                        className={`relative w-full sm:w-auto hs-tab-active:font-semibold hs-tab-active:text-primary hs-tab-active:bg-primary/10 rounded-md py-2 px-3 text-sm ${
                          activeTab === "closed"
                            ? "text-primary bg-primary/10"
                            : "text-defaulttextcolor dark:text-defaulttextcolor/70 hover:text-primary"
                        }`}
                      >
                        Closed
                        {badge(unreadCounts.closed)}
                      </button>
                    </nav>
                    <div className="mt-2 md:mt-0">
                      <div className="flex" role="search">
                        <input
                          className="form-control w-full !rounded-sm me-2"
                          type="search"
                          placeholder="SR Number or Requester"
                          onChange={handleSearchChange}
                          aria-label="Search"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="xl:col-span-12 col-span-12">
              <div className="tab-content task-tabs-container">
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <TaskList tasks={filteredRows} statusLabel={activeTab.replace("-", " ")} />
                )}
              </div>
              {!isLoading && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  paginationDisabled={
                    (activeTab === "pending" && isPendingLoading) ||
                    (activeTab === "in-progress" && isInProgressLoading) ||
                    (activeTab === "completed" && isCompletedLoading) ||
                    (activeTab === "closed" && isClosedLoading)
                  }
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default WorkDesk;
