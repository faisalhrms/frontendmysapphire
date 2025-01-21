import React from 'react';
import { Link } from "react-router-dom";
import AvatarList from "@components/AvatarList.jsx";
import { formatDate } from "@helpers/dateTime.js";
import { getExcerptFromText, toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
import Tooltip from '@components/Tooltip.jsx';
import ProjectFavourite from "@modules/project-management/components/project/ProjectFavourite.jsx";
import HasPermission from "@components/HasPermission.jsx";
import ProgressBar from "@components/ProgressBar.jsx";
const ProjectListCard = ({ project, openModal, refetch }) => {
    return (
        <>
            <div className="box custom-box">
                <div className="box-body">
                    <div className="btn-list ltr:float-right rtl:float-left space-x-2 rtl:space-x-reverse">
                        <div className="hs-tooltip ti-main-tooltip">
                            <button type="button"
                                    className="hs-tooltip-toggle avatar !rounded-full avatar-sm bg-primary text-white">
                                <span><i className="bi bi-download"></i></span>
                                <span
                                    className="hs-tooltip-content  ti-main-tooltip-content py-1 px-2 !bg-black !text-xs !font-medium !text-white shadow-sm"
                                    role="tooltip">Download Resume</span>
                            </button>
                        </div>
                        <div className="hs-tooltip ti-main-tooltip">
                            <button type="button"
                                    className="hs-tooltip-toggle avatar !rounded-full avatar-sm bg-light !text-defaulttextcolor">
                                <span><i className="bi bi-heart"></i></span>
                                <span
                                    className="hs-tooltip-content  ti-main-tooltip-content py-1 px-2 !bg-black !text-xs !font-medium !text-white shadow-sm "
                                    role="tooltip">Wishlist</span>
                            </button>
                        </div>
                        <div className="hs-tooltip ti-main-tooltip">
                            <button type="button"
                                    className="hs-tooltip-toggle avatar !rounded-full avatar-sm bg-light !text-defaulttextcolor">
                                <span><i className="bi bi-eye"></i></span>
                                <span
                                    className="hs-tooltip-content  ti-main-tooltip-content py-1 px-2 !bg-black !text-xs !font-medium !text-white shadow-sm "
                                    role="tooltip">
                                    View Profile
                                </span>
                            </button>
                        </div>
                    </div>
                    <div className="ms-2 mb-2">
                        <h5 className="font-semibold mb-0 flex items-center">
                            <Link to={`/module/projects/detail/${project.id}`}>  {project.name}</Link>
                        </h5>
                        <span className="text-[#8c9097] dark:text-white/50 block text-[0.75rem]">Total <strong className="text-defaulttextcolor">{project.completed_tasks}/{project.total_tasks}</strong> tasks completed</span>
                    </div>
                    <div className="flex items-center">
                        <div className="ms-2">
                            <div className="font-semibold mb-1">Description :</div>
                            <p className="text-[#8c9097] dark:text-white/50 min-h-[50px] max-h-[50px] overflow-auto">
                                {project.description}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="box-footer">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">Team:</span>
                            <AvatarList users={project.users}/>
                        </div>
                        <div>
                        <span
                            className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">Assigned Date :</span>
                            <span className="font-semibold block">{formatDate(project.started_at)}</span>
                        </div>
                        <div>
                            <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">Due Date :</span>
                            <span className="font-semibold block">{formatDate(project.ended_at)}</span>
                        </div>
                        <div>
                            <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">Priority :</span>
                            <span className={getBadgeClasses(project.priority)}>{toTitleCase(project.priority)}</span>
                        </div>
                        <div>
                            <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">Status :</span>
                            <span className={getBadgeClasses(project.status)}>{toTitleCase(project.status)}</span>
                        </div>
                        <div>
                            <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">Progress :</span>
                            <ProgressBar
                                total={project.total_tasks}
                                completed={project.completed_tasks}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectListCard;
