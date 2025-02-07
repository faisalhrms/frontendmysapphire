import React, { useEffect } from 'react';
import PageHeader from '@modules/layouts/includes/PageHeader.jsx';
import KanbanColumn from '@modules/project-management/components/task/KanbanColumn.jsx';  // Import the new KanbanColumn component
import LoadingSpinner from '@components/LoadingSpinner.jsx';
import { taskStatuses } from '@modules/project-management/services/taskService.js';
import { useSearch, useTaskFilter, useKanbanStatusInfinite } from '@modules/project-management/hooks/taskHooks.js';
import TaskPriorityDropdown from '@modules/project-management/components/dropdowns/TaskPriorityDropdown.jsx';
import { useWatch } from 'react-hook-form';

const TaskKanBan = () => {
    const { searchQuery, handleSearchChange } = useSearch();
    const { filterControl, filterErrors, resetFilter } = useTaskFilter();
    const priority = useWatch({ control: filterControl, name: 'priority' });
    const { kanbanData, isLoading, isError, error, loadMore, loadingStatus, refetch } = useKanbanStatusInfinite({
        filterPriority: priority,
        searchQuery,
    });

    useEffect(() => {
        refetch();
    }, [refetch, searchQuery, filterControl?.priority]);

    // Function to filter tasks based on priority and search query
    const filterTasks = (tasks) => {
        return tasks
            .filter((task) => task.name.toLowerCase().includes(searchQuery.toLowerCase())) // Filter tasks by search query
            .filter((task) => {
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
                    {error?.message || 'Error loading Kanban board'}
                </div>
            ) : (
                <div className="ynex-kanban-board text-defaulttextcolor dark:text-defaulttextcolor/70 text-defaultsize">
                    <div className="flex overflow-x-auto">
                        {/* Loop through all task statuses */}
                        {taskStatuses.map(({value: statusKey, label: statusLabel}) => {
                            const statusData = kanbanData?.[statusKey];
                            const tasks = statusData?.tasks || [];
                            const totalCount = statusData?.task_count || 0;

                            return (
                                <KanbanColumn
                                    key={`${statusKey}-${statusLabel}`}  // Use combination of statusKey and statusLabel as the unique key
                                    statusKey={statusKey}
                                    statusLabel={statusLabel}
                                    tasks={tasks}
                                    loadMore={loadMore}
                                    loadingStatus={loadingStatus}
                                    totalCount={totalCount}
                                    filterTasks={filterTasks}
                                />
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    );
};

export default TaskKanBan;
