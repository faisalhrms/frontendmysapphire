import ProjectGridCard from "@modules/project-management/components/ProjectGridCard.jsx";
import React from "react";

const ProjectGridItems = ({ rows, handleOpenMilestoneModal, refetch }) => {

    return (
        rows.map(project => (
            <div className="col-span-12 xl:col-span-4 xxl:col-span-4 xxxl:col-span-3" key={project.id}>
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