import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDelete } from "@hooks/useDelete.js";
import { useTaskDetailModal } from "@modules/project-management/hooks/taskHooks.js";
import { setColumnOrder } from "@modules/project-management/redux/pmsSlice.js";
import TaskDetailModalPortal from "@modules/project-management/components/task/TaskDetailModalPortal.jsx";
import TaskTableRow from "@modules/project-management/components/task/TaskTableRow.jsx";
import TaskTableHeader from "@modules/project-management/components/task/TaskTableHeader.jsx";
import {useForm} from "react-hook-form";
import TaskQuickAdd from "@modules/project-management/components/task/TaskQuickAdd.jsx";

const TaskTable = ({
                       projectStatus,
                       projectUsers,
                       tasks,
                       openTaskModal,
                       milestoneStatus,
                       milestoneLaunch,
                       startedAt = null,
                       endedAt = null,
                       projectId = null,
                       milestoneId = null,
                       isChild = false,
                       refetch,
                       openTaskOverdueModal,
                       viewOnly = false,
                   }) => {
    const [activeTaskId, setActiveTaskId] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filters, setFilters] = useState({})
    const { control, handleSubmit, formState: { errors } } = useForm();

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const dispatch = useDispatch();
    const columnOrder = useSelector((state) => state.pms.columnOrder);
    const visibleColumns = useSelector((state) => state.pms.visibleColumns);
    const [height,setHeight] = React.useState(false);

    const { handleDeleteClick } = useDelete();
    const {
        openTaskDetailModal,
        closeTaskDetailModal,
        isTaskDetailModalOpen,
        isTaskDetailLoading,
        task: modalTaskData,
    } = useTaskDetailModal();

    const userId = useSelector((state) => state.auth.user?.id);
    const currentUser = useSelector((state) => state.auth.user)
    const projectUser = useMemo(() => {
        if (!viewOnly) {
            return projectUsers.find((user) => user.id === userId);
        }
        return null;
    }, [projectUsers, userId, viewOnly]);

    const processedTasks = useMemo(() => {
        let filteredTasks = [...tasks];

        if (Object.keys(filters).length > 0) {
            filteredTasks = filteredTasks.filter(task => {
                return Object.keys(filters).every(key => {
                    const filterValue = filters[key];
                    if (!filterValue) return true;
                    switch (key) {
                        case 'name':
                            return task.name.toLowerCase().includes(filterValue.toLowerCase());
                        case 'status':
                        case 'priority':
                            return task[key] === filterValue;
                        case 'person':
                            return task.users.some(user => user.id === filterValue);
                        case 'started_at':
                        case 'ended_at':
                        case 'completed_at':
                        case 'launch':
                            const taskDate = new Date(task[key] || milestoneLaunch);
                            const startDate = filterValue.start ? new Date(filterValue.start) : null;
                            const endDate = filterValue.end ? new Date(filterValue.end) : null;
                            if (startDate && endDate) {
                                return taskDate >= startDate && taskDate <= endDate;
                            } else if (startDate) {
                                return taskDate >= startDate;
                            } else if (endDate) {
                                return taskDate <= endDate;
                            }
                            return true;
                        default:
                            return true;
                    }
                });
            });
        }

        if (sortConfig.key) {
            filteredTasks.sort((a, b) => {
                let valA = a[sortConfig.key];
                let valB = b[sortConfig.key];
                if (['started_at', 'ended_at', 'completed_at', 'launch'].includes(sortConfig.key)) {
                    valA = new Date(valA || (sortConfig.key === 'launch' ? milestoneLaunch : null));
                    valB = new Date(valB || (sortConfig.key === 'launch' ? milestoneLaunch : null));
                }
                if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return filteredTasks;
    }, [tasks, filters, sortConfig, milestoneLaunch]);

    const handleSortRequest = (key) => {
        const isAsc = sortConfig.key === key && sortConfig.direction === 'asc';
        setSortConfig({ key, direction: isAsc ? 'desc' : 'asc' });
    };

    const handleMoveColumn = (key, direction) => {
        const visibleOrderedKeys = columnOrder.filter(k => visibleColumns[k] && (k !== 'actions' || !viewOnly));
        const currentVisibleIndex = visibleOrderedKeys.indexOf(key);
        const targetVisibleIndex = direction === 'left' ? currentVisibleIndex - 1 : currentVisibleIndex + 1;

        if (targetVisibleIndex >= 0 && targetVisibleIndex < visibleOrderedKeys.length) {
            const newOrder = [...columnOrder];
            const keyToSwapWith = visibleOrderedKeys[targetVisibleIndex];
            const originalIndex = newOrder.indexOf(key);
            const swapIndex = newOrder.indexOf(keyToSwapWith);
            [newOrder[originalIndex], newOrder[swapIndex]] = [newOrder[swapIndex], newOrder[originalIndex]];
            dispatch(setColumnOrder(newOrder));
        }
    };


const heightFilter = (val)=>{
    setHeight(val);
}

    return (
        <>
            {!viewOnly && !isChild && (
                <TaskQuickAdd
                    milestoneId={milestoneId}
                    projectId={projectId}
                    startedAt={startedAt}
                    endedAt={endedAt}
                    projectUsers={projectUsers}
                    onTaskCreated={refetch}
                    teams={tasks[0]?.teams}
                    tags={tasks[0]?.tags}
                    currentUser={currentUser}
                    heightFilter={heightFilter}
                />
            )}
            <div className={`table-responsive task-table overflow-hidden transition-all duration-300 ${
                height ? 'min-h-[600px]' : 'min-h-[100px]'
            }`}>
                <table className="table whitespace-nowrap table-bordered min-w-full">
                    <thead>
                    <tr className="border-b border-defaultborder">
                        <TaskTableHeader
                            isChild={isChild}
                            viewOnly={viewOnly}
                            sortConfig={sortConfig}
                            filters={filters}
                            columnOrder={columnOrder}
                            visibleColumns={visibleColumns}
                            handleSortRequest={handleSortRequest}
                            handleMoveColumn={handleMoveColumn}
                            setFilters={setFilters}
                            projectUsers={projectUsers}
                            milestoneLaunch={milestoneLaunch}
                            setIsFilterOpen={setIsFilterOpen}
                            heightFilter={heightFilter}
                        />
                    </tr>
                    </thead>
                    <tbody>
                    {processedTasks.map((task) => (
                        <TaskTableRow
                            key={task.id}
                            task={task}
                            control={control}
                            errors={errors}
                            isChild={isChild}
                            activeTaskId={activeTaskId}
                            setActiveTaskId={setActiveTaskId}
                            projectStatus={projectStatus}
                            projectUsers={projectUsers}
                            projectUser={projectUser}
                            viewOnly={viewOnly}
                            milestoneStatus={milestoneStatus}
                            milestoneLaunch={milestoneLaunch}
                            startedAt={startedAt}
                            endedAt={endedAt}
                            openTaskModal={openTaskModal}
                            openTaskOverdueModal={openTaskOverdueModal}
                            openTaskDetailModal={openTaskDetailModal}
                            handleDeleteClick={handleDeleteClick}
                            refetch={refetch}
                            columnOrder={columnOrder}
                            visibleColumns={visibleColumns}
                        />
                    ))}
                    {processedTasks.length === 0 && (
                        <tr>
                            <td colSpan={Object.keys(visibleColumns).filter(k => visibleColumns[k]).length} className="text-center p-4">
                                No tasks match the current filters.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            {isTaskDetailModalOpen && (
                <TaskDetailModalPortal
                    task={modalTaskData}
                    isLoading={isTaskDetailLoading}
                    closeModal={closeTaskDetailModal}
                    viewOnly={viewOnly}
                />
            )}
        </>
    );
};

export default React.memo(TaskTable);