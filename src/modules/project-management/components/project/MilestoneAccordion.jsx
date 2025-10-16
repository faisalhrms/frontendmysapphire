import React, {useState} from "react";
import TaskTable from "@modules/project-management/components/project/TaskTable.jsx";
import {formatDate} from "@helpers/dateTime.js";
import Tooltip from '@components/Tooltip.jsx';
import Avatar from "@components/Avatar.jsx";
import HasProjectPermission from "@modules/project-management/components/project/HasProjectPermission.jsx";
import {useDelete} from "@hooks/useDelete.js";
import {useSelector} from "react-redux";

const MilestoneAccordion = ({ milestones, projectStatus, projectUsers, openMilestoneModal, openTaskModal, handleUploadModal, refetch, openTaskOverdueModal, openTaskDetailModal, visibleColumns = useSelector((state) => state.pms.visibleColumns), viewOnly = false }) => {

    const [openMilestones, setOpenMilestones] = useState({});
    const toggleMilestone = (milestone) => {
        setOpenMilestones(prev => ({
            ...prev,
            [milestone.id]: !prev[milestone.id]
        }));
    };

    const { handleDeleteClick } = useDelete();

    const getStatusConfig = (status) => {
        const configs = {
            not_started: { ring: 'ring-gray-400', dot: 'bg-gray', text: 'text-gray', icon: 'ri-time-line' },
            active: { ring: 'ring-sky-500 animate-pulse', dot: 'bg-info', text: 'text-info', icon: 'ri-play-circle-fill' },
            on_hold: { ring: 'ring-amber-400', dot: 'bg-warning', text: 'text-warning', icon: 'ri-pause-circle-fill' },
            completed: { ring: 'ring-green', dot: 'bg-success', text: 'text-success', icon: 'ri-checkbox-circle-fill' },
            archived: { ring: 'ring-red', dot: 'bg-danger', text: 'text-danger', icon: 'ri-archive-fill' }
        };
        return configs[status] || configs.not_started;
    };

    return (
        <div className="relative">
            {Array.isArray(milestones) && milestones.map((milestone, index) => {
                const statusConfig = getStatusConfig(milestone.status);
                const isLast = index === milestones.length - 1;
                const isFirst = index === 0;

                return (
                    <div key={milestone.id} className="relative pb-6" style={{ paddingLeft: '60px' }}>

                        {/* Left: Tree Structure Column - Absolutely Positioned */}
                        <div className="absolute left-0 top-0 bottom-0  flex flex-col items-center z-0"  style={{ width: '60px' }}>

                            {/* Top Vertical Line (from previous milestone) */}
                            {!isFirst && (
                                <div
                                    className="absolute left-1/2 w-0.5 bg-[#c4c4c4] dark:bg-neutral-600"
                                    style={{
                                        top: '-23px',
                                        height: '52px',
                                        transform: 'translateX(-1px)'
                                    }}
                                ></div>
                            )}

                            {/* Status Dot */}
                            <div
                                className={`absolute w-3 h-3 rounded-full ${statusConfig.dot} ${statusConfig.ring} ring-4 border-2 border-white z-10`}
                                style={{
                                    top: '24px',
                                    left: '50%',
                                    transform: 'translateX(-50%)'
                                }}
                            ></div>

                            {/* Horizontal Line to Card */}
                            <div
                                className="absolute h-0.5 bg-[#c4c4c4] dark:bg-neutral-600"
                                style={{
                                    top: '28px',
                                    left: '50%',
                                    width: '30px',
                                    transform: 'translateY(1px)'
                                }}
                            ></div>

                            {/* Bottom Vertical Line (to next milestone) */}
                            {!isLast && (
                                <div
                                    className="absolute left-1/2 w-0.5 bg-[#c4c4c4] dark:bg-neutral-600"
                                    style={{
                                        top: '28px',
                                        bottom: '0',
                                        transform: 'translateX(-1px)'
                                    }}
                                ></div>
                            )}
                        </div>

                        {/* Right: Milestone Card - Now in normal flow */}
                        <div className="">
                            <div
                                className={`
                                 rounded-tl-[7px]
                                 rounded-bl-[7px]
                                border 
                                border-[#d0d4e4]
                                border-l-[7px]
                                border-l-[#c4c4c4]
                                border-t-[#c4c4c4]
                                hover:shadow-lg 
                                transition-all 
                                duration-200 
                                overflow-hidden
                              `}
                            >
                                {/* Compact Header */}
                                <div className="px-4 py-3 bg-white dark:bg-neutral-900">
                                    <div className="flex items-center gap-3">

                                        {/* Toggle Button */}
                                        {milestone.total_tasks > 0 ? (
                                            <button
                                                onClick={() => toggleMilestone(milestone)}
                                                className="flex-shrink-0 w-6 h-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-800 rounded transition-colors">
                                                <i className={`ri-arrow-${openMilestones[milestone.id] ? 'down' : 'right'}-s-line text-base text-gray-600 dark:text-gray-400`}></i>
                                            </button>
                                        ) : (
                                            <div className="w-6"></div>
                                        )}

                                        {/* Main Content */}
                                        <div className="flex-1 min-w-0 flex items-center justify-between gap-4">

                                            {/* Left: Title & Meta */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Tooltip id={`milestone-name-${milestone.id}`}
                                                             tooltipContent={milestone.name}>
                                                        <p className="text-[13px] font-normal dark:text-white break-words line-clamp-1">
                                                            {milestone.name}
                                                        </p>
                                                    </Tooltip>
                                                    <span
                                                        className={`px-2 py-0.5 text-xs rounded-full ${statusConfig.text} bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 flex items-center gap-1`}>
                                                        <i className={`${statusConfig.icon} text-xs`}></i>
                                                        {milestone.status.replace('_', ' ')}
                                                    </span>
                                                </div>

                                                <div
                                                    className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <i className="ri-calendar-line"></i>
                                                        {formatDate(milestone.started_at)} → {formatDate(milestone.ended_at)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <i className="ri-task-line"></i>
                                                        {milestone.completed_tasks}/{milestone.total_tasks}
                                                    </span>
                                                    {!viewOnly && (
                                                        <span className="flex items-center gap-1">
                                                            <i className="ri-list-check"></i>
                                                            {milestone.total_subtasks} subtasks
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Center: Progress */}
                                            <div className="flex items-center gap-2" style={{minWidth: '120px'}}>
                                                <div
                                                    className="flex-1 h-1.5 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-primary transition-all duration-500"
                                                        style={{width: `${milestone.progress}%`}}>
                                                    </div>
                                                </div>
                                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300"
                                                      style={{minWidth: '32px', textAlign: 'right'}}>
                                                    {milestone.progress}%
                                                </span>
                                            </div>

                                            {/* Right: Avatar & Actions */}
                                            <div className="flex items-center gap-3">
                                                {/*<Tooltip id={`creator-${milestone.id}`}*/}
                                                {/*         tooltipContent={milestone?.created_by?.full_name || 'N/A'}>*/}
                                                    <Avatar
                                                        avatar={milestone?.created_by?.avatar}
                                                        full_name={milestone?.created_by?.full_name || 'N/A'}
                                                    />
                                                {/*</Tooltip>*/}

                                                {!viewOnly && (
                                                    <div className="flex items-center gap-0.5">
                                                        <HasProjectPermission globalPermission='pms.add_task'
                                                                              users={projectUsers}>
                                                            <Tooltip id={`add-task-${milestone.id}`}
                                                                     tooltipContent="Add task">
                                                                <button
                                                                    onClick={() => openTaskModal(milestone.id, milestone.started_at, milestone.ended_at, milestone.requires_approval)}
                                                                    className="w-7 h-7 flex items-center justify-center hover:bg-success/10 rounded text-success transition-colors">
                                                                    <i className="ri-add-line text-base"></i>
                                                                </button>
                                                            </Tooltip>
                                                        </HasProjectPermission>

                                                        <HasProjectPermission globalPermission='pms.change_project'
                                                                              users={projectUsers}>
                                                            {handleUploadModal && (
                                                                <Tooltip id={`upload-${milestone.id}`}
                                                                         tooltipContent="Upload">
                                                                    <button
                                                                        onClick={() => handleUploadModal(milestone.id, 'T')}
                                                                        className="w-7 h-7 flex items-center justify-center hover:bg-info/10 rounded text-info dark:text-info-400 transition-colors">
                                                                        <i className="ri-upload-2-line text-base"></i>
                                                                    </button>
                                                                </Tooltip>
                                                            )}

                                                            <Tooltip id={`edit-${milestone.id}`} tooltipContent="Edit">
                                                                <button
                                                                    onClick={() => openMilestoneModal(milestone.id, true)}
                                                                    className="w-7 h-7 flex items-center justify-center hover:bg-amber-100 dark:hover:bg-amber-900 rounded text-amber-600 dark:text-amber-400 transition-colors">
                                                                    <i className="ri-edit-line text-base"></i>
                                                                </button>
                                                            </Tooltip>
                                                        </HasProjectPermission>

                                                        <HasProjectPermission globalPermission='pms.delete_project' users={projectUsers}>
                                                            <Tooltip id={`delete-${milestone.id}`} tooltipContent="Delete">
                                                                <button
                                                                    onClick={() => handleDeleteClick(`/pms/milestones/${milestone.id}/delete/`, milestone.name, refetch)}
                                                                    className="w-7 h-7 flex items-center justify-center hover:bg-danger/10 rounded text-danger dark:text-danger-400 transition-colors">
                                                                    <i className="ri-delete-bin-line text-base"></i>
                                                                </button>
                                                            </Tooltip>
                                                        </HasProjectPermission>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Tasks */}
                                {milestone.total_tasks > 0 && openMilestones[milestone.id] && (
                                    <div
                                        className="border-t border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-950">
                                        <div className="p-4 overflow-x-auto">
                                            <TaskTable
                                                projectStatus={projectStatus}
                                                projectUsers={projectUsers}
                                                tasks={milestone.children}
                                                milestoneStatus={milestone.status}
                                                milestoneLaunch={milestone.ended_at}
                                                startedAt={milestone.started_at}
                                                endedAt={milestone.ended_at}
                                                projectId={milestone.project_id}
                                                milestoneId={milestone.id}
                                                openTaskModal={openTaskModal}
                                                refetch={refetch}
                                                openTaskOverdueModal={openTaskOverdueModal}
                                                viewOnly={viewOnly}
                                                openTaskDetailModal={openTaskDetailModal}
                                                visibleColumns={visibleColumns}
                                            />
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                    </div>
                );
            })}
        </div>
    );
};

export default React.memo(MilestoneAccordion);