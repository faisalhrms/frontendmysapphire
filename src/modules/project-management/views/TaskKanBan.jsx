import React from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import { Link } from "react-router-dom";
import Select from "react-select";
import PerfectScrollbar from "react-perfect-scrollbar";

import TaskCard from "@modules/project-management/components/task/TaskCard.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import mediaSvg from "@assets/images/media/media-83.svg";

// The statuses array
import { taskStatuses } from "@modules/project-management/services/taskService.js";

// The new hook
import { useKanbanStatusInfinite } from "@modules/project-management/hooks/useKanbanStatusInfinite.js";

const TaskKanBan = () => {
    const {
        kanbanData,    // All statuses' data in one object
        isLoading,
        isError,
        error,
        loadMore,
        loadingStatus, // Which status is currently "loading more"
    } = useKanbanStatusInfinite();

    return (
        <>
            <PageHeader
                currentpage="Kanban Board"
                activepage="Task"
                mainpage="Kanban Board"
            />

            <div className="grid grid-cols-12 gap-x-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <div className="box-body p-4">
                            <div className="md:flex items-center justify-between flex-wrap gap-4">
                                <div className="grid grid-cols-12 gap-2 md:w-[30%]">
                                    <div className="xl:col-span-5 col-span-12">
                                        <Link
                                            to="#"
                                            className="hs-dropdown-toggle ti-btn bg-primary text-white !font-medium"
                                            data-hs-overlay="#add-board"
                                        >
                                            <i className="ri-add-line !text-[1rem]" />
                                            New Board
                                        </Link>
                                    </div>
                                    <div className="xl:col-span-7 col-span-12">
                                        <Select
                                            name="colors"
                                            options={[]}
                                            className="w-full !rounded-md"
                                            menuPlacement="auto"
                                            classNamePrefix="Select2"
                                        />
                                    </div>
                                </div>
                                <div className="flex" role="search">
                                    <input
                                        className="form-control w-full !rounded-sm me-2"
                                        type="search"
                                        placeholder="Search"
                                        aria-label="Search"
                                    />
                                    <button className="ti-btn ti-btn-light !mb-0" type="submit">
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center mt-4">
                    <LoadingSpinner />
                </div>
            ) : isError ? (
                <div className="text-center text-red-500 mt-4">
                    {error?.message || "Error loading Kanban board"}
                </div>
            ) : (
                <div className="ynex-kanban-board text-defaulttextcolor dark:text-defaulttextcolor/70 text-defaultsize">
                    <div className="flex space-x-4 overflow-x-auto">
                        {taskStatuses.map(({ value: statusKey, label: statusLabel }) => {
                            // If we have no data object for this status
                            const statusData = kanbanData?.[statusKey];
                            if (!statusData) {
                                return (
                                    <div
                                        className="kanban-tasks-type"
                                        style={{ minWidth: "320px" }}
                                        key={statusKey}
                                    >
                                        <div className="mb-4">
                      <span className="block font-semibold text-[.9375rem]">
                        {statusLabel} - 0
                      </span>
                                        </div>
                                        <PerfectScrollbar style={{ height: "560px" }}>
                                            <div className="text-center text-sm text-gray-500 bg-white rounded-md dark:text-white/50">
                                                <img
                                                    src={mediaSvg}
                                                    alt="No tasks available"
                                                    className="mx-auto"
                                                />
                                            </div>
                                        </PerfectScrollbar>
                                    </div>
                                );
                            }

                            // If we do have data for this status
                            const tasks = statusData.tasks || [];
                            const totalCount = statusData.task_count || 0;

                            return (
                                <div
                                    className={`kanban-tasks-type ${statusKey}`}
                                    key={statusKey}
                                    style={{ minWidth: "320px" }}
                                >
                                    {/* Column Header */}
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center">
                      <span className="block font-semibold text-[.9375rem]">
                        {statusLabel} - {totalCount}
                      </span>
                                        </div>
                                    </div>

                                    <div className="kanban-tasks">
                                        <PerfectScrollbar style={{ height: "560px" }}>
                                            {tasks.length > 0 ? (
                                                <>
                                                    {tasks.map(task => <TaskCard key={task.id} task={task} />)}


                                                    {/* If we have fewer tasks in state than the total => show "View More" */}
                                                    {tasks.length < totalCount && (
                                                        <div className="m-4 text-center">
                                                            <button
                                                                className="ti-btn ti-btn-primary"
                                                                onClick={() => loadMore(statusKey)}
                                                                disabled={loadingStatus === statusKey}
                                                            >
                                                                {loadingStatus === statusKey
                                                                    ? "Loading..."
                                                                    : "View More"}
                                                            </button>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="text-center text-sm text-gray-500 bg-white rounded-md dark:text-white/50">
                                                    <img
                                                        src={mediaSvg}
                                                        alt="No tasks available"
                                                        className="mx-auto"
                                                    />
                                                </div>
                                            )}
                                        </PerfectScrollbar>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
};

export default TaskKanBan;
