import { useParams } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import ProjectForm from "@modules/project-management/components/ProjectForm.jsx";
import {useProject} from "@modules/project-management/hooks/projectHooks.js";

const ProjectEdit = () => {
    const { id } = useParams();
    const { projectData } = useProject(id);

    return (
        <>
            <PageHeader currentpage={`Edit ${projectData?.name} (${projectData?.project_no})`} activepage="Projects" mainpage="Edit Project"/>
            {projectData && (
                <ProjectForm
                    projectData={projectData}
                    isEditMode={true}
                />
            )}
        </>
    );
};

export default ProjectEdit;
