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
const ProjectCard = ({ project, openModal, refetch }) => {
    return (
        <>
            <div className="box custom-box">
                <div className="box-header items-center !justify-center flex-wrap !flex">
                    <div className="flex-grow">
                        <Tooltip
                            id={`project-tooltip-${project.id}`}
                            text={`(${project.project_no}) ${project.name}`}
                            tooltipContent={`Project Number: ${project.project_no}`}
                        >
                            <Link
                                to={`/module/projects/detail/${project.id}`}
                                className="font-semibold text-[.875rem] block text-truncate project-list-title">
                                {project.name}
                            </Link>
                        </Tooltip>
                        <span className="text-[#8c9097] dark:text-white/50 block text-[0.75rem]">Total <strong
                            className="text-defaulttextcolor">{project.completed_tasks}/{project.total_tasks}</strong> tasks completed</span>
                    </div>

                    <ProjectFavourite project={project} refetch={refetch}/>
                    <div className="hs-dropdown ti-dropdown">
                    <a aria-label="anchor" href="#"
                           className="flex items-center justify-center w-[1.75rem] h-[1.75rem] !text-[0.8rem] !py-1 !px-2 rounded-sm bg-light border-light shadow-none !font-medium"
                           aria-expanded="false">
                            <i className="fe fe-more-vertical"></i>
                        </a>

                        <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                            <HasPermission permission='change_project'>
                            <li>
                                <Link
                                    to={`/module/projects/edit/${project.id}`}
                                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium !inline-flex">
                                    <i className="ri-edit-line me-1 align-middle"></i>Edit
                                </Link>
                            </li>
                            </HasPermission>

                            <li>
                                <Link
                                    to={`/module/projects/detail/${project.id}`}
                                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium !inline-flex">
                                    <i className="ri-eye-line me-1 align-middle"></i>View
                                </Link>
                            </li>
                            <HasPermission permission='add_project'>
                            {project.status==='active'&& (<li>
                                <button onClick={() => openModal(project.id, false)}
                                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium !inline-flex focus:outline-none appearance-none">
                                    <i className="ri-add-line me-1 align-middle"></i>Milestone
                                </button>
                            </li>)}
                            </HasPermission>
                        </ul>
                    </div>
                </div>

                <div className="box-body">
                    <div className="flex items-center justify-between mb-3">
                        <div>
                            <div className="font-semibold mb-1">Team :</div>
                            <AvatarList users={project.users}/>
                        </div>
                        <div className="text-end">
                            <div className="font-semibold mb-1">Priority :</div>
                            <span className={getBadgeClasses(project.priority)}>{toTitleCase(project.priority)}</span>
                        </div>
                    </div>
                    <div className="font-semibold mb-1">Description :</div>
                    <p className="text-[#8c9097] dark:text-white/50 mb-3">{getExcerptFromText(project.description, 200)}</p>
                    <div className="font-semibold mb-1">Status :</div>
                    <ProgressBar
                        total={project.total_tasks}
                        completed={project.completed_tasks}
                    />
                </div>
                <div className="box-footer flex items-center justify-between">
                    <div>
                        <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">Assigned Date :</span>
                        <span className="font-semibold block">{formatDate(project.started_at)}</span>
                    </div>
                    <div className="text-end">
                        <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">Due Date :</span>
                        <span className="font-semibold block">{formatDate(project.ended_at)}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectCard;
