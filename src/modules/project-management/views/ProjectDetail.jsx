import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import ProjectSummary from "@modules/project-management/components/project/ProjectSummary.jsx";
import ProjectAdditionalDetail from "@modules/project-management/components/project/ProjectAdditionalDetail.jsx";
import ProjectAttachment from "@modules/project-management/components/project/ProjectAttachment.jsx";
import ProjectTree from "@modules/project-management/components/project/ProjectTree.jsx";
import { useProject, useProjectMilestonesWithTasks, useProjectStatistics, useUploadProjectModal } from "@modules/project-management/hooks/projectHooks.js";
import ProjectTeam from "@modules/project-management/components/project/ProjectTeam.jsx";
import Discussion from "@components/Discussion.jsx";
import UploadModal from "@modules/project-management/components/model/UploadModal.jsx";
import ProjectTaskStatusStats from "../components/project/ProjectTaskStatusStats.jsx";
import ProjectTaskMonthlyStats from "../components/project/ProjectTaskMonthlyStats.jsx";
import ProjectSummaryStats from "@modules/project-management/components/project/ProjectSummaryStats.jsx";
import ProjectUserSummaryStats from "@modules/project-management/components/project/ProjectUserSummaryStats.jsx";
import IconTabs from "@components/IconTabs.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const ProjectDetail = () => {
  const { id } = useParams();
  const { projectData } = useProject(id);
  const { milestones, isLoading, refetch } = useProjectMilestonesWithTasks(id);
  const { statistics, statsFetching, statsRefetch, statsError } = useProjectStatistics(id, 6, { enabled: false });
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

  const handleTabChange = (tabId) => {
    if (tabId === "overview") {
      statsRefetch();
    }
  };

  return (
      <>
        <PageHeader
            currentpage={`Project Detail`}
            activepage="Projects"
            mainpage={projectData ? projectData.project_no : "PRJ - 00000000"}
        />
        {projectData && (
            <div className="col-span-12 lg:col-span-9 xl:col-span-9 sm:col-span-9 2xl:col-span-8 min-h-screen">
              <IconTabs
                  tabs={[
                    {
                      id: "summary",
                      label: "Summary",
                      icon: <i className="bx bx-task"></i>,
                      content: (
                          <div className="grid grid-cols-12 gap-6">
                            <div className="xl:col-span-9 sm:col-span-9 col-span-12">
                              <ProjectSummary
                                  project={projectData}
                                  handleUploadModal={handleUploadModal}
                              />
                              <ProjectTree
                                  projectId={projectData.id}
                                  projectStatus={projectData.status}
                                  approval={projectData.requires_approval}
                                  startedAt={projectData.started_at}
                                  endedAt={projectData.ended_at}
                                  projectUsers={projectData.users}
                                  milestones={milestones}
                                  isLoading={isLoading}
                                  refetch={refetch}
                                  handleUploadModal={handleUploadModal}
                              />
                              <Discussion
                                  title="Project Discussions"
                                  storeEndPoint={`/pms/projects/${id}/discussion/`}
                                  getEndPoint={`/pms/projects/${id}/discussions/`}
                                  users={projectData.users}
                              />
                            </div>

                            <div className="xl:col-span-3 sm:col-span-3  col-span-12 sticky top-0 self-start">
                              <div className="rounded-lg">
                                <ProjectAdditionalDetail project={projectData} />
                              </div>
                              <div className="rounded-lg">
                                <ProjectTeam users={projectData.users} />
                              </div>
                              {projectData.attachments.length > 0 && (
                                  <div className="rounded-lg">
                                    <ProjectAttachment attachments={projectData.attachments} />
                                  </div>
                              )}
                            </div>
                          </div>
                      ),
                    },
                    {
                      id: "overview",
                      label: "Overview",
                      icon: <i className="bx bx-bar-chart"></i>,
                      content: (
                          <>
                            {statsFetching ? (
                                <LoadingSpinner />
                            ) : statistics?.month_over_month ? (
                                <>
                                  <div className="grid grid-cols-12 gap-6">
                                    <div className="xl:col-span-9 sm:col-span-9 2xl:col-span-8 col-span-12">
                                      <ProjectUserSummaryStats
                                          summary={statistics.user_summary}
                                          statsFetching={statsFetching}
                                          height={450}
                                      />
                                      <ProjectSummaryStats
                                          summary={statistics.task_summary}
                                          statsFetching={statsFetching}
                                          height={385}
                                      />
                                    </div>

                                    <div className="xl:col-span-3 sm:col-span-3 2xl:col-span-4 col-span-12">
                                      <div className="bg-white shadow-md rounded-lg mb-4">
                                        <ProjectTaskStatusStats
                                            monthOverMonth={statistics?.month_over_month}
                                            statsFetching={statsFetching}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-12 gap-6">
                                    <div className="col-span-12">
                                      <ProjectTaskMonthlyStats
                                          months={statistics.n_months}
                                          statsFetching={statsFetching}
                                      />
                                    </div>
                                  </div>
                                </>
                            ) : null}
                          </>
                      ),
                    },
                  ]}
                  onTabChange={handleTabChange}
              />
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