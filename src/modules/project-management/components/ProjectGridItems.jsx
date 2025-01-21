import ProjectGridCard from "@modules/project-management/components/ProjectGridCard.jsx";
import React from "react";

const ProjectGridItems = ({ rows, handleOpenMilestoneModal, refetch }) => {

    return (
        rows.map(project => (
            <div className="xxl:col-span-3 xl:col-span-4 md:col-span-6 col-span-12" key={project.id}>
                <ProjectGridCard
                    openModal={() => handleOpenMilestoneModal(project)}
                    project={project}
                    refetch={refetch}
                />
            </div>
        ))
    )
}

export default ProjectGridItems