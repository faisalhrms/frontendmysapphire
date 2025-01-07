import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import ProjectSummary from "@modules/project-management/components/project/ProjectSummary.jsx";
import ProjectAdditionalDetail from "@modules/project-management/components/project/ProjectAdditionalDetail.jsx";
import ProjectAttachment from "@modules/project-management/components/project/ProjectAttachment.jsx";
import ProjectTree from "@modules/project-management/components/project/ProjectTree.jsx";
import {
  useProject,
  useProjectMilestonesWithTasks,
  useUploadProjectModal,
} from "@modules/project-management/hooks/projectHooks.js";
import ProjectTeam from "@modules/project-management/components/project/ProjectTeam.jsx";
import Discussion from "@components/Discussion.jsx";
import UploadModal from "@modules/project-management/components/model/UploadModal.jsx";
import ProjectStats from "../components/project/ProjectStats.jsx";
import ProjectStatistics from "../components/project/ProjectStatistics.jsx";

const ProjectDetail = () => {
  const { id } = useParams();
  const { projectData } = useProject(id);
  const { milestones, isLoading, refetch } = useProjectMilestonesWithTasks(id);
  const [importType, setImportType] = useState("M");
  const {
    openUploadModal,
    closeUploadModal,
    control,
    errors,
    isSubmitting,
    handleSubmit,
    onSubmit,
    isUploadModalOpen,
  } = useUploadProjectModal(refetch, importType);

  const handleUploadModal = (id, importType) => {
    setImportType(importType);
    openUploadModal(id);
  };

  return (
    <>
      <PageHeader
        currentpage={`Project Detail`}
        activepage="Projects"
        mainpage={projectData ? projectData.project_no : "PRJ - 00000000"}
      />
      {projectData && (
        <div className="grid grid-cols-12 gap-6">
          <div className="xl:col-span-9 col-span-12">
            <ProjectSummary
              project={projectData}
              handleUploadModal={handleUploadModal}
            />
            <ProjectTree
              projectId={projectData.id}
              projectStatus={projectData.status}
              startedAt={projectData.started_at}
              endedAt={projectData.ended_at}
              milestones={milestones}
              isLoading={isLoading}
              refetch={refetch}
              handleUploadModal={handleUploadModal}
            />
            <Discussion
              title="Project Discussions"
              storeEndPoint={`/pms/projects/${id}/discussion/`}
              getEndPoint={`/pms/projects/${id}/discussions/`}
            />
            <ProjectStatistics/>
          </div>


          <div className="xl:col-span-3 col-span-12">
            <div className="bg-white shadow-md rounded-lg mb-4 ">
              <ProjectStats projectId={projectData.id} />
            </div>
            <div className="rounded-lg p-1">
              <ProjectAdditionalDetail project={projectData} />
            </div>
            <div className="rounded-lg p-1 mb-4">
              <ProjectTeam users={projectData.users} />
            </div>
            {projectData.attachments.length > 0 && (
              <div className="rounded-lg p-2 mb-4">
                <ProjectAttachment attachments={projectData.attachments} />
              </div>
            )}
          </div>
        </div>
      )}

      {isUploadModalOpen && (
        <UploadModal
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          closeModal={closeUploadModal}
        />
      )}
    </>
  );
};

export default ProjectDetail;
