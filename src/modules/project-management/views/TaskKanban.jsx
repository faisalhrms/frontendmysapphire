import React from "react";
import TaskKanbanList from "@modules/project-management/components/task/TaskKanbanList.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import { useKanbanBoard } from "@modules/project-management/hooks/taskHooks.js";
import { useSearchHook } from "@hooks/useSearchHook.js";
import useFilters from "@hooks/useFilters.js";
import ProjectPriorityDropdown from "@modules/project-management/components/dropdowns/ProjectPriorityDropdown.jsx";
import { useWatch } from "react-hook-form";
import {Columns} from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

const TaskKanban = () => {
    const { searchTerm, handleSearchChange } = useSearchHook();
    const { control, errors } = useFilters({
        initialFilters: [{ name: 'priority' }],
    });
    const priority = useWatch({ control, name: 'priority' });
    const { kanbanData, isLoading, loadMore, refetch, hasMore, loadingStatuses } = useKanbanBoard({
        filterPriority: priority,
        searchQuery: searchTerm,
    });

    return (
        <>
            <IconPageHeader
                heading="Task Kanban Board"
                description="Visualize and manage tasks across different stages"
                icon={Columns}
            />

            <div className="grid grid-cols-12 gap-x-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box">
                        <div className="box-body p-4">
                            <div className="md:flex items-center justify-between flex-wrap gap-4">
                                <div className="grid grid-cols-12 gap-2 md:w-[30%]">
                                    <div className="xl:col-span-7 col-span-12 flex items-center gap-2">
                                        <ProjectPriorityDropdown
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
                    <LoadingSpinner/>
                </div>
            ) : (
                <div className="ynex-kanban-board text-defaulttextcolor dark:text-defaulttextcolor/70 text-defaultsize">
                    <div className="flex overflow-x-auto space-x-4">
                        {kanbanData &&
                            Object.entries(kanbanData).map(([status, data]) => (
                                <TaskKanbanList
                                    key={`task-${status}`}
                                    status={status}
                                    tasks={data.tasks}
                                    totalCount={data.task_count}
                                    loadMore={loadMore}
                                    refetch={refetch}
                                    isLoading={loadingStatuses[status] || false}
                                    hasMoreTasks={hasMore[status]}
                                />
                            ))}
                    </div>
                </div>
            )}
            <div id="modal-root"></div>
        </>
    );
};

export default TaskKanban;
