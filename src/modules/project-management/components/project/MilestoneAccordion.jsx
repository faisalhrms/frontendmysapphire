import React, {useState} from "react";
import {getExcerptFromText, toTitleCase} from "@helpers/formatters.js";
import {getBadgeClasses, getStatusClasses} from "@helpers/badges.js";
import TaskTable from "@modules/project-management/components/project/TaskTable.jsx";
import {formatDate} from "@helpers/dateTime.js";
import Tooltip from '@components/Tooltip.jsx';
import Avatar from "@components/Avatar.jsx";
import TaskOverdueModal from "@modules/project-management/components/model/TaskOverdueModal.jsx";
import {useTaskOverdueModal} from "@modules/project-management/hooks/taskHooks.js";
import HasProjectPermission from "@modules/project-management/components/project/HasProjectPermission.jsx";

const MilestoneAccordion = ({ milestones, projectStatus, projectUsers, openMilestoneModal, openTaskModal, handleUploadModal, refetch }) => {

    const {
        taskName,
        openTaskOverdueModal,
        closeTaskOverdueModal,
        control,
        errors,
        isSubmitting,
        handleSubmit,
        onOverdueTaskSubmit,
        isOverdueTaskModalOpen
    } = useTaskOverdueModal(refetch)
    const [activeMilestoneId, setActiveMilestoneId] = useState(null);

    const toggleMilestone = (id) => {
        try {
            setActiveMilestoneId((prevId) => (prevId === id ? null : id));
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

    return (
        <>
            <div className="accordion customized-accordion accordions-items-separate" id="customizedAccordion">
            <div className="hs-accordion-group">
                {Array.isArray(milestones) && milestones.map((milestone) => (<div
                    className={`hs-accordion accordion-item ${milestone.priority === 'low' ? 'custom-accordion-primary' : (milestone.priority === 'medium' ? 'custom-accordion-secondary' : 'custom-accordion-danger')}`}
                    key={milestone.id}>
                    <button
                        className="accordion-button group py-0 inline-flex items-center justify-between gap-x-3 w-full font-semibold text-start transition"
                        aria-controls={`hs-basic-collapse${milestone.id}`}
                        type="button"
                        onClick={() => toggleMilestone(milestone.id)}>
                        <div className="grid grid-cols-12 gap-3 w-full">
                            <div className="xl:col-span-3 col-span-12 border-r border-defaultborder">
                                    <span className="flex items-center">
                                        {milestone.children.length > 0 && <span className="text-primary">
                                                <svg
                                                    className={`w-4 h-4 mr-2 cursor-pointer text-dark ${activeMilestoneId === milestone.id ? 'transform rotate-90' : ''}`}
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
                                            </span>}
                                        <div className="inline-block">
                                            <Tooltip
                                                id={`project-tooltip-${milestone.id}`}
                                                text={`(${milestone.id}) ${milestone.name}`}
                                                tooltipContent={`${milestone.name}`}
                                            >
                                                <span className="hs-tooltip-toggle">
                                                    <p className="font-semibold mb-[1.4px] text-[0.813rem]">{getExcerptFromText(milestone.name, 30)}</p>
                                                    <span
                                                        className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-3 px-4 bg-white border text-sm rounded-lg shadow-md dark:bg-neutral-900 dark:border-neutral-700"
                                                        role="tooltip">
                                                        {milestone.name}
                                                    </span>
                                                </span>
                                            </Tooltip>
                                             <p className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                                        {milestone.children.length} Tasks / {countSubtasks(milestone.children)} Sub Tasks
                                    </p>
                                        </div>
                                    </span>

                            </div>
                            <div className="xl:col-span-9 col-span-12">
                                <div className="grid grid-cols-1 md:grid-cols-6 gap-2 w-full">
                                    <div className="flex flex-col items-start">
                                        <p className="font-semibold mb-[1.4px] text-[0.813rem]">Status</p>
                                        <p className={getStatusClasses(milestone.status)}>{toTitleCase(milestone.status)}</p>
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <p className="font-semibold mb-[1.4px] text-[0.813rem]">Priority</p>
                                        <span
                                            className={getBadgeClasses(milestone.priority)}>{toTitleCase(milestone.priority)}</span>
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <p className="font-semibold mb-[1.4px] text-[0.813rem]">Started At</p>
                                        <p className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">{formatDate(milestone.started_at)}</p>
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <p className="font-semibold mb-[1.4px] text-[0.813rem]">Ended At</p>
                                        <p className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">{formatDate(milestone.ended_at)}</p>
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <p className="font-semibold mb-[1.4px] text-[0.813rem]">Created By</p>
                                        <div className="flex items-center flex-wrap">
                                            <div className="me-2 leading-none">
                                                <Avatar avatar={milestone?.created_by?.avatar} size='xs'/>
                                            </div>
                                            <span className="text-[#8c9097] dark:text-white/50 text-[0.75rem]">{toTitleCase(milestone?.created_by?.full_name)}</span>
                                        </div>
                                    </div>
                                    <HasProjectPermission globalPermission='change_project' users={projectUsers}>
                                        <div className="flex flex-col items-center">
                                            <p className="font-semibold mb-[1.4px] text-[0.813rem]">Actions</p>
                                            <div className="flex space-x-2">
                                                    <Tooltip
                                                        id={`edit-tooltip-${milestone.id}`}
                                                        tooltipContent={`Edit Milestone (${milestone.name})`}>
                                                        <span className="ti-btn ti-btn-primary !py-1 !px-2 !text-[0.75rem]"
                                                              onClick={() => openMilestoneModal(milestone.id, true)}>
                                                            <i className="ri-edit-line align-middle"></i>
                                                        </span>
                                                    </Tooltip>
                                                    <Tooltip
                                                        id={`upload-tasks-tooltip-${milestone.id}`}
                                                        tooltipContent={`Upload Tasks In Milestone (${milestone.name})`}>
                                                        <span className="ti-btn ti-btn-info !py-1 !px-2 !text-[0.75rem]"
                                                              onClick={() => handleUploadModal(milestone.id, 'T')}>
                                                            <i className="ri-file-upload-line align-middle"></i>
                                                        </span>
                                                    </Tooltip>
                                                    <Tooltip
                                                        id={`add-tooltip-${milestone.id}`}
                                                        tooltipContent={`Add New Task In (${milestone.name})`}>
                                                        <span
                                                            className="ti-btn ti-btn-success !py-1 !px-2 !text-[0.75rem] ms-1"
                                                            onClick={() => openTaskModal(milestone.id, milestone.started_at, milestone.ended_at, milestone.requires_approval)}>
                                                            <i className="ri-add-circle-line align-middle"></i>
                                                        </span>
                                                    </Tooltip>
                                            </div>
                                        </div>
                                    </HasProjectPermission>
                                </div>
                            </div>
                        </div>
                    </button>
                    {milestone.children.length > 0 && activeMilestoneId === milestone.id && (
                        <div
                            id={`hs-basic-collapse${milestone.id}`}
                            className="hs-accordion-content accordion-collapse w-full transition-[height] duration-300"
                            aria-labelledby={`hs-basic-heading${milestone.id}`}>
                        <div className="accordion-body">
                            <TaskTable
                                projectStatus={projectStatus}
                                projectUsers={projectUsers}
                                tasks={milestone.children}
                                milestoneStatus={milestone.status}
                                startedAt={milestone.started_at}
                                endedAt={milestone.ended_at}
                                openTaskModal={openTaskModal}
                                refetch={refetch}
                                openTaskOverdueModal={openTaskOverdueModal}
                            />
                        </div>
                    </div>
                    )}
                </div>))}
            </div>
        </div>
            {
                isOverdueTaskModalOpen &&
                    <TaskOverdueModal
                        taskName={taskName}
                        control={control}
                        errors={errors}
                        isSubmitting={isSubmitting}
                        handleSubmit={handleSubmit}
                        onSubmit={onOverdueTaskSubmit}
                        closeModal={closeTaskOverdueModal}
                    />
            }
        </>
    );
};

export default React.memo(MilestoneAccordion);
