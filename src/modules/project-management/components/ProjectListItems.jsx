import React from "react";
import ProjectListCard from "@modules/project-management/components/ProjectListCard.jsx";

const ProjectListItems = ({ rows, handleOpenMilestoneModal, refetch }) => {

    return (
        rows.map(project => (
            <div className="col-span-12" key={project.id}>
                <ProjectListCard
                    openModal={() => handleOpenMilestoneModal(project)}
                    project={project}
                    refetch={refetch}
                />
            </div>
        ))
    )
}

export default ProjectListItems