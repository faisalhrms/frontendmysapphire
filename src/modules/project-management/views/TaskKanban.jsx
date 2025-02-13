import React, { useMemo, useState } from 'react';
import PageHeader from '@modules/layouts/includes/PageHeader.jsx';
import TaskKanbanList from '@modules/project-management/components/task/TaskKanbanList.jsx';
import LoadingSpinner from '@components/LoadingSpinner.jsx';
import { taskStatuses } from '@modules/project-management/services/taskService.js';
import { useKanbanStatusInfinite } from '@modules/project-management/hooks/taskHooks.js';
import TaskPriorityDropdown from '@modules/project-management/components/dropdowns/TaskPriorityDropdown.jsx';
import { useWatch } from 'react-hook-form';
import { useSearchHook } from "@hooks/useSearchHook.js";
import useFilters from "@hooks/useFilters.js";
import TaskFilterDropdown from "@modules/project-management/components/dropdowns/TaskFilterDropdown.jsx";

const TaskKanban = () => {
    const { searchTerm, handleSearchChange } = useSearchHook();

    const {
        control,
        handleSubmit,
        errors,
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'priority' },
                    { name: 'filterColumns' },
                ],
            }),
            []
        )
    );

    const priority = useWatch({ control, name: 'priority' });
    const [selectedColumns, setSelectedColumns] = useState([]); // Track selected columns (statuses)

    const { kanbanData, isLoading, isError, error, loadMore, loadingStatus } = useKanbanStatusInfinite({
        filterPriority: priority,
        searchQuery: searchTerm,
    });

    // Update the selected columns whenever the user selects or deselects task statuses
    const handleColumnFilterChange = (selectedStatuses) => {
        console.log('trigger', selectedStatuses); // Check if selected statuses are being passed correctly
        setSelectedColumns(selectedStatuses); // Update selected columns in the parent
    };

    // Client-side filtering of tasks based on selected statuses
    const filteredKanbanData = useMemo(() => {
        if (selectedColumns.length === 0) {
            return kanbanData;
        }

        const filteredData = {};
        taskStatuses.forEach(({ value }) => {
            if (selectedColumns.includes(value)) {
                filteredData[value] = kanbanData[value]; // Only include columns that match selected statuses
            }
        });

        return filteredData;
    }, [selectedColumns, kanbanData]);

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
                                        <TaskPriorityDropdown
                                            control={control}
                                            errors={errors}
                                            haveLabel={false}
                                        />
                                    </div>
                                </div>

                                {/* Column Filter Dropdown */}
                                <TaskFilterDropdown
                                    control={control}
                                    errors={errors}
                                    selectedStatuses={selectedColumns}
                                    onChange={handleColumnFilterChange}  // Update selected statuses
                                />

                                {/* Search Bar */}
                                <div className="flex" role="search">
                                    <input
                                        className="form-control w-full !rounded-sm me-2"
                                        type="search"
                                        placeholder="Search by Task Name"
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
            ) : (
                <div className="ynex-kanban-board text-defaulttextcolor dark:text-defaulttextcolor/70 text-defaultsize">
                    <div className="flex overflow-x-auto">
                        {Object.keys(filteredKanbanData).length === 0 ? (
                            <div className="text-center mt-4">No tasks match the selected filters.</div>
                        ) : (
                            Object.keys(filteredKanbanData).map((statusKey) => {
                                const statusData = filteredKanbanData[statusKey] || {};
                                return (
                                    <TaskKanbanList
                                        key={statusKey}
                                        statusKey={statusKey}
                                        statusLabel={taskStatuses.find(status => status.value === statusKey)?.label || statusKey}
                                        tasks={statusData.tasks || []}
                                        loadMore={loadMore}
                                        loadingStatus={loadingStatus}
                                        totalCount={statusData.task_count || 0}
                                    />
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default TaskKanban;
