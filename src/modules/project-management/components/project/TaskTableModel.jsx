"use client"

import React, { useState, useEffect } from "react"
import AvatarList from "@components/AvatarList.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import Tooltip from "@components/Tooltip.jsx";
import { formatDate } from "@helpers/dateTime.js";
import ProgressBar from "@components/ProgressBar.jsx";
import Discussion from "@components/Discussion.jsx";
import { getTaskWithChild } from "../../services/taskService.js";
import {Avatar} from "@mui/material";
import {generateFile} from "@helpers/media.js";
import {getBadgeClasses} from "@helpers/badges.js";
export default function ProjectManagement({ show, setShow, viewData }) {
    const [activeTab, setActiveTab] = useState("updates");
    const [showDropdown, setShowDropdown] = useState(null);
    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        if (viewData?.id) {
            getTaskWithChild(viewData.id).then((data) => {
                if (data?.attachments) {
                    setAttachments(data.attachments);
                }
            }).catch((error) => {
                Notify.error("Failed to fetch task details");
            });
        }
    }, [viewData?.id]);

    const toggleDropdown = (tab) => {
        if (showDropdown === tab) {
            setShowDropdown(null);
        } else {
            setShowDropdown(tab);
        }
    };

    const closeDropdown = () => {
        setShowDropdown(null);
    };



    const formatFileSize = (bytes) => {
        if (!bytes) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const PersonRow = ({ users }) => (
        <div className="flex items-center border-b border-gray-100">
            <div className="w-10 flex items-center justify-center">
                <i className="ri-account-circle-line text-2xl text-gray-600" />
            </div>
            <span className="font-medium text-gray-700 w-36 dark:text-gray-200">
      Person
    </span>
            <div className="flex-1 p-4 bg-gray-200 text-center text-gray-700 dark:text-gray-200 dark:bg-bodybg/80 flex justify-center">
                <AvatarList users={users} max={4} />
            </div>
        </div>
    );
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center" onClick={closeDropdown} style={{ zIndex: 999 , overflow: 'hidden' }}>
            <div className="bg-white w-[75%] max-w-7xl h-[90vh] rounded-md flex overflow-hidden dark:text-gray-200 dark:bg-bodybg" onClick={(e) => e.stopPropagation()} style={{
                height: '90vh',
                overflowY: 'auto',
                overflowX: 'hidden'
            }}>

                <div className="w-[40%] border-r border-gray-200 overflow-y-auto dark:text-gray-200 dark:bg-bodybg">
                    <div className="sticky top-0 text-lg font-bold bg-white p-4 z-10 dark:text-gray-200 dark:bg-bodybg">
                        <h1 className="text-lg font-semibold dark:text-gray-200">
                            {viewData?.name || 'Milestone Detail'}
                        </h1>
                        <div className="text-sm ">
                            in
                            <span className='mx-2'><i class="ri-arrow-right-line "></i></span>
                            <span
                                className="font-semibold text-blue cursor-pointer hover:text-blue-600">Srl</span>
                        </div>
                    </div>
                    <div className="p-4 ">
                        <div className="space-y-3">
                            {/* Task ID */}
                            <div className="flex items-center border-b border-gray-100 ">
                                <div className="w-10 flex items-center justify-center">
                                    <i className="ri-user-line text-2xl text-gray-600"></i>
                                </div>
                                <span className="font-medium text-gray-700 w-36 dark:text-gray-200">Task Id</span>
                                <div
                                    className="flex-1 p-4 bg-gray-200 text-center text-gray-700 dark:text-gray-200 dark:bg-bodybg/80">
                                    <span>{viewData?.task_no || ''}</span>
                                </div>
                            </div>
                            <div className="flex items-center border-b border-gray-100">
                                <div className="w-10 flex items-center justify-center">
                                    <i className="ri-menu-5-line text-2xl text-gray-600"></i>
                                </div>
                                <span className="font-medium text-gray-700 w-36 dark:text-gray-200">Name</span>
                                <div
                                    className="flex-1 p-4 bg-gray-200 text-center text-gray-700 dark:text-gray-200 dark:bg-bodybg/80">
                                    <span>{viewData?.name || ''}</span>
                                </div>
                            </div>
                            <PersonRow users={viewData?.users || []}/>

                            <div className="flex items-center border-b border-gray-100">
                                <div className="w-10 flex items-center justify-center">
                                    <i className="ri-group-line text-2xl text-gray-600"></i>
                                </div>
                                <span className="font-medium text-gray-700 w-36 dark:text-gray-200">Team</span>
                                <div
                                    className="flex-1 p-4 bg-gray-200 text-center text-gray-700 dark:text-gray-200 dark:bg-bodybg/80">
                                    {(
                                        viewData?.teams?.map(team => (
                                            <span key={team.id}>{toTitleCase(team.name)}</span>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center border-b border-gray-100">
                                <div className="w-10 flex items-center justify-center">
                                    <i className="ri-history-line text-2xl text-gray-600"></i>
                                </div>
                                <span className="font-medium text-gray-700 w-36 dark:text-gray-200">Deadline</span>
                                <div
                                    className="flex-1 p-4 bg-gray-200 text-center text-gray-700 dark:text-gray-200 dark:bg-bodybg/80">
                                    {
                                        viewData?.completion_timeline !== null ?
                                            <span className="me-6 text-success text-[1rem]">
                                                <Tooltip
                                                    id={`task-tooltip-${viewData?.id}-info`}
                                                    tooltipContent={`${viewData?.completion_timeline < 0 ? `Done ${Math.abs(viewData?.completion_timeline)} days after deadline` : 'Done on time'} `}
                                                >
                                                    {
                                                        viewData?.completion_timeline < 0
                                                            ?
                                                            <i className="ri-information-line cursor-pointer"></i>
                                                            :
                                                            <i className="ri-check-double-line cursor-pointer"></i>
                                                    }
                                                </Tooltip>
                                            </span>
                                            :
                                            (
                                                viewData?.is_overdue ?
                                                    <span className="me-6 text-danger text-[1rem]">
                                                        <Tooltip
                                                            id={`task-tooltip-${viewData?.id}-overdue`}
                                                            tooltipContent={`Task is overdue by ${Math.abs(viewData?.days_left)} days`}
                                                        >
                                                            <i className="ri-information-line cursor-pointer"></i>
                                                        </Tooltip>
                                                    </span>
                                                    :
                                                    <span className="me-6 text-secondary text-[1rem]">
                                                        <Tooltip
                                                            id={`task-tooltip-${viewData?.id}-days_left`}
                                                            tooltipContent={`${Math.abs(viewData?.days_left)} days left`}
                                                        >
                                                            <i className="ri-information-line cursor-pointer"></i>
                                                        </Tooltip>
                                                    </span>
                                            )
                                    }
                                    <span
                                        className={viewData?.completed_at ? 'line-through' : (viewData?.is_overdue ? 'line-through text-danger' : '')}>
                                        {formatDate(viewData?.ended_at)}
                                    </span>
                                </div>
                            </div>

                            {/*<div className="flex items-center border-b border-gray-100">*/}
                            {/*    <div className="w-10 flex items-center justify-center">*/}
                            {/*        <i className="ri-bar-chart-horizontal-line text-2xl text-gray-600"></i>*/}
                            {/*    </div>*/}
                            {/*    <span className="font-medium text-gray-700 w-36 dark:text-gray-200">Status</span>*/}
                            {/*    <div*/}
                            {/*        className="flex-1 p-4 bg-gray-200 text-center text-gray-700 dark:text-gray-200 dark:bg-bodybg/80">*/}
                            {/*        <span className={`px-2 py-1 rounded-md ${*/}
                            {/*            viewData?.status === 'done' || viewData?.status === 'completed' ? 'bg-green-500 text-white' :*/}
                            {/*                viewData?.status === 'in_progress' ? 'bg-blue-500 text-white' :*/}
                            {/*                    viewData?.status === 'overdue' ? 'bg-red-500 text-white' : 'bg-gray-300'*/}
                            {/*        }`}>*/}
                            {/*            {toTitleCase(viewData?.status || '')}*/}
                            {/*        </span>*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            <div className="flex items-center border-b border-gray-100">
                                <div className="w-10 flex items-center justify-center">
                                    <i className="ri-bar-chart-horizontal-line text-2xl text-gray-600"></i>
                                </div>
                                <span className="font-medium text-gray-700 w-36 dark:text-gray-200">Status</span>

                                <div
                                    className={`flex-1 p-4 text-center rounded-md ${getBadgeClasses(viewData?.status, '', false)}`}>
        <span>
            {toTitleCase(viewData?.status || '')}
        </span>
                                </div>
                            </div>

                            <div className="flex items-center border-b border-gray-100">
                                <div className="w-10 flex items-center justify-center">
                                    <i className="bi bi-calendar2-check text-2xl text-gray-600"></i>
                                </div>
                                <span
                                    className="font-medium text-gray-700 w-36 dark:text-gray-200">Completion Date</span>
                                <div
                                    className="flex-1 p-4 bg-gray-200 text-center text-gray-700 dark:text-gray-200 dark:bg-bodybg/80">
                                    <span>
      {viewData?.completed_at
          ? formatDate(viewData.completed_at)
          : 'Yet to Complete'}
    </span>
                                </div>
                            </div>

                            <div className="flex items-center border-b border-gray-100">
                                <div className="w-10 flex items-center justify-center">
                                    <i className="bi bi-check-circle text-2xl text-gray-600"></i>
                                </div>
                                <span
                                    className="font-medium text-gray-700 w-36 dark:text-gray-200">Status Completion</span>
                                <div
                                    className="flex-1 p-4 bg-gray-200 text-center text-gray-700 dark:text-gray-200 dark:bg-bodybg/80">
                                    <ProgressBar value={viewData?.progress || 0} barColor='!bg-success'
                                                 withStatus={false}/>
                                </div>
                            </div>

                            <div className="flex items-center  border-b border-gray-100">
                                <div className="w-10 flex items-center justify-center">
                                    <i className="ri-wallet-2-line text-2xl text-gray-600"></i>
                                </div>
                                <span className="font-medium text-gray-700 w-36 dark:text-gray-200">Aging</span>
                                <div
                                    className="flex-1 p-4 bg-gray-200 text-center text-gray-700 dark:text-gray-200 dark:bg-bodybg/80">
                                    <span>{viewData?.aging}</span>
                                </div>
                            </div>

                            <div className="flex items-center  border-b border-gray-100">
                                <div className="w-10 flex items-center justify-center">
                                    <i className="ri-mist-fill text-2xl text-gray-600"></i>
                                </div>
                                <span
                                    className="font-medium text-gray-700 w-36 dark:text-gray-200">Timeline Groups</span>
                                <div
                                    className="flex-1 p-4 bg-gray-200 text-center text-gray-700 dark:text-gray-200 dark:bg-bodybg/80">
                                    <span>{viewData?.time_line_group}</span>
                                </div>
                            </div>

                            <div className="flex items-center  border-b border-gray-100">
                                <div className="w-10 flex items-center justify-center">
                                    <i className="ri-indent-increase text-2xl text-gray-600"></i>
                                </div>
                                <span className="font-medium text-gray-700 w-36 dark:text-gray-200">Tags</span>
                                <div
                                    className="flex-1 p-4 bg-gray-200 text-center text-gray-700 dark:text-gray-200 dark:bg-bodybg/80">
                                    {viewData?.tags?.map(tag => tag.name).join(', ')}
                                </div>
                            </div>

                            {/* Launch */}
                            <div className="flex items-center border-b border-gray-100">
                            <div className="w-10 flex items-center justify-center">
                                    <i className="ri-calendar-2-line text-2xl text-gray-600"></i>
                                </div>
                                <span className="font-medium text-gray-700 w-36 dark:text-gray-200">Launch</span>
                                <div
                                    className="flex-1 p-4 bg-gray-200 text-center text-gray-700 dark:text-gray-200 dark:bg-bodybg/80">
                                    <span>{viewData?.milestoneLaunch}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-[60%] flex flex-col border-l border-gray-400 my-6">

                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                        <div></div>
                        <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => setShow(false)}>
                            <i className="ri-close-line w-5 h-5 text-gray-500"></i>
                        </button>
                    </div>

                    <div className="flex border-b border-gray-400">
                        <button
                            className={`px-4 py-3 flex items-center gap-2 ${
                                activeTab === "updates" ? "border-b-2 border-gray-800" : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab("updates")}
                        >
                            <i className="ri-home-6-line"></i>
                            <span>Discussions</span>
                        </button>
                        <button
                            className={`px-4 py-3 flex items-center gap-2 ${
                                activeTab === "Attachments files" ? "border-b-2 border-gray-800" : "text-gray-500"
                            }`}
                            onClick={() => setActiveTab("Attachments files")}
                        >
                            <i className="bi bi-file-earmark-post"></i>
                            <span>Attachment Files</span>
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto">
                        {activeTab === "updates" && (
                            <Discussion
                                isHeader={false}
                                storeEndPoint={`/pms/tasks/${viewData?.id}/discussion/`}
                                getEndPoint={`/pms/tasks/${viewData?.id}/discussions/`}
                                users={viewData?.users}
                            />
                        )}

                        {activeTab === "Attachments files" && (
                            <div className="h-full bg-gray-50 rounded-lg overflow-hidden">
                                {attachments?.length === 0 ? (
                                    <div
                                        className="flex flex-col items-center justify-center h-[calc(100%-60px)] bg-gray-50 rounded-lg overflow-hidden p-8">
                                        <img
                                            src="https://cdn.monday.com/images/files-gallery/empty-state-v2.svg"
                                            alt="No files"
                                            className="w-48 h-auto mb-6"
                                        />
                                        <p className="font-bold text-gray-700">There is No File Available</p>
                                    </div>
                                ) : (
                                    <div className="p-4">

                                        <div className="space-y-3">
                                            {attachments.map((attachment) => (
                                                <div
                                                    key={attachment.id}
                                                    className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-all"
                                                >
                                                    {/* Left: use your generateFile() to render either an <img> or <audio> etc. */}
                                                    <div className="flex-shrink-0">
                                                        {/*
         generateFile() returns a string of HTML (an <img> or <audio> tag).
         We inject it here with dangerouslySetInnerHTML.
      */}
                                                        <div
                                                            className="w-12 h-12 flex items-center justify-center"
                                                            dangerouslySetInnerHTML={{ __html: generateFile(attachment) }}
                                                        />
                                                    </div>

                                                    {/* Middle: name + meta */}
                                                    <div className="flex-1 min-w-0 px-4">
                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                            {attachment.file_name}
                                                            {attachment.file_extension && `.${attachment.file_extension}`}
                                                        </p>
                                                        <div className="text-xs text-gray-400 mt-1">
                                                            <span>{formatFileSize(attachment.file_size)}</span>
                                                            <span className="mx-1">•</span>
                                                            <span>{formatDate(attachment.created_at)}</span>
                                                        </div>
                                                    </div>

                                                    {/* Right: actions */}
                                                    <div className="flex items-center space-x-2">
                                                        <a
                                                            href={attachment.file_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                                                            title="View / Download"
                                                        >
                                                            <i className="ri-eye-line" />
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}


                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
