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
import TaskDetailModalPortal from "@modules/project-management/components/task/TaskDetailModalPortal.jsx";

const TaskTable = ({projectStatus, projectUsers, tasks, openTaskModal, milestoneStatus, milestoneLaunch, startedAt = null, endedAt = null, isChild = false, refetch, openTaskOverdueModal, viewOnly = false, visibleColumns = useSelector((state) => state.pms.visibleColumns),}) => {
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

    const columnHeaders = [
        { key: 'actions', label: 'Actions', visible: !viewOnly && visibleColumns.actions },
        { key: 'priority', label: 'Priority', visible: visibleColumns.priority },
        { key: 'name', label: isChild ? 'Sub Task Name' : 'Task Name', visible: visibleColumns.name },
        { key: 'person', label: 'Person', visible: visibleColumns.person },
        { key: 'teams', label: 'Teams', visible: visibleColumns.teams },
        { key: 'started_at', label: 'Started Date', visible: visibleColumns.started_at },
        { key: 'aging', label: 'Aging', visible: visibleColumns.aging },
        { key: 'ended_at', label: 'Deadline', visible: visibleColumns.ended_at },
        { key: 'completed_at', label: 'Completion Date', visible: visibleColumns.completed_at },
        { key: 'status', label: 'Status', visible: visibleColumns.status },
        { key: 'completion_timeline', label: 'Completion Timeline', visible: visibleColumns.completion_timeline },
        { key: 'time_line_group', label: 'Timeline Groups', visible: visibleColumns.time_line_group },
        { key: 'launch', label: 'Launch', visible: visibleColumns.launch },
        { key: 'progress', label: 'Progress', visible: visibleColumns.progress },
        { key: 'external_users', label: 'External Users', visible: visibleColumns.external_users },
        { key: 'created_by', label: 'Created By', visible: visibleColumns.created_by }
    ];

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
                        {columnHeaders.map((header) => (
                            header.visible && (
                                <th
                                    key={header.key}
                                    scope="col"
                                    onClick={['actions', 'person', 'teams', 'external_users'].includes(header.key) ? undefined : () => requestSort(header.key)}
                                    className={`${['actions', 'person', 'teams', 'external_users'].includes(header.key) ? '' : 'cursor-pointer'}`}
                                >
                                    {header.label}
                                    {['actions', 'person', 'teams', 'external_users'].includes(header.key) ? null : (
                                        <span className={`ml-1 ${getSortIconAndClass(header.key).className}`}>
                                            {getSortIconAndClass(header.key).icon}
                                        </span>
                                    )}
                                </th>
                            )
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {sortedTasks.map((task) => (
                        <React.Fragment key={task.id}>
                            <tr className={`border-b border-defaultborder}`}>
                                {!viewOnly && visibleColumns.actions && (
                                    <td>
                      <span className={`${!projectUser?.can_view_only ? 'flex space-x-2' : ''}`}>
                        {task.is_overdue && !projectUser?.can_view_only && (
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
                        )}
                          <HasProjectPermission globalPermission='pms.add_task' users={projectUsers} needIcon={true}>
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
                          )}
                        </HasProjectPermission>
                        <HasProjectPermission globalPermission='pms.change_task' users={projectUsers}>
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
                        <HasProjectPermission globalPermission='pms.delete_project' users={projectUsers}>
                          {task.status !== 'under_approval' &&
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
                          <Link to={PMS_ROUTES.TASK.DETAIL.path.replace(':id', task.id)}
                                className='ti-btn ti-btn-info ti-btn-sm'>
                            <i className="ri-eye-line"></i>
                          </Link>
                        </Tooltip>
                      </span>
                                    </td>
                                )}
                                {visibleColumns.priority && (
                                    <td><span
                                        className={getBadgeClasses(task.priority)}>{toTitleCase(task.priority)}</span>
                                    </td>
                                )}
                                {visibleColumns.name && (
                                    <td>
                      <span className="flex items-center dark:text-gray-200 dark:bg-bodybg">
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
                          <Link
                              onClick={() => {
                                  openTaskDetailModal(task.id)
                              }}
                              to="#">
                            {getExcerptFromText(task.name, 60)}
                              {task.has_attachments && (
                                  <span className='ml-1 text-primary text-[0.8rem]' title="Has attachments">
                                <i className="bi bi-paperclip"></i>
                              </span>
                              )}
                          </Link>
                        </Tooltip>
                      </span>
                                    </td>
                                )}
                                {visibleColumns.person && (
                                    <td className='text-center'><AvatarList users={task.users} max={4}/></td>
                                )}
                                {visibleColumns.teams && (
                                    <td>
                                        {task.teams?.map(team => toTitleCase(team.name)).join(', ')}
                                    </td>
                                )}
                                {visibleColumns.started_at && (
                                    <td>{formatDate(task.started_at)}</td>
                                )}
                                {visibleColumns.aging && (
                                    <td>{task?.aging} Days</td>
                                )}
                                {visibleColumns.ended_at && (
                                    <td>
                                        <div className="flex items-center">
                                            <TaskDeadLineItem task={task}/>
                                        </div>
                                    </td>
                                )}
                                {visibleColumns.completed_at && (
                                    <td>{formatDate(task.completed_at)}</td>
                                )}
                                {visibleColumns.status && (
                                    <td className={`min-w-[200px] ${(projectUser?.can_view_only || viewOnly) ? `!p-0 ${getBadgeClasses(task.status, '', false)}` : ''}`}>
                                        {(() => {
                                            if (projectUser?.can_view_only || viewOnly) {
                                                return toTitleCase(task.status);
                                            }
                                            return task.status !== 'under_approval' ? (
                                                <TaskStatusDropdown status={task.status} taskId={task.id}
                                                                    refetch={refetch}/>
                                            ) : (
                                                <p className={getStatusClasses(task.status)}>{toTitleCase(task.status)}</p>
                                            );
                                        })()}
                                    </td>
                                )}
                                {visibleColumns.completion_timeline && (
                                    <td className='text-center'>{task.completion_timeline}</td>
                                )}
                                {visibleColumns.time_line_group && (
                                    <td className='text-center'>{task.time_line_group}</td>
                                )}
                                {visibleColumns.launch && (
                                    <td className='text-center'>{milestoneLaunch ? formatDate(milestoneLaunch) : ''}</td>
                                )}
                                {visibleColumns.progress && (
                                    <td className="min-w-[200px]">
                                        <div className='flex items-center'>
                                            <ProgressBar value={task.progress} barColor='!bg-success'
                                                         withStatus={false}/>
                                        </div>
                                    </td>
                                )}
                                {visibleColumns.external_users && (
                                    <td><AvatarList users={task.external_users} max={4}
                                                    full_name={task.avatar?.full_name || 'N/A'}/></td>
                                )}
                                {visibleColumns.created_by && (
                                    <td className="min-w-[180px]">
                                        <div className="flex items-center flex-wrap">
                                            <div className="me-2 leading-none">
                                                <Avatar avatar={task?.created_by?.avatar} size='xs'
                                                        full_name={task.created_by?.full_name || 'N/A'}/>
                                            </div>
                                            <span>{toTitleCase(task?.created_by?.full_name)}</span>
                                        </div>
                                    </td>
                                )}
                            </tr>
                            {activeTaskId === task.id && task.children && task.children.length > 0 && (
                                <tr>
                                    <td colSpan={columnHeaders.filter(h => h.visible).length}>
                                        <TaskTable
                                            projectStatus={projectStatus}
                                            projectUsers={projectUsers}
                                            milestoneStatus={milestoneStatus}
                                            milestoneLaunch={milestoneLaunch}
                                            startedAt={task.started_at}
                                            endedAt={task.ended_at}
                                            tasks={task.children}
                                            openTaskModal={openTaskModal}
                                            isChild={true}
                                            refetch={refetch}
                                            openTaskOverdueModal={openTaskOverdueModal}
                                            visibleColumns={visibleColumns}
                                            viewOnly={viewOnly}
                                        />
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                    </tbody>
                </table>
            </div>
            {
                isTaskDetailModalOpen &&
                <TaskDetailModalPortal
                    task={task}
                    isLoading={isTaskDetailLoading}
                    closeModal={closeTaskDetailModal}
                />
            }
        </>

    );
};

export default React.memo(TaskTable)