import React from "react";
import {useToggleFavouriteProject} from "@modules/project-management/hooks/projectHooks.js";
import Tooltip from "@components/Tooltip.jsx";
const ProjectFavourite = ({project, refetch}) => {
    const { handleToggleFavourite, isLoading } = useToggleFavouriteProject();

    const handleFavouriteClick = async () => {
       await handleToggleFavourite(project.id, !project.is_favourite);
       refetch()
    };
    return (
        <>
            <div className='flex items-center justify-center w-[1.75rem] h-[1.75rem] !text-[0.8rem] !py-1 !px-2 rounded-sm bg-light border-light shadow-none !font-medium'>
                <Tooltip
                    id={`tooltip-fav-${project.id}`}
                    text={`${project.name}`}
                    tooltipContent={project.is_favourite ? "Remove from Favourites" : "Add to Favourites"}
                >
                <button type='button' className="text-[1rem]" onClick={handleFavouriteClick} disabled={isLoading}
                >
                    <i className={`ri-heart-fill ${project.is_favourite ? 'text-primary' : 'text-primary/30 hover:text-primary'}`}></i>
                </button>
                </Tooltip>
            </div>
        </>
    )
}

export default ProjectFavourite