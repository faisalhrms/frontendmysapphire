import ProjectForm from "@modules/project-management/components/ProjectForm.jsx";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import {useSelector} from "react-redux";

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
            <PageHeader currentpage="Create New Project" activepage="Projects" mainpage="Create" />
            <ProjectForm projectData={projectData} />
        </>
    );
};

export default ProjectCreate;
