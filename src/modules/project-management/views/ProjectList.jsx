import React, { useState } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import { Link } from "react-router-dom";
import {useProjectFilter, useProjects, useUploadProjectModal} from "@modules/project-management/hooks/projectHooks.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import Pagination from "@components/Pagination.jsx";
import { useMilestoneModal } from "@modules/project-management/hooks/milestoneHooks.js";
import MilestoneModel from "@modules/project-management/components/model/MilestoneModel.jsx";
import { useSearchHook } from "@hooks/useSearchHook.js";
import HasPermission from "@components/HasPermission.jsx";
import UploadModal from "@modules/project-management/components/model/UploadModal.jsx";
import sampleFile from "@assets/files/sample_upload_projects_with_milestones_tasks.xlsx";
import WorkspaceDropdown from "@components/dropdowns/WorkspaceDropdown.jsx";
import {useWatch} from "react-hook-form";
import ProjectStatusDropdown from "@modules/project-management/components/dropdowns/ProjectStatusDropdown.jsx";
import ProjectPriorityDropdown from "@modules/project-management/components/dropdowns/ProjectPriorityDropdown.jsx";
import {useDispatch, useSelector} from 'react-redux';
import {setViewType} from "@modules/project-management/redux/pmsSlice.js";
import ProjectGridItems from "@modules/project-management/components/ProjectGridItems.jsx";
import ProjectListItems from "@modules/project-management/components/ProjectListItems.jsx";

const ProjectList = () => {
    const { searchTerm, currentPage, setCurrentPage, handleSearchChange } = useSearchHook();
    const { filterControl,
        filterSubmit,
        filterErrors,
        isFiltering
    } = useProjectFilter()

    const workspaces = useWatch({ control: filterControl, name: "workspaces" });
    const status = useWatch({ control: filterControl, name: "status" });
    const priority = useWatch({ control: filterControl, name: "priority" });

    const { data, isLoading, refetch } = useProjects(currentPage, 8, searchTerm, workspaces, status, priority);

    const [startedAt, setStartedAt] = useState(null);
    const [endedAt, setEndedAt] = useState(null);
    const totalPages = Math.ceil(data?.total / 8) || 0;
    const {
        openMilestoneModal,
        closeMilestoneModal,
        controlMilestone,
        errorsMilestone,
        isSubmittingMilestone,
        handleSubmitMilestone,
        onSubmitMilestone,
    } = useMilestoneModal(refetch);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleOpenMilestoneModal = (project) => {
        setStartedAt(project.started_at);
        setEndedAt(project.ended_at);
        openMilestoneModal(project.id, false);
    };

    const {
        openUploadModal,
        closeUploadModal,
        control,
        errors,
        isSubmitting,
        handleSubmit,
        onSubmit,
        isUploadModalOpen,
    } = useUploadProjectModal(refetch, 'P')

    const viewType = useSelector((state) => state.pms.viewType);
    const dispatch = useDispatch();

    const handleViewChange = (viewType) => {
        dispatch(setViewType(viewType));
    };

    return (
        <>
            <PageHeader currentpage="Project Management System"/>
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12">
                    <div className="box custom-box">
                        <div className="box-body p-4">
                            <div className="flex items-center justify-between gap-4">
                                <HasPermission permission='add_project'>
                                    <div className="flex items-center gap-2">
                                        <Link to="/module/projects/create" className="ti-btn ti-btn-primary-full !mb-0">
                                            <i className="ri-add-line me-1 font-semibold align-middle"></i>
                                            New Project
                                        </Link>
                                    </div>
                                </HasPermission>
                                <div className="flex items-center gap-4 flex-1">
                                    <WorkspaceDropdown
                                        name='workspaces'
                                        control={filterControl}
                                        errors={filterErrors}
                                        multiple={true}
                                        saveNewOption={false}
                                    />
                                    <ProjectStatusDropdown
                                        control={filterControl}
                                        errors={filterErrors}
                                    />
                                    <ProjectPriorityDropdown
                                        control={filterControl}
                                        errors={filterErrors}
                                    />
                                </div>
                                <div className="flex items-center">
                                    <input
                                        className="form-control me-2"
                                        type="search"
                                        placeholder="Search Project"
                                        aria-label="Search"
                                        onChange={handleSearchChange}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        className={`ti-btn ti-btn-sm ${viewType === 'grid' ? 'ti-btn-outline-primary' : 'ti-btn-primary'}`}
                                        onClick={() => handleViewChange('grid')}
                                        title="Grid View"
                                    >
                                        <i className="ti ti-grid-dots"></i>
                                    </button>
                                    <button
                                        className={`ti-btn ti-btn-sm ${viewType === 'list' ? 'ti-btn-outline-primary' : 'ti-btn-primary'}`}
                                        onClick={() => handleViewChange('list')}
                                        title="List View"
                                    >
                                        <i className="ti ti-list"></i>
                                    </button>
                                </div>
                                <HasPermission permission='add_project'>
                                    <div className="hs-dropdown ti-dropdown ms-2">
                                        <button type="button" aria-label="button"
                                                className="ti-btn ti-btn-primary ti-btn-sm" aria-expanded="false">
                                            <i className="ti ti-dots-vertical"></i>
                                        </button>

                                        <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                                            <li>
                                                <a
                                                    onClick={openUploadModal}
                                                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block">
                                                    Upload Project
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href={sampleFile}
                                                    download="sample_upload_projects_with_milestones_tasks.xlsx"
                                                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium block">
                                                    Download Sample File
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </HasPermission>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-12 gap-x-6">
                {isLoading ? (
                    <div className="col-span-12">
                        <LoadingSpinner/>
                    </div>
                ) : data?.rows?.length > 0 ? (
                        viewType === 'grid' ?
                            (<ProjectGridItems rows={data.rows} handleOpenMilestoneModal={handleOpenMilestoneModal} refetch={refetch} />)
                                :
                            (<ProjectListItems rows={data.rows} handleOpenMilestoneModal={handleOpenMilestoneModal} refetch={refetch} />)
                ) : (
                    <div className="col-span-12 flex items-center justify-center h-64">
                        <p className="text-lg text-gray-500">There are no projects related to you.</p>
                    </div>
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                paginationDisabled={isLoading}
                onPageChange={handlePageChange}
            />

            <MilestoneModel
                control={controlMilestone}
                errors={errorsMilestone}
                isSubmitting={isSubmittingMilestone}
                handleSubmit={handleSubmitMilestone}
                onSubmit={onSubmitMilestone}
                closeModal={closeMilestoneModal}
                startedAt={startedAt}
                endedAt={endedAt}
            />

            {
                isUploadModalOpen &&
                <UploadModal
                    control={control}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    closeModal={closeUploadModal}
                    heading='Upload Projects'
                />
            }
        </>
    );
};

export default ProjectList;
