import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import ProjectSummary from "@modules/project-management/components/project/ProjectSummary.jsx";
import ProjectAdditionalDetail from "@modules/project-management/components/project/ProjectAdditionalDetail.jsx";
import ProjectAttachment from "@modules/project-management/components/project/ProjectAttachment.jsx";
import ProjectTree from "@modules/project-management/components/project/ProjectTree.jsx";
import {useParams} from "react-router-dom";
import {
    useProject,
    useProjectMilestonesWithTasks,
    useUploadProjectModal
} from "@modules/project-management/hooks/projectHooks.js";
import ProjectTeam from "@modules/project-management/components/project/ProjectTeam.jsx";
import Discussion from "@components/Discussion.jsx";
import UploadModal from "@modules/project-management/components/model/UploadModal.jsx";
import {useState} from "react";



const ProjectDetail = () => {
    const { id } = useParams();
    const { projectData } = useProject(id);
    const { milestones, isLoading, refetch } = useProjectMilestonesWithTasks(id);
    const [importType, setImportType] = useState('M')
    const {
        openUploadModal,
        closeUploadModal,
        control,
        errors,
        isSubmitting,
        handleSubmit,
        onSubmit,
        isUploadModalOpen,
    } = useUploadProjectModal(refetch, importType)

    const handleUploadModal = (id, importType) => {
        setImportType(importType);
        openUploadModal(id)
    }
    return (
        <>
            <PageHeader currentpage={`Project Detail`} activepage="Projects" mainpage={projectData ? projectData.project_no : 'PRJ - 00000000'}/>
            {projectData && (
                <div className="grid grid-cols-12 gap-6">
                    <div className="xl:col-span-9 col-span-12">
                        <ProjectSummary project={projectData} handleUploadModal={handleUploadModal} />
                        <ProjectTree projectId={projectData.id} projectStatus={projectData.status} startedAt={projectData.started_at} endedAt={projectData.ended_at} milestones={milestones} isLoading={isLoading} refetch={refetch} handleUploadModal={handleUploadModal}  />
                        <Discussion title="Project Discussions" storeEndPoint={`/pms/projects/${id}/discussion/`} getEndPoint={`/pms/projects/${id}/discussions/`}  />
                    </div>
                    <div className="xl:col-span-3 col-span-12">
                        <ProjectAdditionalDetail project={projectData}  />
                        <ProjectTeam users={projectData.users} />
                        {projectData.attachments.length > 0 && (<ProjectAttachment attachments={projectData.attachments} />
                        )}
                    </div>
                </div>
            )}

            {
                isUploadModalOpen &&
                <UploadModal
                    control={control}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    closeModal={closeUploadModal}
                />
            }
        </>
    )
}
export default ProjectDetail;