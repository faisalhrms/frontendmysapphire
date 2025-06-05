import React, {useMemo, useState , useEffect} from 'react';
import '@assets/css/custom/project.css';
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import MilestoneAccordion from "@modules/project-management/components/project/MilestoneAccordion.jsx";
import MilestoneModel from "@modules/project-management/components/model/MilestoneModel.jsx";
import {useMilestoneModal} from "@modules/project-management/hooks/milestoneHooks.js";
import TaskModel from "@modules/project-management/components/model/TaskModel.jsx";
import { useTaskModal, useTaskOverdueModal} from "@modules/project-management/hooks/taskHooks.js";
import sampleFile from "@assets/files/sample_upload_tasks_against_milestone.xlsx";
import {useMilestoneSearch} from "@modules/project-management/hooks/projectHooks.js";
import HasProjectPermission from "@modules/project-management/components/project/HasProjectPermission.jsx";
import useFullScreen from "@hooks/useFullScreen.js";
import {Link} from "react-router-dom";
import TaskOverdueModal from "@modules/project-management/components/model/TaskOverdueModal.jsx";
import {useDispatch, useSelector} from "react-redux";
import {resetVisibleColumns, setVisibleColumns} from "@modules/project-management/redux/pmsSlice.js";

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

  const dispatch = useDispatch();
  const visibleColumns = useSelector((state) => state.pms.visibleColumns);

  const toggleColumnVisibility = (column) => {
    const newVisibility = {
      ...visibleColumns,
      [column]: !visibleColumns[column]
    };
    dispatch(setVisibleColumns(newVisibility));
  };

  const toggleAllColumns = (isVisible) => {
    const newVisibility = {};
    Object.keys(visibleColumns).forEach(col => {
      newVisibility[col] = isVisible;
    });
    dispatch(setVisibleColumns(newVisibility));
  };
  return (
      <>
        <div className={`box ${isFullscreen ? 'box-fullscreen' : ''}`} style={{maxHeight:isFullscreen?'100vh':'50vh', overflowY:'auto'}}>
          <div className="box-header bg-white dark:bg-bodybg" style={{ position: 'sticky', top: '0', left: '0', width: '100%', zIndex: 10 }}>
            <div className="box-title">Milestone Detail</div>
            <div className="flex items-center space-x-2">
              {/* Search Input */}
              <input
                  type="text"
                  placeholder="Search here"
                  className="ti-form-control form-control-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Column Visibility Dropdown */}
              <div className="hs-dropdown relative inline-flex">
                <button
                    id="column-visibility-dropdown"
                    type="button"
                    className="hs-dropdown-toggle ti-btn ti-btn-light !py-1 !px-2 !text-[0.75rem]"
                >
                  <i className="ri-table-line"></i> Columns
                </button>
                <div
                    className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-[200px] bg-white shadow-md rounded-lg p-2 mt-2 dark:bg-bodybg dark:border dark:border-defaultborder"
                    aria-labelledby="column-visibility-dropdown"
                >
                  <div className="flex justify-between items-center px-2 py-1">
                    <label className="flex items-center cursor-pointer font-normal">
                      <input
                          type="checkbox"
                          className="form-checkbox"
                          checked={Object.values(visibleColumns).every(v => v)}
                          onChange={(e) => toggleAllColumns(e.target.checked)}
                      />
                      <span className="ml-2">All Columns</span>
                    </label>
                    <button
                        onClick={() => dispatch(resetVisibleColumns())}
                        className="text-xs text-primary hover:underline"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="h-[1px] w-full bg-gray-200 my-1"></div>
                  {Object.entries(visibleColumns).map(([column, isVisible]) => (
                      <div key={column} className="px-2 py-1">
                        <label className="flex items-center cursor-pointer">
                          <input
                              type="checkbox"
                              className="form-check-input h-4 w-4 text-green-600"
                              checked={isVisible}
                              onChange={() => toggleColumnVisibility(column)}
                          />
                          <span className="ml-2 capitalize">
                            {column.replace(/_/g, ' ')}
                        </span>
                        </label>
                      </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <HasProjectPermission globalPermission='pms.change_project' users={projectUsers}>
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
                      className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
                  >
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
                <Link aria-label="anchor" to="#"
                      className="flex items-center justify-center w-[1.75rem] h-[1.75rem] !text-[0.8rem] !py-1 !px-2 rounded-sm bg-light border-light shadow-none !font-medium terms-fullscreen"
                      onClick={handleFullscreenClick}>
                  <i className="ri-fullscreen-line"></i>
                </Link>
              </div>
            </div>
          </div>

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
                    visibleColumns={visibleColumns}
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

        <div id="modal-root"></div>
      </>
  );
};

export default ProjectTree;
