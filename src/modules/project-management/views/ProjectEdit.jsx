import { useParams } from "react-router-dom";
import ProjectForm from "@modules/project-management/components/ProjectForm.jsx";
import {useProject} from "@modules/project-management/hooks/projectHooks.js";
import {FolderKanban} from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import React from "react";

const ProjectEdit = () => {
    const { id } = useParams();
    const { projectData } = useProject(id, true);

    return (
        <>
            <IconPageHeader
                heading={projectData ? `Edit ${projectData.name}` : "Loading Project..."}
                description="Update project details."
                icon={FolderKanban}
            />
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
