import React, {useState} from 'react';
import {getExcerptFromText, toTitleCase} from "@helpers/formatters.js";
import {getBadgeClasses, getStatusClasses} from "@helpers/badges.js";
import {formatDate} from "@helpers/dateTime.js";
import AvatarList from "@components/AvatarList.jsx";
import {Link} from "react-router-dom";
import Tooltip from '@components/Tooltip.jsx';
import {PMS_ROUTES} from "@modules/project-management/routes.js";
import HasPermission from "@components/HasPermission.jsx";

const TaskTable = ({projectStatus, tasks, openTaskModal,milestoneStatus, startedAt = null, endedAt = null, isChild = false}) => {
    const [activeTaskId, setActiveTaskId] = useState(null);
    const toggleSubTasks = (taskId) => {
        setActiveTaskId(prevId => (prevId === taskId ? null : taskId));
    };
    return (<>
            <div className={`table-responsive`}>
                <table className="table whitespace-nowrap table-bordered min-w-full">

                    <thead className="table-active">
                    <tr className="border-b border-defaultborder">
                        <th scope="col" className="text-center">{isChild ? "Sub Task No" : "Task No"}</th>
                        <th scope="col" className="text-center">{isChild ? "Sub Task Name" : "Task Name"}</th>
                        <th scope="col" className="text-center">Status</th>
                        <th scope="col" className="text-center">Priority</th>
                        <th scope="col" className="text-center">Started At</th>
                        <th scope="col" className="text-center">Ended At</th>
                        <th scope="col" className="text-center">Assigned To</th>
                        <th scope="col" className="text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tasks.map((task) => (<React.Fragment key={task.id}>
                        <tr className="border-b border-defaultborder text-[#8c9097] dark:text-white/50">
                            <td>
                                    <span className="flex items-center">
                                        <span className="text-primary" onClick={() => toggleSubTasks(task.id)}>
                                            {task.children && task.children.length > 0 && (<svg
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
                                            </svg>)}
                                        </span>
                                        <Link to={PMS_ROUTES.TASK.DETAIL.path.replace(':id', task.id)}>
                                            {task.task_no}
                                        </Link>
                                    </span>
                            </td>
                            <td>
                                    <span className="flex items-center">
                                        <Tooltip
                                            id={`task-tooltip-${task.id}`}
                                            tooltipContent={`${task.name}`}
                                        >
                                            <p className="font-semibold mb-[1.4px] text-[0.813rem] ms-2">
                                                {getExcerptFromText(task.name, 30)}
                                            </p>
                                        </Tooltip>


                                        {task.children && (<span className="badge bg-primary text-white ms-2">
                                                {task.children.length}
                                            </span>)}
                                    </span>
                            </td>


                            <td><span className={getStatusClasses(task.status)}>{toTitleCase(task.status)}</span></td>
                            <td><span className={getBadgeClasses(task.priority)}>{toTitleCase(task.priority)}</span>
                            </td>
                            <td>{formatDate(task.started_at)}</td>
                            <td>{formatDate(task.ended_at)}</td>
                            <td><AvatarList users={task.users} max={4}/></td>
                            <td>

                                    <span className='flex space-x-2'>
                                          <HasPermission permission='add_task'>
                                            {task.status === 'active' || task.status === 'in_progress' && projectStatus === 'active' && milestoneStatus === 'active' &&(
                                                <Tooltip
                                                    id={`add-tooltip-${task.id}-add`}
                                                    tooltipContent={`Add Sub Task To (${task.name})`}
                                                >

                                                    <button
                                                        onClick={() => openTaskModal(task.milestone_id, task.started_at, task.ended_at, task.id)}
                                                        className='ti-btn ti-btn-success ti-btn-sm'>
                                                        <i className="ri-add-circle-line align-middle"></i>
                                                    </button>
                                                </Tooltip>)}

                                                </HasPermission>

                                        <HasPermission permission='change_task'>
                                        { task.status === "under_approval" ? ('') : (
                                            <Tooltip
                                                id={`edit-tooltip-${task.id}-edit`}
                                                tooltipContent={`Edit (${task.name})`}
                                            >
                                                <button
                                                    onClick={() => openTaskModal(task.id, startedAt, endedAt, null, true)}
                                                    className='ti-btn ti-btn-primary ti-btn-sm'>
                                                    <i className="ri-edit-line align-middle"></i>
                                                </button>
                                            </Tooltip>)}
                                        </HasPermission>

                                    </span>
                            </td>

                        </tr>
                        {activeTaskId === task.id && task.children && task.children.length > 0 && (<tr>
                            <td colSpan="8">
                                <TaskTable tasks={task.children} openTaskModal={openTaskModal} isChild={true}/>
                            </td>
                        </tr>)}
                    </React.Fragment>))}
                    </tbody>
                </table>
            </div>
        </>);
};

export default TaskTable