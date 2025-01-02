import React, { useState } from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import { Link } from "react-router-dom";
import ProjectCard from "@modules/project-management/components/ProjectCard.jsx";
import {useProjects, useUploadProjectModal} from "@modules/project-management/hooks/projectHooks.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import Pagination from "@components/Pagination.jsx";
import { useMilestoneModal } from "@modules/project-management/hooks/milestoneHooks.js";
import MilestoneModel from "@modules/project-management/components/model/MilestoneModel.jsx";
import { useSearchHook } from "@hooks/useSearchHook.js";
import HasPermission from "@components/HasPermission.jsx";
import UploadModal from "@modules/project-management/components/model/UploadModal.jsx";
import sampleFile from "@assets/files/sample_upload_projects_with_milestones_tasks.xlsx";

const ProjectList = () => {
    const { searchTerm, currentPage, setCurrentPage, handleSearchChange } = useSearchHook();
    const { data, isLoading, refetch } = useProjects(currentPage, 8, searchTerm);
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

    return (
        <>
            <PageHeader currentpage="Project Management System" />
            <div className="grid grid-cols-12 gap-6">
                <div className="xl:col-span-12 col-span-12">
                    <div className="box custom-box">
                        <div className="box-body p-4">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <HasPermission permission='add_project'>
                                    <div className="flex flex-wrap gap-1 newproject">
                                        <Link to="/module/projects/create"
                                              className="ti-btn ti-btn-primary-full me-2 !mb-0">
                                            <i className="ri-add-line me-1 font-semibold align-middle"></i>
                                            New Project
                                        </Link>
                                        <button
                                            onClick={openUploadModal}
                                            type='button'
                                            className="ti-btn ti-btn-info me-2 !mb-0">
                                            <i className="ri-file-upload-line me-1 font-semibold align-middle"></i>
                                            Upload Projects
                                        </button>
                                        <a
                                            href={sampleFile}
                                            download="sample_upload_projects_with_milestones_tasks.xlsx"
                                            className="ti-btn ti-btn-success me-2 !mb-0">
                                            <i className="ri-file-download-line me-1 font-semibold align-middle"></i>
                                            Download Sample File
                                        </a>
                                    </div>
                                </HasPermission>
                                <div className="flex" role="search">
                                    <input
                                        className="form-control me-2"
                                        type="search"
                                        placeholder="Search Project"
                                        aria-label="Search"
                                        onChange={handleSearchChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-x-6">
                {isLoading ? (
                    <div className="col-span-12">
                        <LoadingSpinner />
                    </div>
                ) : data?.rows?.length > 0 ? (
                    data.rows.map(project => (
                        <div className="xxl:col-span-3 xl:col-span-4 md:col-span-6 col-span-12" key={project.id}>
                            <ProjectCard
                                openModal={() => handleOpenMilestoneModal(project)}
                                project={project}
                                refetch={refetch}
                            />
                        </div>
                    ))
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
