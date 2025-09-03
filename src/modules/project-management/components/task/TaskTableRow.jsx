import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { PMS_ROUTES } from "@modules/project-management/routes.js";
import { getExcerptFromText, toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses, getStatusClasses } from "@helpers/badges.js";
import { formatDate } from "@helpers/dateTime.js";
import AvatarList from "@components/AvatarList.jsx";
import Tooltip from "@components/Tooltip.jsx";
import Avatar from "@components/Avatar.jsx";
import TaskStatusDropdown from "@modules/project-management/components/dropdowns/TaskStatusDropdown";
import HasProjectPermission from "@modules/project-management/components/project/HasProjectPermission.jsx";
import ProgressBar from "@components/ProgressBar.jsx";
import TaskDeadLineItem from "@modules/project-management/components/task/TaskDeadLineItem.jsx";
import TaskTable from "@modules/project-management/components/project/TaskTable.jsx";
import SetActiveUserModalPortal from "@modules/project-management/components/task/SetActiveUserModalPortal.jsx";
import useSetActiveUserModal from "@modules/project-management/hooks/taskHooks.js";
import EditableCompletionDate from "@modules/project-management/components/task/EditableCompletionDate.jsx";

const TaskTableRow = ({
                          task,
                          control,
                          errors,
                          isChild,
                          activeTaskId,
                          setActiveTaskId,
                          projectStatus,
                          projectUsers,
                          projectUser,
                          viewOnly,
                          milestoneStatus,
                          milestoneLaunch,
                          startedAt,
                          endedAt,
                          openTaskModal,
                          openTaskOverdueModal,
                          openTaskDetailModal,
                          handleDeleteClick,
                          refetch,
                          columnOrder,
                          visibleColumns,
                      }) => {
    const toggleSubTasks = (taskId) => {
        setActiveTaskId(prevId => (prevId === taskId ? null : taskId));
    };

    const {
        isOpen,
        openModal,
        closeModal,
        getCurrentActiveUserIds,
        handleUpdate,
    } = useSetActiveUserModal({ task, refetch });


    const renderCell = (columnKey) => {
        switch (columnKey) {
            case 'actions':
                return renderActionsCell();
            case 'priority':
                return <td className={getBadgeClasses(task.priority, '', false)}>{toTitleCase(task.priority)}</td>;
            case 'name':
                return renderNameCell();
            case 'person':
                return <td className='text-center'><AvatarList users={task.users} max={5} /></td>;
            case 'teams':
                return <td>{task.teams?.map(team => toTitleCase(team.name)).join(', ')}</td>;
            case 'started_at':
                return <td>{formatDate(task.started_at)}</td>;
            case 'aging':
                return <td>{task?.aging} Days</td>;
            case 'ended_at':
                return <td><div className="flex items-center"><TaskDeadLineItem task={task} /></div></td>;
            case 'completed_at':
                return (
                    <td>
                        <EditableCompletionDate
                            task={task}
                            control={control}
                            errors={errors}
                            minDate={startedAt}
                        />
                    </td>
                );
            case 'status':
                return (
                    <td className={`min-w-[200px] ${(projectUser?.can_view_only || viewOnly) ? `!p-0 ${getBadgeClasses(task.status, '', false)}` : ''}`}>
                        {(() => {
                            if (projectUser?.can_view_only || viewOnly) return toTitleCase(task.status);
                            return task.status !== 'under_approval' ? (
                                <TaskStatusDropdown status={task.status} taskId={task.id} refetch={refetch} />
                            ) : (
                                <p className={getStatusClasses(task.status)}>{toTitleCase(task.status)}</p>
                            );
                        })()}
                    </td>
                );
            case 'completion_timeline':
                return <td className='text-center'>{task.completion_timeline}</td>;
            case 'time_line_group':
                return <td className='text-center'>{task.time_line_group}</td>;
            case 'launch':
                return <td className='text-center'>{milestoneLaunch ? formatDate(milestoneLaunch) : ''}</td>;
            case 'progress':
                return (
                    <td className="min-w-[200px]">
                        <div className='flex items-center'>
                            <ProgressBar value={task.progress} barColor='!bg-success' withStatus={false} />
                        </div>
                    </td>
                );
            case 'external_users':
                return <td><AvatarList users={task.external_users} max={4} full_name={task.avatar?.full_name || 'N/A'} /></td>;
            case 'created_by':
                return (
                    <td className="min-w-[180px]">
                        <div className="flex items-center flex-wrap">
                            <div className="me-2 leading-none">
                                <Avatar avatar={task?.created_by?.avatar} size='xs' full_name={task.created_by?.full_name || 'N/A'} />
                            </div>
                            <span>{toTitleCase(task?.created_by?.full_name)}</span>
                        </div>
                    </td>
                );
            default:
                return <td key={columnKey}></td>;
        }
    };

    const renderActionsCell = () => {
        return (
            <td>
        <span className={`${!projectUser?.can_view_only ? 'flex space-x-2' : ''}`}>
          {task.is_overdue && !projectUser?.can_view_only && (
              <Tooltip id={`add-tooltip-${task.id}-overdue`} tooltipContent={`Request For Change (${task.name}) Due Date`}>
                  <button
                      onClick={() => openTaskOverdueModal(task.id, task.ended_at, task.name, startedAt, endedAt)}
                      className='ti-btn ti-btn-danger ti-btn-sm'
                  >
                      <i className="ri-calendar-2-line align-middle"></i>
                  </button>
              </Tooltip>
          )}

            {task.users && task.users.length > 1 && !projectUser?.can_view_only &&  task.status !== 'completed' && (
                <HasProjectPermission globalPermission='pms.change_task' users={projectUsers}>
                    <Tooltip id={`set-active-user-tooltip-${task.id}`} tooltipContent={`Set Active User for (${task.name})`}>
                        <button
                            onClick={openModal}
                            className='ti-btn ti-btn-warning ti-btn-sm'
                        >
                            <i className="ri-user-star-line align-middle"></i>
                        </button>
                    </Tooltip>
                </HasProjectPermission>
            )}

            <HasProjectPermission globalPermission='pms.add_task' users={projectUsers} needIcon={true}>
            {milestoneStatus === 'active' && task.status !== 'under_approval' && (
                <Tooltip id={`add-tooltip-${task.id}-add`} tooltipContent={`Add Sub Task To (${task.name})`}>
                    <button
                        onClick={() => openTaskModal(task.milestone_id, task.started_at, task.ended_at, task.requires_approval, task.id)}
                        className='ti-btn ti-btn-success ti-btn-sm'
                    >
                        <i className="ri-add-circle-line align-middle"></i>
                    </button>
                </Tooltip>
            )}
          </HasProjectPermission>
          <HasProjectPermission globalPermission='pms.change_task' users={projectUsers}>
            {task.status !== 'under_approval' && (
                <Tooltip id={`edit-tooltip-${task.id}-edit`} tooltipContent={`Edit (${task.name})`}>
                    <button
                        onClick={() => openTaskModal(task.id, startedAt, endedAt, task.requires_approval, null, true)}
                        className='ti-btn ti-btn-primary ti-btn-sm'
                    >
                        <i className="ri-edit-line align-middle"></i>
                    </button>
                </Tooltip>
            )}
          </HasProjectPermission>
          <HasProjectPermission globalPermission='pms.delete_project' users={projectUsers}>
            {task.status !== 'under_approval' && (
                <Tooltip id={`delete-task-tooltip-${task.id}`} tooltipContent={`Delete Task (${task.name})`}>
                    <button
                        onClick={() => handleDeleteClick(`/pms/tasks/${task.id}/delete/`, task.name, refetch)}
                        className='ti-btn ti-btn-danger ti-btn-sm'
                    >
                        <i className="ri-delete-bin-2-line align-middle"></i>
                    </button>
                </Tooltip>
            )}
          </HasProjectPermission>
          <Tooltip id={`view-task-tooltip-${task.id}`} tooltipContent={`View Task (${task.name})`}>
            <Link to={PMS_ROUTES.TASK.DETAIL.path.replace(':id', task.id)} className='ti-btn ti-btn-info ti-btn-sm'>
              <i className="ri-eye-line"></i>
            </Link>
          </Tooltip>
        </span>
            </td>
        );
    };

    const renderNameCell = () => {
        return (
            <td>
        <span className="flex items-center dark:text-gray-200 dark:bg-bodybg">
          <span onClick={() => toggleSubTasks(task.id)}>
            {task.children && task.children.length > 0 && (
                <svg
                    className={`w-4 h-4 mr-2 cursor-pointer text-dark ${activeTaskId === task.id ? 'transform rotate-90' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
            )}
          </span>
          <Tooltip id={`task-tooltip-${task.id}`} tooltipContent={`${task.name}`}>
            <Link onClick={() => openTaskDetailModal(task.id)} to="#">
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
        );
    };

    return (
        <>
            <tr className="border-b border-defaultborder">
                {columnOrder
                    .filter(key => visibleColumns[key] && (key !== 'actions' || !viewOnly))
                    .map(key => React.cloneElement(renderCell(key), { key: `${task.id}-${key}` }))}
            </tr>
            {activeTaskId === task.id && task.children && task.children.length > 0 && (
                <tr>
                    <td colSpan={columnOrder.filter(key => visibleColumns[key] && (key !== 'actions' || !viewOnly)).length}>
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
                            viewOnly={viewOnly}
                        />
                    </td>
                </tr>
            )}

            <SetActiveUserModalPortal
                isOpen={isOpen}
                onClose={closeModal}
                task={task}
                currentActiveUserIds={getCurrentActiveUserIds}
                onUpdate={handleUpdate}
            />
        </>
    );
};

export default TaskTableRow;