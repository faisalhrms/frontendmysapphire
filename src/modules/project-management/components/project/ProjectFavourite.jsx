import React from "react";
import {useToggleFavouriteProject} from "@modules/project-management/hooks/projectHooks.js";
import Tooltip from "@components/Tooltip.jsx";
const ProjectFavourite = ({project, refetch, isGrid = true}) => {
    const { handleToggleFavourite, isLoading } = useToggleFavouriteProject();

    const handleFavouriteClick = async () => {
       await handleToggleFavourite(project.id, !project.is_favourite);
       refetch()
    };
    return (
        <>
            <span className={`${isGrid ? 'flex items-center justify-center w-[1.75rem] h-[1.75rem] !text-[0.8rem] !py-1 !px-2 rounded-sm bg-light border-light shadow-none !font-medium' : ''}`}>
                <Tooltip
                    id={`tooltip-fav-${project.id}`}
                    text={`${project.name}`}
                    tooltipContent={project.is_favourite ? "Remove from Favourites" : "Add to Favourites"}
                >
                <button type='button' className={`${isGrid ? 'text-[1rem]' : `avatar !rounded-full avatar-sm ${project.is_favourite ? 'bg-primary' : 'bg-light !text-defaulttextcolor'} text-white`}`} onClick={handleFavouriteClick} disabled={isLoading}>
                    {
                        isGrid ?
                            <i className={`ri-heart-fill ${project.is_favourite ? 'text-primary' : 'text-primary/30 hover:text-primary'}`}></i>
                            :
                            <span><i className="bi bi-heart"></i></span>
                    }
                </button>
                </Tooltip>
            </span>
        </>
    )
}

export default React.memo(ProjectFavourite);
