import React from 'react';
import TaskHeaderFilter from "@modules/project-management/components/task/TaskHeaderFilter.jsx";
import TaskHeaderSort from "@modules/project-management/components/task/TaskHeaderSort.jsx";

const columnHeaders = [
    { key: 'actions', label: 'Actions' },
    { key: 'priority', label: 'Priority' },
    { key: 'name', label: 'Task Name' },
    { key: 'person', label: 'Person' },
    { key: 'teams', label: 'Teams' },
    { key: 'started_at', label: 'Started Date' },
    { key: 'aging', label: 'Aging' },
    { key: 'ended_at', label: 'Deadline' },
    { key: 'completed_at', label: 'Completion Date' },
    { key: 'status', label: 'Status' },
    { key: 'completion_timeline', label: 'Completion Timeline' },
    { key: 'time_line_group', label: 'Timeline Groups' },
    { key: 'launch', label: 'Launch' },
    { key: 'progress', label: 'Progress' },
    { key: 'external_users', label: 'External Users' },
    { key: 'created_by', label: 'Created By' }
];

const TaskTableHeader = ({
                             isChild,
                             viewOnly,
                             sortConfig,
                             filters,
                             columnOrder,
                             visibleColumns,
                             handleSortRequest,
                             handleMoveColumn,
                             setFilters,
                             projectUsers,
                             milestoneLaunch,
                             heightFilter
                         }) => {
    const orderedVisibleHeaders = columnOrder
        .map(key => columnHeaders.find(h => h.key === key))
        .filter(header => header && visibleColumns[header.key] && (header.key !== 'actions' || !viewOnly))
        .map(header => isChild && header.key === 'name' ?
            { ...header, label: 'Sub Task Name' } :
            header
        );

    return (
        <>
            {orderedVisibleHeaders.map((header) => {
                const isFilterable = ['name', 'status', 'priority', 'person', 'started_at', 'ended_at', 'completed_at', 'launch'].includes(header.key);
                const isSortable = !['actions', 'person', 'teams', 'external_users'].includes(header.key);

                return (
                    <th key={header.key} scope="col" className="relative text-center">
                        <div className="flex items-center justify-center p-2 gap-2">
                            <span>{header.label}</span>
                            <div className="flex items-center gap-1">
                                {isFilterable && (
                                    header.key !== 'person' || (header.key === 'person' && projectUsers?.length > 0)
                                ) && (
                                    <TaskHeaderFilter
                                        header={header}
                                        filters={filters}
                                        setFilters={setFilters}
                                        projectUsers={projectUsers}
                                        milestoneLaunch={milestoneLaunch}
                                        heightFilter={heightFilter}
                                    />
                                )}
                                    <TaskHeaderSort
                                        header={header}
                                        sortConfig={sortConfig}
                                        handleSortRequest={handleSortRequest}
                                        handleMoveColumn={handleMoveColumn}
                                        orderedVisibleHeaders={orderedVisibleHeaders}
                                        isSortable={isSortable}
                                    />
                            </div>
                        </div>
                    </th>
                );
            })}
        </>
    );
};

export default TaskTableHeader;