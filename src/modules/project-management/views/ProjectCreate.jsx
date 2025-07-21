import ProjectForm from "@modules/project-management/components/ProjectForm.jsx";
import { FolderPlus } from "lucide-react";
import {useSelector} from "react-redux";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

const ProjectCreate = () => {
    const user = useSelector((state) => state.auth.user);
    const projectData  = {
        company_id: user.employee?.company?.id,
        department_id: user.employee?.department?.id,
        company: user.employee?.company,
        department: user.employee?.department,
    }
    return (
        <>
            <IconPageHeader
                heading="Create New Project"
                description="Fill out the details below to create a new project, define details, and assign team members."
                icon={FolderPlus}
            />
            <ProjectForm projectData={projectData} />
        </>
    );
};

export default ProjectCreate;
