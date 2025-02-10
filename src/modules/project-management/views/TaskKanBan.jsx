import React, {useEffect, useMemo} from 'react';
import PageHeader from '@modules/layouts/includes/PageHeader.jsx';
import TaskKanbanList from '@modules/project-management/components/task/TaskKanbanList.jsx';
import LoadingSpinner from '@components/LoadingSpinner.jsx';
import { taskStatuses } from '@modules/project-management/services/taskService.js';
import {  useKanbanStatusInfinite } from '@modules/project-management/hooks/taskHooks.js';
import TaskPriorityDropdown from '@modules/project-management/components/dropdowns/TaskPriorityDropdown.jsx';
import { useWatch } from 'react-hook-form';
import {useSearchHook} from "@hooks/useSearchHook.js";
import useFilters from "@hooks/useFilters.js";

const TaskKanBan = () => {
    const {  searchTerm,
        handleSearchChange } = useSearchHook();

    const {
        control,
        handleSubmit,
        errors,
        getFilters
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: 'priority'},
                ],
            }),
            []
        )
    );

    const priority = useWatch({ control, name: 'priority' });

    const { kanbanData, isLoading, isError, error, loadMore, loadingStatus } = useKanbanStatusInfinite({
        filterPriority: priority,
        searchQuery: searchTerm,
    });

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
                        {taskStatuses.map(({value: statusKey, label: statusLabel}) => {
                            const statusData = kanbanData?.[statusKey];
                            const tasks = statusData?.tasks || [];
                            const totalCount = statusData?.task_count || 0;

                            return (
                                <TaskKanbanList
                                    key={`${statusKey}-${statusLabel}`}
                                    statusKey={statusKey}
                                    statusLabel={statusLabel}
                                    tasks={tasks}
                                    loadMore={loadMore}
                                    loadingStatus={loadingStatus}
                                    totalCount={totalCount}
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
