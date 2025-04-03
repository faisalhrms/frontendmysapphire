import {Link} from "react-router-dom";
import {toTitleCase} from "@helpers/formatters.js";
import {calculateEffort, formatDate} from "@helpers/dateTime.js";
import Avatar from "@components/Avatar.jsx";
import sampleFile from "@assets/files/sample_upload_milestones_with_tasks_in_project.xlsx";
import ProgressBar from "@components/ProgressBar.jsx";
import React from "react";
import HasProjectPermission from "@modules/project-management/components/project/HasProjectPermission.jsx";

const ProjectSummary = ({project, handleUploadModal}) => {
    return (
        <>
            <div className="box">
                <div className="box-header justify-between">
                    <div className="box-title">Project Summary</div>
                    <div className="flex items-center space-x-2">
                        <HasProjectPermission globalPermission='change_project' users={project.users}>
                            <div className="flex space-x-2">
                                <a
                                    href={sampleFile}
                                    download="sample_upload_milestones_with_tasks_in_project.xlsx"
                                    className="ti-btn ti-btn-success !py-1 !px-2 !text-[0.75rem]">
                                    <i className="ri-file-download-line me-1 align-middle"></i>
                                    Download Sample File
                                </a>
                                <button
                                    onClick={() => handleUploadModal(project.id, 'M')}
                                    className="ti-btn ti-btn-info !py-1 !px-2 !text-[0.75rem]">
                                    <i className="ri-file-upload-line me-1 font-semibold align-middle"></i>
                                    Upload Milestones
                                </button>
                                <Link
                                    to={`/module/projects/edit/${project.id}`}
                                    className="ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]">
                                    <i className="ri-edit-line font-semibold align-middle"></i> Edit Project
                                </Link>
                            </div>
                        </HasProjectPermission>
                    </div>
                </div>
                <div className="box-body">
                    <h5 className="font-semibold mb-4 task-title text-[1.25rem]">
                        {project.name}
                    </h5>
                    <div className="text-[.9375rem] font-semibold mb-2">Project Description :</div>
                    <p className="text-[#8c9097] dark:text-white/50 task-description">{project.description}</p>
                </div>
                <div className="box-footer">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">Manager</span>
                            <div className="flex items-center flex-wrap">
                                <div className="me-2 leading-none">
                                    <Avatar avatar={project.manager.avatar}/>
                                </div>
                                <span
                                    className="block text-[.875rem] dark:text-defaulttextcolor/70 font-semibold">{toTitleCase(project.manager.full_name)}</span>
                            </div>
                        </div>
                        <div>
                            <span
                                className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">Assigned Date</span>
                            <span
                                className="block text-[.875rem] font-semibold dark:text-defaulttextcolor/70">{formatDate(project.started_at)}</span>
                        </div>
                        <div>
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">Due Date</span>
                            <span
                                className="block text-[.875rem] font-semibold dark:text-defaulttextcolor/70">{formatDate(project.ended_at)}</span>
                        </div>
                        <div className="task-details-progress">
                            <span
                                className="block text-[#8c9097] dark:text-white/50 text-[0.75rem] mb-1">Progress</span>
                            <div className="flex items-center flex-wrap">
                                <ProgressBar
                                    total={project.total_tasks}
                                    completed={project.completed_tasks}
                                    withStatus={false}
                                />
                            </div>
                        </div>
                        <div>
                            <span className="block text-[#8c9097] dark:text-white/50 text-[0.75rem]">Efforts</span>
                            <span
                                className="block text-[.875rem]  dark:text-defaulttextcolor/70 font-semibold">{calculateEffort(project.started_at, project.ended_at)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>)
}

export default ProjectSummary;