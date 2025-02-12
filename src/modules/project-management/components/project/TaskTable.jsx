import React, {useMemo, useState} from 'react';
import {toTitleCase} from "@helpers/formatters.js";
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
import SimpleBar from "simplebar-react";
import ProgressBar from "@components/ProgressBar.jsx";

const TaskTable = ({projectStatus, projectUsers, tasks, openTaskModal, milestoneStatus, startedAt = null, endedAt = null, isChild = false, refetch, openTaskOverdueModal }) => {
    const [activeTaskId, setActiveTaskId] = useState(null);

    const toggleSubTasks = (taskId) => {
        setActiveTaskId(prevId => (prevId === taskId ? null : taskId));
    };

    const userId = useSelector((state) => state.auth.user?.id);
    const projectUser = useMemo(() => projectUsers.find(user => user.id === userId), [projectUsers, userId]);

    return (
        <>
            <SimpleBar className='max-h-[500px]'>
                <div className={`table-responsive task-table`}>
                <table className="table whitespace-nowrap table-bordered min-w-full">
                    <thead>
                    <tr className="border-b border-defaultborder">
                        <th scope="col">Actions</th>
                        <th scope="col">{isChild ? "Sub Task Name" : "Task Name"}</th>
                        <th scope="col">Person</th>
                        <th scope="col">Teams</th>
                        <th scope="col">Deadline</th>
                        <th scope="col">Status</th>
                        <th scope="col">Completion Date</th>
                        <th scope="col">Status Completion Timeline</th>
                        <th scope="col">Progress</th>
                        <th scope="col">Priority</th>
                        <th scope="col">Started At</th>
                        <th scope="col">External Users</th>
                        <th scope="col">Created By</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.map((task) => (
                        <React.Fragment key={task.id}>
                            <tr className={`border-b border-defaultborder}`}>
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
                                                         onClick={() => openTaskOverdueModal(task.id, task.ended_at, task.name)}
                                                         className='ti-btn ti-btn-danger ti-btn-sm'>
                                                         <i className="ri-calendar-2-line align-middle"></i>
                                                     </button>
                                                 </Tooltip>
                                             )
                                         }
                                     })()}
                                        <HasProjectPermission globalPermission='add_task' users={projectUsers} needIcon={true}>
                                            {projectStatus === 'active' && milestoneStatus === 'active' && task.status !== 'under_approval' && (
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

                                    </span>
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
                                        <Link to={PMS_ROUTES.TASK.DETAIL.path.replace(':id', task.id)}>
                                            {task.name}
                                            {task.children && task.children.length > 0 && (
                                                <span className="badge bg-primary/10 text-primary ms-2">
                                                    {task.children.length}
                                                </span>
                                            )
                                            }
                                        </Link>
                                    </span>
                                </td>
                                <td className='text-center'><AvatarList users={task.users} max={4}/></td>
                                <td>
                                    {(
                                        task.teams?.map(team => (
                                            <span key={team.id}>{toTitleCase(team.name)}</span>
                                        ))
                                    )}
                                </td>
                                <td>
                                    <div className="flex items-center">
                                        {
                                            task.completion_timeline !== null ?
                                            <span className="me-6 text-success text-[1rem]">
                                                <Tooltip
                                                    id={`task-tooltip-${task.id}-info`}
                                                    tooltipContent={`${task.completion_timeline < 0 ? `Done ${Math.abs(task.completion_timeline)} days after deadline` : 'Done on time'} `}
                                                >
                                                    {
                                                        task.completion_timeline < 0
                                                            ?
                                                            <i className="ri-information-line cursor-pointer"></i>
                                                            :
                                                            <i className="ri-check-double-line cursor-pointer"></i>
                                                    }
                                                </Tooltip>
                                            </span>
                                           :
                                                (
                                                    task.is_overdue ?
                                                        <span className="me-6 text-danger text-[1rem]">
                                                            <Tooltip
                                                                id={`task-tooltip-${task.id}-overdue`}
                                                                tooltipContent={`Task is overdue by ${Math.abs(task.days_left)} days`}
                                                            >
                                                                <i className="ri-information-line cursor-pointer"></i>
                                                            </Tooltip>
                                                        </span>
                                                        :
                                                        <span className="me-6 text-secondary text-[1rem]">
                                                            <Tooltip
                                                                id={`task-tooltip-${task.id}-days_left`}
                                                                tooltipContent={`${Math.abs(task.days_left)} days left`}
                                                            >
                                                                <i className="ri-information-line cursor-pointer"></i>
                                                            </Tooltip>
                                                        </span>
                                                )
                                        }
                                        <span className={task.completed_at ? 'line-through' : (task.is_overdue ? 'line-through text-danger' : '')}>
                                            {formatDate(task.ended_at)}
                                        </span>
                                    </div>
                                </td>
                                <td className="min-w-[200px]">
                                    {(() => {
                                        if (projectUser?.can_view_only) {
                                            return <p className={getStatusClasses(task.status)}>{toTitleCase(task.status)}</p>;
                                        }
                                        return task.status !== 'under_approval' ? (
                                            <TaskStatusDropdown status={task.status} taskId={task.id} refetch={refetch}/>
                                        ) : (
                                            <p className={getStatusClasses(task.status)}>{toTitleCase(task.status)}</p>
                                        );
                                    })()}
                                </td>
                                <td>{formatDate(task.completed_at)}</td>
                                <td className='text-center'>{task.completion_timeline}</td>
                                <td className="min-w-[200px]">
                                    <div className='flex items-center'>
                                        <ProgressBar value={task.progress} barColor='!bg-success' withStatus={false} />
                                    </div>
                                </td>
                                <td><span className={getBadgeClasses(task.priority)}>{toTitleCase(task.priority)}</span>
                                </td>
                                <td>{formatDate(task.started_at)}</td>
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
                                        <TaskTable projectStatus={projectStatus} projectUsers={projectUsers} milestoneStatus={milestoneStatus} tasks={task.children} openTaskModal={openTaskModal} isChild={true} refetch={refetch} openTaskOverdueModal={openTaskOverdueModal}/>
                                    </td>
                                    </tr>
                                )}
                    </React.Fragment>))}
                    </tbody>
                </table>
            </div>
            </SimpleBar>
        </>
    );
};

export default React.memo(TaskTable)