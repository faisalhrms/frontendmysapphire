import React from 'react';
import { Link } from "react-router-dom";
import AvatarList from "@components/AvatarList.jsx";
import { formatDate } from "@helpers/dateTime.js";
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
import Tooltip from '@components/Tooltip.jsx';
import ProjectFavourite from "@modules/project-management/components/project/ProjectFavourite.jsx";
import ProgressBar from "@components/ProgressBar.jsx";
import {useDelete} from "@hooks/useDelete.js";
import HasProjectPermission from "@modules/project-management/components/project/HasProjectPermission.jsx";
import TextAvatar from "@components/TextAvatar.jsx";
const ProjectListCard = ({ project, openModal, refetch }) => {
    const { handleDeleteClick } = useDelete();
    return (
        <>
            <div className="box custom-box">
                <div className="box-body">
                    <div className="btn-list ltr:float-right rtl:float-left space-x-2 rtl:space-x-reverse">
                        <ProjectFavourite project={project} refetch={refetch} isGrid={false}/>
                        <Tooltip
                            id={`project-tooltip-view-${project.id}`}
                            text={`(${project.project_no}) ${project.name}`}
                            tooltipContent={`View Project: ${project.name}`}>
                            <Link to={`/module/projects/detail/${project.id}`}
                                  className="avatar !rounded-full avatar-sm bg-light !text-defaulttextcolor">
                                <span><i className="bi bi-eye"></i></span>
                            </Link>
                        </Tooltip>
                        <HasProjectPermission globalPermission='pms.change_project' users={project.users}>
                            <Tooltip
                                id={`project-tooltip-edit-${project.id}`}
                                text={`(${project.project_no}) ${project.name}`}
                                tooltipContent={`Edit Project: ${project.name}`}>
                                <Link to={`/module/projects/edit/${project.id}`}
                                      className="avatar !rounded-full avatar-sm bg-light !text-defaulttextcolor">
                                    <span><i className="bi bi-pencil"></i></span>
                                </Link>
                            </Tooltip>
                            <Tooltip
                                id={`project-tooltip-add-${project.id}`}
                                text={`(${project.project_no}) ${project.name}`}
                                tooltipContent={`Add Milestone In Project: ${project.name}`}>
                                <button onClick={() => openModal(project.id, false)}
                                        className="avatar !rounded-full avatar-sm bg-light !text-defaulttextcolor">
                                    <span><i className="bi bi-plus-circle"></i></span>
                                </button>
                            </Tooltip>
                        </HasProjectPermission>
                        <HasProjectPermission globalPermission='pms.delete_project' users={project.users}>
                            <Tooltip
                                id={`project-tooltip-delete-${project.id}`}
                                text={`(${project.project_no}) ${project.name}`}
                                tooltipContent={`Delete Project: ${project.name}`}>
                                <button className="avatar !rounded-full avatar-sm bg-light !text-defaulttextcolor"
                                        onClick={() => handleDeleteClick(`/pms/projects/${project.id}/delete/`, project.name, refetch)}>
                                    <span><i className="bi bi-trash3"></i></span>
                                </button>
                            </Tooltip>
                        </HasProjectPermission>
                    </div>
                    <div className="mb-2">
                        <div className="flex items-top">
                            <TextAvatar item={project.company}/>
                            <div>
                                <h5 className="font-semibold mb-0">
                                    <Link to={`/module/projects/detail/${project.id}`}>{project.name}</Link>
                                </h5>
                                <span className="text-[#8c9097] dark:text-white/50 block text-xs">
                                    Total <strong
                                    className="text-defaulttextcolor">{project.completed_tasks}/{project.total_tasks}</strong> tasks completed
                                </span>
                                <div className='popular-tags mb-4 space-x-2 rtl:space-x-reverse'>
                                    <span
                                        className='badge badge-md !rounded-full bg-primary/10 text-primary'> {project?.workspace?.name ? project?.workspace.name.toUpperCase() : 'N/A'}</span>
                                    {(
                                        project.tags.map(tag => (
                                            <span key={tag.id}
                                                  className="badge !rounded-full bg-light text-default">{tag.name.toUpperCase()}</span>
                                        ))
                                    )}
                                </div>
                                <div className="font-semibold mb-1">Description :</div>
                                <p className="text-[#8c9097] dark:text-white/50">
                                    {project.description}
                                </p>
                            </div>
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
                            <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">Status :</span>
                            <span className={getBadgeClasses(project.status)}>{toTitleCase(project.status)}</span>
                        </div>
                        <div>
                            <span className="text-[#8c9097] dark:text-white/50 text-[0.6875rem] block">Priority :</span>
                            <span className={getBadgeClasses(project.priority)}>{toTitleCase(project.priority)}</span>
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
export default React.memo(ProjectListCard);
