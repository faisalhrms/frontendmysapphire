import React from "react";
import {getBadgeClasses} from "@helpers/badges.js";
import {toTitleCase} from "@helpers/formatters.js";
import Avatar from "@components/Avatar.jsx";
import {formatDate} from "@helpers/dateTime.js";
import Tooltip from "@components/Tooltip.jsx";
import {Link} from "react-router-dom";
import AvatarList from "@components/AvatarList.jsx";

const RecentProjectCard = ({ projects }) => {
    return (
        <div className="xl:col-span-4 col-span-12">
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">
                       High Priority Projects
                    </div>
                </div>
                <div className="box-body box max-h-96 overflow-y-auto">
                    <ul className="list-none projects-maintask-card">
                        {projects && projects.length > 0 ? (
                            projects.map((project, index) => (
                                <li key={index}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="me-2 leading-none">
                                                <Avatar
                                                    avatar={project.manager ? project.manager?.avatar : null}
                                                    size='md'
                                                    parentClasses='bg-primary/10 !fill-primary'
                                                    full_name={project?.manager?.full_name || 'N/A' }

                                                />
                                            </div>
                                            <div>
                                                <Tooltip
                                                    id={`recent-project-tooltip-${project.id}`}
                                                    text={`(${project.project_no}) ${project.name}`}
                                                    tooltipContent={`Click To View Project: ${project.project_no}`}
                                                >
                                                    <Link
                                                        to={`/module/projects/detail/${project.id}`}
                                                        className="font-semibold text-[.875rem] block text-truncate project-list-title mb-0">
                                                        {project.name}
                                                    </Link>
                                                </Tooltip>
                                                <span className="text-[#8c9097] dark:text-white/50 opacity-[0.6] inline-block">{formatDate(project.ended_at)}</span>
                                                <AvatarList users={project.users} size='xs' />
                                                <p className="block text-[#8c9097] dark:text-white/50 text-[0.6875rem]">{project.description}</p>
                                            </div>
                                        </div>
                                        <div className={getBadgeClasses(project.status)}>
                                            {toTitleCase(project.status)}
                                        </div>

                                    </div>
                                </li>
                            ))
                        ) : (
                            <li>No priority projects available</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};



export default RecentProjectCard;
