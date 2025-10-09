import React, {useState} from "react";
import {getExcerptFromText, toTitleCase} from "@helpers/formatters.js";
import {getBadgeClasses, getStatusClasses} from "@helpers/badges.js";
import TaskTable from "@modules/project-management/components/project/TaskTable.jsx";
import {formatDate} from "@helpers/dateTime.js";
import Tooltip from '@components/Tooltip.jsx';
import Avatar from "@components/Avatar.jsx";
import HasProjectPermission from "@modules/project-management/components/project/HasProjectPermission.jsx";
import {useDelete} from "@hooks/useDelete.js";
import {useSelector} from "react-redux";

const MilestoneAccordion = ({ milestones, projectStatus, projectUsers, openMilestoneModal, openTaskModal, handleUploadModal, refetch, openTaskOverdueModal, openTaskDetailModal, visibleColumns = useSelector((state) => state.pms.visibleColumns), viewOnly = false }) => {

    const [openMilestones, setOpenMilestones] = useState({});

    const toggleMilestone = (id) => {
        try {
            setOpenMilestones(prev => ({
                ...prev,
                [id]: !prev[id]
            }));
        } catch (error) {
            console.error("Error toggling milestone:", error);
        }
    };

    const countSubtasks = (tasks) => {
        let count = 0;
        tasks.forEach((task) => {
            count += task.children ? task.children.length : 0;
            if (task.children) {
                count += countSubtasks(task.children);
            }
        });
        return count;
    };

    const calculateProgress = (tasks) => {
        if (!tasks || tasks.length === 0) return 0;
        const completed = tasks.filter(task => task.status === 'completed' || task.status === 'done').length;
        return Math.round((completed / tasks.length) * 100);
    };

    const { handleDeleteClick } = useDelete();

    const getPriorityBorder = (priority) => {
        const borders = {
            high: 'border-l-4 border-l-danger',
            medium: 'border-l-4 border-l-info',
            low: 'border-l-4 border-l-success'
        };
        return borders[priority] || 'border-r-4 border-r-gray-300';
    };

    const getStatusRibbon = (status) => {
        const ribbons = {
            not_started: {
                bg: 'bg-gray-500',
                text: 'Not Started',
                icon: 'ri-time-line'
            },
            active: {
                bg: 'bg-info',
                text: 'Active',
                icon: 'ri-play-circle-fill'
            },
            on_hold: {
                bg: 'bg-warning',
                text: 'On Hold',
                icon: 'ri-pause-circle-fill'
            },
            completed: {
                bg: 'bg-success',
                text: 'Completed',
                icon: 'ri-checkbox-circle-fill'
            },
            archived: {
                bg: 'bg-gray-700',
                text: 'Archived',
                icon: 'ri-archive-fill'
            }
        };
        return ribbons[status] || ribbons.not_started;
    };


    return (
        <div className="space-y-3">
            {Array.isArray(milestones) && milestones.map((milestone) => {
                const progress = calculateProgress(milestone.children);
                const totalTasks = milestone.children.length;
                const completedTasks = milestone.children.filter(t => t.status === 'completed' || t.status === 'done').length;
                const statusRibbon = getStatusRibbon(milestone.status);

                return (
                    <div
                        key={milestone.id}
                        className={`relative rounded-lg border border-gray-200 ${getPriorityBorder(milestone.priority)} shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden`}>

                        {/* Status Ribbon - Top Left Corner */}
                        <div className="absolute top-0 right-0 z-0">
                            <div className={`${statusRibbon.bg} text-white px-3 py-1 rounded-bl-lg shadow-sm flex items-center gap-1.5 animate-pulse`}>
                                <i className={`${statusRibbon.icon} text-xs`}></i>
                                <span className="text-xs font-medium">{statusRibbon.text}</span>
                            </div>
                        </div>

                        {/* Milestone Header */}
                        <div className="pt-10 px-4 pb-4">
                            <div className="flex items-start gap-3">

                                {/* Left Section: Toggle */}
                                <div className="flex items-start pt-1">
                                    {milestone.children.length > 0 ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleMilestone(milestone.id);
                                            }}
                                            className="flex-shrink-0 w-6 h-6 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-800 rounded transition-colors">
                                            <i className={`ri-arrow-${openMilestones[milestone.id] ? 'down' : 'right'}-s-line text-lg text-gray-600 dark:text-gray-400`}></i>
                                        </button>
                                    ) : (
                                        <div className="w-6"></div>
                                    )}
                                </div>

                                {/* Main Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        {/* Title and Metadata */}
                                        <div className="flex-1 min-w-0">
                                            <div className="mb-2">
                                                <Tooltip id={`milestone-name-${milestone.id}`} tooltipContent={milestone.name}>
                                                    <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                                        {milestone.name}
                                                    </h3>
                                                </Tooltip>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                                                <span className="flex items-center gap-1.5">
                                                    <i className="ri-calendar-line"></i>
                                                    <span className="whitespace-nowrap">{formatDate(milestone.started_at)} - {formatDate(milestone.ended_at)}</span>
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <i className="ri-task-line"></i>
                                                    <span className="whitespace-nowrap">{completedTasks}/{totalTasks} tasks</span>
                                                </span>
                                                {!viewOnly && (
                                                    <span className="flex items-center gap-1.5">
                                                        <i className="ri-list-check"></i>
                                                        <span className="whitespace-nowrap">{countSubtasks(milestone.children)} subtasks</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        {!viewOnly && (
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <HasProjectPermission globalPermission='pms.add_task' users={projectUsers}>
                                                    <Tooltip id={`add-task-${milestone.id}`} tooltipContent="Add task">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openTaskModal(milestone.id, milestone.started_at, milestone.ended_at, milestone.requires_approval);
                                                            }}
                                                            className="w-8 h-8 flex items-center justify-center hover:bg-success/10 rounded text-success transition-colors">
                                                            <i className="ri-add-line text-lg"></i>
                                                        </button>
                                                    </Tooltip>
                                                </HasProjectPermission>

                                                <HasProjectPermission globalPermission='pms.change_project' users={projectUsers}>
                                                    {handleUploadModal && (
                                                        <Tooltip id={`upload-${milestone.id}`} tooltipContent="Upload tasks">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleUploadModal(milestone.id, 'T');
                                                                }}
                                                                className="w-8 h-8 flex items-center justify-center hover:bg-info/10 rounded text-info transition-colors">
                                                                <i className="ri-upload-2-line text-lg"></i>
                                                            </button>
                                                        </Tooltip>
                                                    )}

                                                    <Tooltip id={`edit-${milestone.id}`} tooltipContent="Edit milestone">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openMilestoneModal(milestone.id, true);
                                                            }}
                                                            className="w-8 h-8 flex items-center justify-center hover:bg-warning/10 rounded text-warning transition-colors">
                                                            <i className="ri-edit-line text-lg"></i>
                                                        </button>
                                                    </Tooltip>
                                                </HasProjectPermission>

                                                <HasProjectPermission globalPermission='pms.delete_project' users={projectUsers}>
                                                    <Tooltip id={`delete-${milestone.id}`} tooltipContent="Delete milestone">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteClick(`/pms/milestones/${milestone.id}/delete/`, milestone.name, refetch);
                                                            }}
                                                            className="w-8 h-8 flex items-center justify-center hover:bg-danger/10 rounded text-danger transition-colors">
                                                            <i className="ri-delete-bin-line text-lg"></i>
                                                        </button>
                                                    </Tooltip>
                                                </HasProjectPermission>
                                            </div>
                                        )}
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Progress</span>
                                                <span className="text-xs font-semibold text-gray-900 dark:text-white">{progress}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full bg-success transition-all duration-500 rounded-full`}
                                                    style={{ width: `${progress}%` }}>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Avatar */}
                                        <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-neutral-700">
                                            <Avatar
                                                avatar={milestone?.created_by?.avatar}
                                                full_name={milestone?.created_by?.full_name || 'N/A'}
                                            />
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs text-gray-500 dark:text-gray-500">Created by</span>
                                                <Tooltip id={`creator-${milestone.id}`} tooltipContent={milestone?.created_by?.full_name || 'N/A'}>
                                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                                                        {getExcerptFromText(milestone?.created_by?.full_name || 'N/A', 12)}
                                                    </span>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {milestone.children.length > 0 && openMilestones[milestone.id] && (
                            <div className="border-t border-gray-200 dark:border-neutral-700">
                                <div className="p-4 bg-gray-50/50 dark:bg-neutral-950/30">
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
                );
            })}
        </div>
    );
};

export default React.memo(MilestoneAccordion);