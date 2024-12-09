import ProjectForm from "@modules/project-management/components/ProjectForm.jsx";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";

const ProjectCreate = () => {
    return (
        <>
            <PageHeader currentpage="Create New Project" activepage="Projects" mainpage="Create" />
            <ProjectForm />
        </>
    );
};

export default ProjectCreate;
