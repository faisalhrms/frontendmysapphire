
import React from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import { Link } from "react-router-dom";
import Select from "react-select";
import mediaSvg from "@assets/images/media/media-83.svg";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useKanbanStatusInfinite } from "@modules/project-management/hooks/useKanbanStatusInfinite";
import TaskCard from "@modules/project-management/components/task/TaskCard.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import {taskStatuses} from "@modules/project-management/services/taskService.js";  // Import TaskCard

const TaskKanBan = () => {
    return (
        <>
            <PageHeader currentpage="Kanban Board" activepage="Task" mainpage="Kanban Board" />

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
                                            <i className="ri-add-line !text-[1rem]"></i>New Board
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

            {/* Kanban Board - each status as a column in a horizontal scroll */}
            <div className="ynex-kanban-board text-defaulttextcolor dark:text-defaulttextcolor/70 text-defaultsize">
                <div className="flex space-x-4 overflow-x-auto">
                    {taskStatuses.map(({ value: statusKey, label: statusLabel }) => {
                        const {
                            data,
                            isLoading,
                            isError,
                            error,
                            fetchNextPage,
                            hasNextPage,
                            isFetchingNextPage,
                        } = useKanbanStatusInfinite(statusKey);

                        // Flatten all pages into a single tasks array
                        const tasks =
                            data?.pages.flatMap((page) => page?.data?.[statusKey]?.tasks || []) || [];
                        // Get total tasks count (from the first page)
                        const taskCount = data?.pages[0]?.data?.[statusKey]?.task_count || 0;

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
                      {statusLabel} - {taskCount}
                    </span>
                                    </div>
                                </div>

                                <div className="kanban-tasks">
                                    <PerfectScrollbar style={{ height: "560px" }}>
                                        {isLoading ? (
                                            <div className="text-center text-sm text-gray-500 dark:text-white/50">
                                               <LoadingSpinner/>
                                            </div>
                                        ) : isError ? (
                                            <div className="text-center text-sm text-red-500">
                                                {error?.message || "Error loading tasks"}
                                            </div>
                                        ) : tasks.length > 0 ? (
                                            <>
                                                {tasks.map((task) => (
                                                    <TaskCard key={task.id} task={task} />
                                                ))}

                                                {hasNextPage && (
                                                    <div className="m-4 text-center">
                                                        <button
                                                            className="ti-btn ti-btn-primary"
                                                            onClick={() => fetchNextPage()}
                                                            disabled={isFetchingNextPage}
                                                        >
                                                            {isFetchingNextPage ? "Loading..." : "View More"}
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-center text-sm text-gray-500 bg-white rounded-md dark:text-white/50">
                                                <img src={mediaSvg} alt="No tasks available" className="mx-auto" />
                                            </div>
                                        )}
                                    </PerfectScrollbar>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default TaskKanBan;
