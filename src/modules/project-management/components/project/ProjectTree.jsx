import React, {useMemo, useState} from 'react';
import '@assets/css/custom/project.css';
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import MilestoneAccordion from "@modules/project-management/components/project/MilestoneAccordion.jsx";
import MilestoneModel from "@modules/project-management/components/model/MilestoneModel.jsx";
import {useMilestoneModal} from "@modules/project-management/hooks/milestoneHooks.js";
import TaskModel from "@modules/project-management/components/model/TaskModel.jsx";
import {useTaskModal, useTaskOverdueModal} from "@modules/project-management/hooks/taskHooks.js";
import sampleFile from "@assets/files/sample_upload_tasks_against_milestone.xlsx";
import {useMilestoneSearch} from "@modules/project-management/hooks/projectHooks.js";
import HasProjectPermission from "@modules/project-management/components/project/HasProjectPermission.jsx";
import SimpleBar from "simplebar-react";
import useFullScreen from "@hooks/useFullScreen.js";
import {Link} from "react-router-dom";
import TaskOverdueModal from "@modules/project-management/components/model/TaskOverdueModal.jsx";

const ProjectTree = ({ projectId, projectStatus, approval, startedAt, endedAt, projectUsers, milestones = [], isLoading, refetch, handleUploadModal }) => {
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

    if (milestones && milestones.length > 0) {
      return useMilestoneSearch(milestones, searchTerm);
    } else {
      return [];
    }
  }, [searchTerm, milestones]);

  const { isFullscreen, handleFullscreenClick } = useFullScreen();
  const containerHeight = isFullscreen ? "calc(100vh - 100px)" : '500px';

  const {
    taskName,
    openTaskOverdueModal,
    closeTaskOverdueModal,
    control:overDueControl,
    errors: overDueErrors,
    isSubmitting: overDueSubmitting,
    handleSubmit: overDueSubmit,
    onOverdueTaskSubmit,
    isOverdueTaskModalOpen,
    dates
  } = useTaskOverdueModal(refetch)

  return (
      <>
        <div className={`box ${isFullscreen ? 'box-fullscreen' : ''}`}>
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
                <HasProjectPermission globalPermission='change_project' users={projectUsers}>
                  <a
                      href={sampleFile}
                      download="sample_upload_tasks_against_milestone.xlsx"
                      className="ti-btn ti-btn-success !py-1 !px-2 !text-[0.75rem]"
                  >
                    <i className="ri-file-download-line me-1 align-middle"></i>
                    Download Sample File
                  </a>
                  <button
                      type="button"
                      onClick={() => openMilestoneModal(projectId, false, approval)}
                      className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]">
                    <i className="ri-add-line font-semibold align-middle"></i> Add Milestone
                  </button>
                </HasProjectPermission>
                <button
                    type="button"
                    onClick={refetch}
                    disabled={isLoading || isSubmittingMilestone}
                    className="hs-dropdown-toggle ti-btn ti-btn-success-full !py-1 !px-2 !text-[0.75rem]"
                >
                  <i className="ri-refresh-line font-semibold align-middle"></i> Refresh
                </button>
                <Link aria-label="anchor" to="#" className="flex items-center justify-center w-[1.75rem] h-[1.75rem] !text-[0.8rem] !py-1 !px-2 rounded-sm bg-light border-light shadow-none !font-medium terms-fullscreen" onClick={handleFullscreenClick}>
                  <i className="ri-fullscreen-line"></i>
                </Link>
              </div>
            </div>
          </div>
          <SimpleBar style={{ maxHeight: containerHeight }}>
            <div className="box-body">
              {isLoading ? (
                  <LoadingSpinner/>
              ) : (
                  <MilestoneAccordion
                      projectStatus={projectStatus}
                      projectUsers={projectUsers}
                      milestones={filteredMilestones}
                      openTaskModal={openTaskModal}
                      openMilestoneModal={openMilestoneModal}
                      handleUploadModal={handleUploadModal}
                      refetch={refetch}
                      openTaskOverdueModal={openTaskOverdueModal}
                  />
              )}
            </div>
          </SimpleBar>
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

        {
            isOverdueTaskModalOpen &&
            <TaskOverdueModal
                taskName={taskName}
                control={overDueControl}
                errors={overDueErrors}
                isSubmitting={overDueSubmitting}
                handleSubmit={overDueSubmit}
                onSubmit={onOverdueTaskSubmit}
                closeModal={closeTaskOverdueModal}
                startedAt={dates.startedAt}
                endedAt={dates.endedAt}
            />
        }
      </>
  );
};

export default ProjectTree;
