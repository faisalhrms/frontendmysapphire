import React from 'react';
import { Link } from "react-router-dom";
import AvatarList from "@components/AvatarList.jsx";
import { formatDate } from "@helpers/dateTime.js";
import { getExcerptFromText, toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
import Tooltip from '@components/Tooltip.jsx';
import ProjectFavourite from "@modules/project-management/components/project/ProjectFavourite.jsx";
import ProgressBar from "@components/ProgressBar.jsx";
import {useDelete} from "@hooks/useDelete.js";
import HasProjectPermission from "@modules/project-management/components/project/HasProjectPermission.jsx";
import TextAvatar from "@components/TextAvatar.jsx";

const ProjectGridCard = ({ project, openModal, refetch }) => {

    const { handleDeleteClick } = useDelete();

    return (
        <>
            <div className="box custom-box">
                <div className="box-header items-center flex-wrap !flex">
                    <TextAvatar item={project.company}/>
                    <div className="flex-grow">
                        <Tooltip
                            id={`project-tooltip-${project.id}`}
                            text={`(${project.project_no}) ${project.name}`}
                            tooltipContent={`Project: ${project.name}`}
                        >
                            <Link
                                to={`/module/projects/detail/${project.id}`}
                                className="font-semibold text-[.875rem] block text-truncate project-list-title">
                                {project.name}
                            </Link>
                        </Tooltip>
                        <span className="text-[#8c9097] dark:text-white/50 block text-[0.75rem]">
                            Total <strong
                            className="text-defaulttextcolor">{project.completed_tasks}/{project.total_tasks}</strong> tasks completed
                        </span>
                    </div>

                    <ProjectFavourite project={project} refetch={refetch}/>
                    <div className="hs-dropdown ti-dropdown">
                        <a aria-label="anchor" href="#"
                           className="flex items-center justify-center w-[1.75rem] h-[1.75rem] !text-[0.8rem] !py-1 !px-2 rounded-sm bg-light border-light shadow-none !font-medium"
                           aria-expanded="false">
                            <i className="fe fe-more-vertical"></i>
                        </a>

                        <ul className="hs-dropdown-menu ti-dropdown-menu hidden">
                            <HasProjectPermission globalPermission='change_project' users={project.users}>
                                <li>
                                    <Link
                                        to={`/module/projects/edit/${project.id}`}
                                        className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium !inline-flex">
                                        <i className="ri-edit-line me-1 align-middle"></i>Edit
                                    </Link>
                                </li>
                                <li>
                                    <button onClick={() => openModal(project.id, false)}
                                            className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium !inline-flex focus:outline-none appearance-none">
                                        <i className="ri-add-line me-1 align-middle"></i>Milestone
                                    </button>
                                </li>
                            </HasProjectPermission>
                            <li>
                                <Link
                                    to={`/module/projects/detail/${project.id}`}
                                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium !inline-flex">
                                    <i className="ri-eye-line me-1 align-middle"></i>View
                                </Link>
                            </li>
                            <HasProjectPermission globalPermission='delete_project' users={project.users}>
                                <button
                                    onClick={() => handleDeleteClick(`/pms/projects/${project.id}/delete/`, project.name, refetch)}
                                    className="ti-dropdown-item !py-2 !px-[0.9375rem] !text-[0.8125rem] !font-medium !inline-flex focus:outline-none appearance-none">
                                    <i className="ri-delete-bin-2-line me-1 align-middle"></i>Delete
                                </button>
                            </HasProjectPermission>
                        </ul>
                    </div>
                    <span className='space-x-1 rtl:space-x-reverse'>
                        <span className='badge badge-md !rounded-full bg-primary/10 text-primary'> {project?.workspace?.name ? project?.workspace.name.toUpperCase() : 'N/A'}</span>
                            {(
                                project?.tags?.map((tag, index) => (
                                    index < 2 ? <span key={tag.id} className="badge !rounded-full bg-light text-default">{getExcerptFromText(tag.name, 20).toUpperCase()}</span> : ''
                                ))
                            )}
                        </span>
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
                    <p className="text-[#8c9097] dark:text-white/50 min-h-[50px] max-h-[50px] overflow-auto">
                        {getExcerptFromText(project.description, 70)}
                    </p>
                    <div className="font-semibold mb-1">Progress :</div>
                    <ProgressBar
                        total={project.total_tasks}
                        completed={project.completed_tasks}
                    />
                </div>
                <div className="box-footer flex items-center justify-between">
                    <div>
                        <span
                            className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">Assigned Date</span>
                        <span className="font-semibold block">{formatDate(project.started_at)}</span>
                    </div>
                    <div>
                        <span className={getBadgeClasses(project.status)}>{toTitleCase(project.status)}</span>
                    </div>
                    <div className="text-end">
                        <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">Due Date</span>
                        <span className="font-semibold block">{formatDate(project.ended_at)}</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default React.memo(ProjectGridCard);
