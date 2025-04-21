import React, {useMemo, useState} from 'react';
import {getExcerptFromText, toTitleCase} from "@helpers/formatters.js";
import {getBadgeClasses, getStatusClasses} from "@helpers/badges.js";
import {formatDate} from "@helpers/dateTime.js";
import AvatarList from "@components/AvatarList.jsx";
import {Link} from "react-router-dom";
import Tooltip from '@components/Tooltip.jsx';
import {PMS_ROUTES} from "@modules/project-management/routes.js";
import Avatar from "@components/Avatar.jsx";
import TaskStatusDropdown from "@modules/project-management/components/dropdowns/TaskStatusDropdown.jsx";
import HasProjectPermission from "@modules/project-management/components/project/HasProjectPermission.jsx";
import {useSelector} from "react-redux";
import ProgressBar from "@components/ProgressBar.jsx";
import {useDelete} from "@hooks/useDelete.js";
import TaskDeadLineItem from "@modules/project-management/components/task/TaskDeadLineItem.jsx";
import {useTaskDetailModal} from "@modules/project-management/hooks/taskHooks.js";
import TaskDetailModal from "@modules/project-management/components/model/TaskDetailModal.jsx";

const TaskTable = ({projectStatus, projectUsers, tasks, openTaskModal, milestoneStatus, milestoneLaunch, startedAt = null, endedAt = null, isChild = false, refetch, openTaskOverdueModal, viewOnly = false, needTarget = false }) => {
    const [activeTaskId, setActiveTaskId] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const toggleSubTasks = (taskId) => {
        setActiveTaskId(prevId => (prevId === taskId ? null : taskId));
    };
    const userId = useSelector((state) => state.auth.user?.id);
    const projectUser = useMemo(() => {
        if (!viewOnly) {
            return projectUsers.find((user) => user.id === userId);
        }
        return null;
    }, [projectUsers, userId, viewOnly]);


    const { handleDeleteClick } = useDelete();
    const {
        openTaskDetailModal,
        closeTaskDetailModal,
        isTaskDetailModalOpen,
        isTaskDetailLoading,
        task,
    } = useTaskDetailModal()




    const sortedTasks = useMemo(() => {
        let sortableTasks = [...tasks];
        if (sortConfig.key !== null) {
            sortableTasks.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableTasks;
    }, [tasks, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortIconAndClass = (key) => {
        if (sortConfig.key === key) {
            return {
                icon: sortConfig.direction === 'asc' ? '↑' : '↓',
                className: 'text-dark',
            };
        }
        return {
            icon: '⇅',
            className: 'text-gray-500',
        };
    };



    return (
        <>
           <div className={`table-responsive task-table`}>

                <table className="table whitespace-nowrap table-bordered min-w-full">
                    <thead>
                    <tr className="border-b border-defaultborder">
                        {!viewOnly && <th scope="col">Actions</th>}
                        <th
                            scope="col"
                            onClick={() => requestSort('priority')}
                            className="cursor-pointer"
                        >
                            Priority
                            <span className={`ml-1 ${getSortIconAndClass('priority').className}`}>
                                {getSortIconAndClass('priority').icon}
                            </span>
                        </th>

                        <th
                            scope="col"

                            className="cursor-pointer"
                        >
                            {isChild ? "Sub Task Name" : "Task Name"}
                            <span className={`ml-1 ${getSortIconAndClass('name').className}`}>
                                {getSortIconAndClass('name').icon}
                            </span>
                        </th>
                        <th scope="col">Person</th>
                        <th scope="col">Teams</th>
                        <th
                            scope="col"
                            onClick={() => requestSort('started_at')}
                            className="cursor-pointer"
                        >
                            Started Date
                            <span className={`ml-1 ${getSortIconAndClass('started_at').className}`}>
                                {getSortIconAndClass('started_at').icon}
                            </span>
                        </th>
                        <th
                            scope="col"
                            onClick={() => requestSort('aging')}
                            className="cursor-pointer"
                        >
                            Aging
                            <span className={`ml-1 ${getSortIconAndClass('aging').className}`}>
                                {getSortIconAndClass('aging').icon}
                            </span>
                        </th>
                        <th
                            scope="col"
                            onClick={() => requestSort('ended_at')}
                            className="cursor-pointer"
                        >
                            Deadline
                            <span className={`ml-1 ${getSortIconAndClass('ended_at').className}`}>
                                {getSortIconAndClass('ended_at').icon}
                            </span>
                        </th>
                        <th
                            scope="col"
                            onClick={() => requestSort('completed_at')}
                            className="cursor-pointer"
                        >
                            Completion Date
                            <span className={`ml-1 ${getSortIconAndClass('completed_at').className}`}>
                                {getSortIconAndClass('completed_at').icon}
                            </span>
                        </th>
                        <th
                            scope="col"
                            onClick={() => requestSort('status')}
                            className="cursor-pointer"
                        >
                            Status
                            <span className={`ml-1 ${getSortIconAndClass('status').className}`}>
                                {getSortIconAndClass('status').icon}
                            </span>
                        </th>
                        <th
                            scope="col"
                            onClick={() => requestSort('completion_timeline')}
                            className="cursor-pointer"
                        >
                            Completion Timeline
                            <span className={`ml-1 ${getSortIconAndClass('completion_timeline').className}`}>
                                {getSortIconAndClass('completion_timeline').icon}
                            </span>
                        </th>
                        <th
                            scope="col"
                            onClick={() => requestSort('time_line_group')}
                            className="cursor-pointer"
                        >
                            Timeline Groups
                            <span className={`ml-1 ${getSortIconAndClass('time_line_group').className}`}>
                                {getSortIconAndClass('time_line_group').icon}
                            </span>
                        </th>
                        <th
                            scope="col"
                            onClick={() => requestSort('launch')}
                            className="cursor-pointer"
                        >
                            Launch
                            <span className={`ml-1 ${getSortIconAndClass('launch').className}`}>
                                {getSortIconAndClass('launch').icon}
                            </span>
                        </th>
                        <th
                            scope="col"
                            onClick={() => requestSort('progress')}
                            className="cursor-pointer"
                        >
                            Progress
                            <span className={`ml-1 ${getSortIconAndClass('progress').className}`}>
                                {getSortIconAndClass('progress').icon}
                            </span>
                        </th>
                        <th scope="col">External Users</th>
                        <th
                            scope="col"
                            onClick={() => requestSort('created_by')}
                            className="cursor-pointer"
                        >
                            Created By
                            <span className={`ml-1 ${getSortIconAndClass('created_by').className}`}>
                                {getSortIconAndClass('created_by').icon}
                            </span>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedTasks.map((task) => (
                        <React.Fragment key={task.id}>
                            <tr className={`border-b border-defaultborder}`}>
                                {
                                    !viewOnly &&
                                    (
                                        <td>
                                        <span className={`${!projectUser?.can_view_only ? 'flex space-x-2' : ''}`}>
                                     {(() => {
                                         if (!projectUser?.can_view_only) {
                                             return (
                                                 task.is_overdue &&
                                                 <Tooltip
                                                     id={`add-tooltip-${task.id}-overdue`}
                                                     tooltipContent={`Request For Change (${task.name}) Due Date`}
                                                 >
                                                     <button
                                                         onClick={() => openTaskOverdueModal(task.id, task.ended_at, task.name, startedAt, endedAt)}
                                                         className='ti-btn ti-btn-danger ti-btn-sm'>
                                                         <i className="ri-calendar-2-line align-middle"></i>
                                                     </button>
                                                 </Tooltip>
                                             )
                                         }
                                     })()}
                                            <HasProjectPermission globalPermission='add_task' users={projectUsers} needIcon={true}>
                                            {milestoneStatus === 'active' && task.status !== 'under_approval' && (
                                                <Tooltip
                                                    id={`add-tooltip-${task.id}-add`}
                                                    tooltipContent={`Add Sub Task To (${task.name})`}
                                                >
                                                    <button
                                                        onClick={() => openTaskModal(task.milestone_id, task.started_at, task.ended_at, task.requires_approval, task.id)}
                                                        className='ti-btn ti-btn-success ti-btn-sm'>
                                                        <i className="ri-add-circle-line align-middle"></i>
                                                    </button>
                                                </Tooltip>
                                            )
                                            }

                                          </HasProjectPermission>

                                        <HasProjectPermission globalPermission='change_task' users={projectUsers}>
                                            {task.status !== 'under_approval' &&
                                                <Tooltip
                                                    id={`edit-tooltip-${task.id}-edit`}
                                                    tooltipContent={`Edit (${task.name})`}
                                                >
                                                    <button
                                                        onClick={() => openTaskModal(task.id, startedAt, endedAt, task.requires_approval, null, true)}
                                                        className='ti-btn ti-btn-primary ti-btn-sm'>
                                                        <i className="ri-edit-line align-middle"></i>
                                                    </button>
                                                </Tooltip>
                                            }
                                        </HasProjectPermission>
                                        <HasProjectPermission globalPermission='delete_project' users={projectUsers}>
                                            {
                                                task.status !== 'under_approval' &&
                                                <Tooltip
                                                    id={`delete-task-tooltip-${task.id}`}
                                                    tooltipContent={`Delete Task (${task.name})`}>
                                                    <button
                                                        onClick={() => handleDeleteClick(`/pms/tasks/${task.id}/delete/`, task.name, refetch)}
                                                        className='ti-btn ti-btn-danger ti-btn-sm'>
                                                        <i className="ri-delete-bin-2-line align-middle"></i>
                                                    </button>
                                                </Tooltip>
                                            }
                                        </HasProjectPermission>
                                               <Tooltip
                                                   id={`view-task-tooltip-${task.id}`}
                                                   tooltipContent={`View Task (${task.name})`}>
                                                   <Link to={PMS_ROUTES.TASK.DETAIL.path.replace(':id', task.id)}>
                                                        <i className="ri-eye-line"></i>
                                                   </Link>
                                                </Tooltip>
                                    </span>
                                        </td>
                                    )
                                }
                                <td><span className={getBadgeClasses(task.priority)}>{toTitleCase(task.priority)}</span>
                                </td>
                                <td>
                                    <span className="flex items-center text-[0.80rem] text-[#323338]">
                                        <span onClick={() => toggleSubTasks(task.id)}>
                                            {task.children && task.children.length > 0 && (
                                                <svg
                                                    className={`w-4 h-4 mr-2 cursor-pointer text-dark ${activeTaskId === task.id ? 'transform rotate-90' : ''}`}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            )}
                                        </span>
                                        <Tooltip
                                            id={`task-tooltip-${task.id}`}
                                            tooltipContent={`${task.name}`}>
                                            <span
                                                onClick={() => {
                                                    openTaskDetailModal(task.id);
                                                }}
                                            >
                                    {getExcerptFromText(task.name, 80)}
                                                    </span>
                                        </Tooltip>
                                    </span>
                                </td>
                                <td className='text-center'><AvatarList users={task.users} max={4}/></td>
                                <td>
                                    {task.teams?.map(team => toTitleCase(team.name)).join(', ')}
                                </td>
                                <td>{formatDate(task.started_at)}</td>
                                <td>{task?.aging} Days</td>
                                <td>
                                    <div className="flex items-center">
                                      <TaskDeadLineItem task={task} />
                                    </div>
                                </td>



                                <td>{formatDate(task.completed_at)}</td>
                                <td className={`min-w-[200px] ${(projectUser?.can_view_only || viewOnly) ? `!p-0 ${getBadgeClasses(task.status, '', false)}` : ''}`}>
                                    {(() => {
                                        if (projectUser?.can_view_only || viewOnly) {
                                            return toTitleCase(task.status);
                                        }
                                        return task.status !== 'under_approval' ? (
                                            <TaskStatusDropdown status={task.status} taskId={task.id} refetch={refetch}/>
                                        ) : (
                                            <p className={getStatusClasses(task.status)}>{toTitleCase(task.status)}</p>
                                        );
                                    })()}
                                </td>
                                <td className='text-center'>{task.completion_timeline}</td>
                                <td className='text-center'>{task.time_line_group}</td>
                                <td className='text-center'>{milestoneLaunch ? formatDate(milestoneLaunch) : ''}</td>
                                <td className="min-w-[200px]">
                                    <div className='flex items-center'>
                                        <ProgressBar value={task.progress} barColor='!bg-success' withStatus={false}/>
                                    </div>
                                </td>
                                <td><AvatarList users={task.external_users} max={4}/></td>
                                <td className="min-w-[180px]">
                                    <div className="flex items-center flex-wrap">
                                        <div className="me-2 leading-none">
                                            <Avatar avatar={task?.created_by?.avatar} size='xs'/>
                                        </div>
                                        <span>{toTitleCase(task?.created_by?.full_name)}</span>
                                    </div>
                                </td>
                            </tr>
                            {activeTaskId === task.id && task.children && task.children.length > 0 && (
                                <tr>
                                    <td colSpan="8">
                                        <TaskTable projectStatus={projectStatus} projectUsers={projectUsers}
                                                   milestoneStatus={milestoneStatus} milestoneLaunch={milestoneLaunch}
                                                   startedAt={task.started_at} endedAt={task.ended_at}
                                                   tasks={task.children} openTaskModal={openTaskModal} isChild={true}
                                                   refetch={refetch} openTaskOverdueModal={openTaskOverdueModal}
                                                   openTaskDetailModal={openTaskDetailModal} viewOnly={viewOnly}
                                        />
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>))}
                    </tbody>
                </table>
            </div>

            {
                isTaskDetailModalOpen &&
                <TaskDetailModal task={task} isLoading={isTaskDetailLoading} closeModal={closeTaskDetailModal} />
            }
        </>

    );
};

export default React.memo(TaskTable)