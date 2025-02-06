import React, { useEffect } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import Select from "react-select";
import PerfectScrollbar from "react-perfect-scrollbar";
import TaskCard from "@modules/project-management/components/task/TaskCard.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import mediaSvg from "@assets/images/media/media-83.svg";
import { taskStatuses } from "@modules/project-management/services/taskService.js";
import { useSearch, usePriorityFilter, useKanbanStatusInfinite } from "@modules/project-management/hooks/taskHooks.js";

const TaskKanBan = () => {
    const { searchQuery, handleSearchChange } = useSearch();
    const { priorityFilter, handlePriorityFilterChange, handleClearPriorityFilter } = usePriorityFilter();
    const { kanbanData, isLoading, isError, error, loadMore, loadingStatus, refetch } = useKanbanStatusInfinite({ filterPriority: priorityFilter, searchQuery });

    useEffect(() => {
        refetch();
    }, [refetch]);

    const filterTasks = (tasks) => {
        return tasks
            .filter((task) => {
                return task.name.toLowerCase().includes(searchQuery.toLowerCase());
            })
            .filter((task) => {
                return priorityFilter ? task.priority === priorityFilter.value : true;
            });
    };

    return (
        <>
            <PageHeader currentpage="Kanban Board" activepage="Task" mainpage="Kanban Board" />

            <div className="grid grid-cols-12 gap-x-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <div className="box-body p-4">
                            <div className="md:flex items-center justify-between flex-wrap gap-4">
                                <div className="grid grid-cols-12 gap-2 md:w-[30%]">
                                    <div className="xl:col-span-7 col-span-12 flex items-center gap-2">
                                        <Select
                                            name="priority"
                                            options={[
                                                { value: "high", label: "High" },
                                                { value: "medium", label: "Medium" },
                                                { value: "low", label: "Low" },
                                            ]}
                                            onChange={handlePriorityFilterChange}
                                            value={priorityFilter}
                                            className="w-full !rounded-md"
                                            menuPlacement="auto"
                                            classNamePrefix="Select2"
                                        />
                                        {priorityFilter && (
                                            <button
                                                className="ti-btn ti-btn-light w-full !mb-0"
                                                type="button"
                                                onClick={handleClearPriorityFilter}
                                            >
                                                Clear Filter
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Search Input */}
                                <div className="flex" role="search">
                                    <input
                                        className="form-control w-full !rounded-sm me-2"
                                        type="search"
                                        placeholder="Search by Task Name"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        aria-label="Search"
                                    />
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
                            const statusData = kanbanData?.[statusKey];
                            if (!statusData) {
                                return (
                                    <div className="kanban-tasks-type" style={{ minWidth: "320px" }} key={statusKey}>
                                        <div className="mb-4">
                                            <span className="block font-semibold text-[.9375rem]">{statusLabel} - 0</span>
                                        </div>
                                        <PerfectScrollbar style={{ height: "560px" }}>
                                            <div className="text-center text-sm text-gray-500 bg-white rounded-md dark:text-white/50">
                                                <img src={mediaSvg} alt="No tasks available" className="mx-auto" />
                                            </div>
                                        </PerfectScrollbar>
                                    </div>
                                );
                            }

                            const tasks = statusData.tasks || [];
                            const totalCount = statusData.task_count || 0;
                            const filteredTasks = filterTasks(tasks);

                            return (
                                <div className={`kanban-tasks-type ${statusKey}`} key={statusKey} style={{ minWidth: "320px" }}>
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center">
                      <span className="block font-semibold text-[.9375rem]">
                        {statusLabel} - {totalCount}
                      </span>
                                        </div>
                                    </div>

                                    <div className="kanban-tasks">
                                        <PerfectScrollbar style={{ height: "560px" }}>
                                            {filteredTasks.length > 0 ? (
                                                <>
                                                    {filteredTasks.map((task) => (
                                                        <TaskCard key={task.id} task={task} />
                                                    ))}

                                                    {filteredTasks.length < totalCount && (
                                                        <div className="m-4 text-center">
                                                            <button
                                                                className="ti-btn ti-btn-primary"
                                                                onClick={() => loadMore(statusKey)}
                                                                disabled={loadingStatus === statusKey}
                                                            >
                                                                {loadingStatus === statusKey ? "Loading..." : "View More"}
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
            )}
        </>
    );
};

export default TaskKanBan;
