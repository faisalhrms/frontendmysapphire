import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProjectSummary from "@modules/project-management/components/project/ProjectSummary.jsx";
import ProjectAdditionalDetail from "@modules/project-management/components/project/ProjectAdditionalDetail.jsx";
import ProjectAttachment from "@modules/project-management/components/project/ProjectAttachment.jsx";
import ProjectTree from "@modules/project-management/components/project/ProjectTree.jsx";
import { useProject, useProjectMilestonesWithTasks, useProjectStatistics, useUploadProjectModal } from "@modules/project-management/hooks/projectHooks.js";
import ProjectTeam from "@modules/project-management/components/project/ProjectTeam.jsx";
import Discussion from "@components/Discussion.jsx";
import UploadModal from "@modules/project-management/components/model/UploadModal.jsx";
import IconTabs from "@components/IconTabs.jsx";
import ProjectActivityLog from "@modules/project-management/components/project/ProjectActivityLog.jsx";
import ProjectOverviewTab from "@modules/project-management/components/project/ProjectOverviewTab.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { FolderKanban } from "lucide-react";
import ProjectSiteDetail from "@modules/project-management/components/project/ProjectSiteDetail.jsx";
import ProjectDrawingAttachment from "@modules/project-management/components/project/ProjectDrawingAttachment.jsx";

const ProjectDetail = () => {
  const { id } = useParams();
  const { projectData } = useProject(id);
  const { milestones, isLoading, refetch } = useProjectMilestonesWithTasks(id);
  const { statistics, statsFetching, statsRefetch, statsError } = useProjectStatistics(id, 6, { enabled: false });
  const [activeTab, setActiveTab] = useState('summary');
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
    setActiveTab(tabId);
    if (tabId === "overview") {
      statsRefetch();
    }
  };

  return (
      <>
        <IconPageHeader
            heading={projectData ? projectData.name : "Loading Project..."}
            description="Overview of the project details, milestones, and tasks."
            icon={FolderKanban}
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
                                <ProjectAdditionalDetail project={projectData}/>
                              </div>
                              <div className="rounded-lg">
                                <ProjectSiteDetail site={projectData.site}/>
                              </div>

                              <div className="rounded-lg">
                                <ProjectTeam users={projectData.users}/>
                              </div>
                              <div className="rounded-lg">
                                <ProjectAttachment
                                    attachments={projectData.attachments}
                                    Id={projectData.id}
                                    projectUsers={projectData.users}
                                />
                              </div>
                              <div className="rounded-lg">
                                <ProjectDrawingAttachment drawings={projectData.project_drawings} />

                              </div>
                            </div>
                          </div>
                      ),
                    },
                    {
                      id: "overview",
                      label: "Overview",
                      icon: <i className="bx bx-bar-chart"></i>,
                      content: (
                          <ProjectOverviewTab statistics={statistics} statsFetching={statsFetching} />
                      ),
                    },
                    {
                      id: "activities",
                      label: "Activities",
                      icon: <i className="ri-history-line"></i>,
                      content: (
                          <>
                            {
                                activeTab !== 'activities'
                                ? null :
                                    <ProjectActivityLog id={projectData.id} activeTab={activeTab} projectName={projectData.name} />
                            }
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