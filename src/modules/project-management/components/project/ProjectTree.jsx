import React, { useState, useMemo } from 'react';
import '@assets/css/custom/project.css';
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import MilestoneAccordion from "@modules/project-management/components/project/MilestoneAccordion.jsx";
import MilestoneModel from "@modules/project-management/components/model/MilestoneModel.jsx";
import { useMilestoneModal } from "@modules/project-management/hooks/milestoneHooks.js";
import TaskModel from "@modules/project-management/components/model/TaskModel.jsx";
import { useTaskModal } from "@modules/project-management/hooks/taskHooks.js";
import HasPermission from "@components/HasPermission.jsx";
import sampleFile from "@assets/files/sample_upload_tasks_against_milestone.xlsx";
import {recursiveFilter} from "@modules/project-management/hooks/projectHooks.js";

const ProjectTree = ({ projectId, projectStatus, approval, startedAt, endedAt, milestones = [], isLoading, refetch, handleUploadModal }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const {
    openMilestoneModal,
    closeMilestoneModal,
    controlMilestone,
    errorsMilestone,
    isSubmittingMilestone,
    handleSubmitMilestone,
    onSubmitMilestone,
    isMilestoneEditMode,
  } = useMilestoneModal(refetch);

  const {
    taskData,
    openTaskModal,
    closeTaskModal,
    control,
    errors,
    isSubmitting,
    handleSubmit,
    onSubmit,
    isEditMode,
    isModalOpen,
    milestoneDates
  } = useTaskModal(refetch);

  const filteredMilestones = useMemo(() => {
    if (!searchTerm.trim()) return milestones;

    const filtered = recursiveFilter(milestones, searchTerm);
    console.log('Filtered Milestones with Full Expansion:', filtered);
    return filtered;
  }, [searchTerm, milestones]);

  return (
      <>
        <div className="box">
          <div className="box-header">
            <div className="box-title">Milestone Detail</div>
            <div className="flex items-center space-x-2">
              <input
                  type="text"
                  placeholder="Search here"
                  className="ti-form-control form-control-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="flex space-x-2">
                <HasPermission permission='add_project'>
                  <a
                      href={sampleFile}
                      download="sample_upload_tasks_against_milestone.xlsx"
                      className="ti-btn ti-btn-success !py-1 !px-2 !text-[0.75rem]"
                  >
                    <i className="ri-file-download-line me-1 align-middle"></i>
                    Download Sample File
                  </a>
                  {projectStatus === 'active' && (
                      <button
                          type="button"
                          onClick={() => openMilestoneModal(projectId, false, approval)}
                          className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                      >
                        <i className="ri-add-line font-semibold align-middle"></i> Add Milestone
                      </button>
                  )}
                </HasPermission>
                <button
                    type="button"
                    onClick={refetch}
                    disabled={isLoading || isSubmittingMilestone}
                    className="hs-dropdown-toggle ti-btn ti-btn-success-full !py-1 !px-2 !text-[0.75rem]"
                >
                  <i className="ri-refresh-line font-semibold align-middle"></i> Refresh
                </button>
              </div>
            </div>
          </div>

          <div className="box-body">
            {isLoading ? (
                <LoadingSpinner />
            ) : (
                <MilestoneAccordion
                    projectStatus={projectStatus}
                    milestones={filteredMilestones}
                    openTaskModal={openTaskModal}
                    openMilestoneModal={openMilestoneModal}
                    handleUploadModal={handleUploadModal}
                    refetch={refetch}
                />
            )}
          </div>
        </div>

        <MilestoneModel
            isEditMode={isMilestoneEditMode}
            control={controlMilestone}
            errors={errorsMilestone}
            isSubmitting={isSubmittingMilestone}
            handleSubmit={handleSubmitMilestone}
            onSubmit={onSubmitMilestone}
            closeModal={closeMilestoneModal}
            startedAt={startedAt}
            endedAt={endedAt}
        />

        {isModalOpen && (
            <TaskModel
                projectId={projectId}
                isEditMode={isEditMode}
                taskData={taskData}
                control={control}
                errors={errors}
                isSubmitting={isSubmitting}
                handleSubmit={handleSubmit}
                onSubmit={onSubmit}
                closeModal={closeTaskModal}
                startedAt={milestoneDates.startedAt}
                endedAt={milestoneDates.endedAt}
            />
        )}
      </>
  );
};

export default ProjectTree;
