import React, { useEffect } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import PerfectScrollbar from "react-perfect-scrollbar";
import TaskCard from "@modules/project-management/components/task/TaskCard.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import mediaSvg from "@assets/images/media/media-83.svg";
import { taskStatuses } from "@modules/project-management/services/taskService.js";
import { useSearch, useTaskFilter, useKanbanStatusInfinite } from "@modules/project-management/hooks/taskHooks.js";
import TaskPriorityDropdown from "@modules/project-management/components/dropdowns/TaskPriorityDropdown.jsx";
import { useWatch } from "react-hook-form";

const TaskKanBan = () => {
    const { searchQuery, handleSearchChange } = useSearch();
    const { filterControl, filterErrors, resetFilter } = useTaskFilter();
    const priority = useWatch({ control: filterControl, name: "priority" });
    const { kanbanData, isLoading, isError, error, loadMore, loadingStatus, refetch } = useKanbanStatusInfinite({ filterPriority: priority, searchQuery });

    useEffect(() => {
        refetch();
    }, [refetch, searchQuery, filterControl?.priority]);

    // Function to filter tasks based on priority and search query
    const filterTasks = (tasks) => {
        return tasks
            .filter((task) => task.name.toLowerCase().includes(searchQuery.toLowerCase())) // Filter tasks by search query
            .filter((task) => {
                // Apply the priority filter if it is set
                const filterPriority = filterControl?.priority?.value; // Ensure the value is correctly extracted
                return filterPriority ? task.priority === filterPriority : true; // if no priority is set, do not filter by priority
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
                                        {/* TaskPriorityDropdown for filtering tasks by priority */}
                                        <TaskPriorityDropdown
                                            control={filterControl} // Pass the control from useTaskFilter
                                            errors={filterErrors} // Pass errors for validation
                                            haveLabel={false}
                                        />
                                        {filterControl?.priority && (
                                            <button
                                                className="ti-btn ti-btn-light w-full !mb-0"
                                                type="button"
                                                onClick={resetFilter} // Reset the filter when clicked
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

            {/* Loading or Error Message */}
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
                    <div className="flex overflow-x-auto">
                        {/* Loop through all task statuses */}
                        {taskStatuses.map(({ value: statusKey, label: statusLabel }) => {
                            const statusData = kanbanData?.[statusKey];
                            if (!statusData || !statusData.tasks || statusData.tasks.length === 0) {
                                return (
                                    <div className="kanban-tasks-type min-w-[320px]" key={statusKey}>
                                        <div className="mb-4">
                                            <span className="block font-semibold text-[.9375rem]">{statusLabel} - 0</span>
                                        </div>
                                        <PerfectScrollbar className="h-[560px]">
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
                                <div className={`kanban-tasks-type ${statusKey} min-w-[320px]`} key={statusKey}>
                                    <div className="mb-4">
                                        <div className="flex justify-between items-center">
                                            <span className="block font-semibold text-[.9375rem]">
                                                {statusLabel} - {totalCount}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="kanban-tasks">
                                        <PerfectScrollbar className="h-[560px]">
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
