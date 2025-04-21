import React from 'react';
import {getExcerptFromText, toTitleCase} from "@helpers/formatters.js";
import {formatDate} from "@helpers/dateTime.js";
import {getBadgeClasses, getStatusClasses} from "@helpers/badges.js";
import ProgressBar from "@components/ProgressBar.jsx";
import Discussion from "@components/Discussion.jsx";
import AvatarList from "@components/AvatarList.jsx";
import TaskDetailRow from "@modules/project-management/components/task/TaskDetailRow.jsx";
import TaskDeadLineItem from "@modules/project-management/components/task/TaskDeadLineItem.jsx";
import {Link} from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import Tooltip from "@components/Tooltip.jsx";
import {generateFile} from "@helpers/media.js";

const TaskDetailModal = ({ task, isLoading, closeModal }) => {
    const formatFileSize = (bytes) => {
        if (!bytes) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    return (
        <div
            id="taskDetailModal"
            data-hs-overlay-keyboard="false"
            className="hs-overlay ti-modal hidden [--overlay-backdrop:static] backdrop-blur-[0.08rem] bg-gray-900 bg-opacity-50 dark:bg-opacity-80 parent-modal">
            <div
                className="hs-overlay-open:mt-7 ti-modal-box mt-0 ease-out w-[90%] !max-w-[1200px] h-[94vh]">
                <div className="max-h-full overflow-hidden ti-modal-content">
                    <div className="ti-modal-body">
                        {isLoading ? (
                            <LoadingSpinner/>
                        ) : (
                            <>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-6">
                                        <div className="border-r border-gray-300 dark:bg-bodybg pr-4">
                                            <div className="px-4 pb-6">
                                                <Tooltip
                                                    id={`task-name-tooltip-${task.id}`}
                                                    tooltipContent={`${task.name}`}>
                                                    <h3 style={{fontFamily: 'fantasy'}}>{getExcerptFromText(task.name, 40)}</h3>

                                                </Tooltip>
                                                <div className="text-sm font-medium mt-2" >
                                                    in
                                                    <i className="ri-arrow-right-s-line justify-center mx-2 "></i>
                                                    <Tooltip
                                                        id={`task-milestone-tooltip-${task.id}`}
                                                        tooltipContent={`${task?.milestone?.name}`}>
                                                        {getExcerptFromText(task?.milestone?.name, 30)}
                                                    </Tooltip>

                                                    <i className="ri-arrow-right-s-line justify-center mx-2 "></i>
                                                    <span className="font-semibold text-primary">
                                                    <Tooltip
                                                        id={`task-project-tooltip-${task.id}`}
                                                        tooltipContent={`${task?.project?.name}`}>
                                                         {getExcerptFromText(task?.project?.name, 30)}
                                                </Tooltip></span> Project
                                                </div>
                                            </div>
                                            <PerfectScrollbar
                                                className='max-h-[calc(100vh-10rem)] ps--active-y'
                                            >
                                                <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium">

                                                    <TaskDetailRow
                                                        icon='bx bx-text'
                                                        title='Name'
                                                        children={getExcerptFromText(task.name, 30)}
                                                        alignCenter={false}
                                                    />

                                                    <TaskDetailRow
                                                        icon='bi bi-app-indicator '
                                                        title='Priority'
                                                        bodyClasses={getStatusClasses(task.priority)}
                                                        children={toTitleCase(task.priority)}
                                                    />

                                                    <TaskDetailRow
                                                        icon='bi bi-person'
                                                        title='Person'
                                                        bodyClasses='!p-1'
                                                    >
                                                        <AvatarList users={task.users} max={4}/>
                                                    </TaskDetailRow>

                                                    <TaskDetailRow
                                                        icon='bi bi-people'
                                                        title='Team'
                                                    >
                                                        {(
                                                            task?.teams?.map(team => (
                                                                <span
                                                                    key={team.id}>{toTitleCase(team.name)}</span>
                                                            ))
                                                        )}
                                                    </TaskDetailRow>

                                                    <TaskDetailRow
                                                        icon='bi bi-calendar2-event'
                                                        title='Started Date'
                                                        children={formatDate(task.started_at)}
                                                    />

                                                    <TaskDetailRow
                                                        icon='bi bi-clipboard2-pulse'
                                                        title='Aging'
                                                        children={`${task?.aging} Days`}
                                                    />

                                                    <TaskDetailRow
                                                        icon='bi bi-calendar-x'
                                                        title='Deadline'
                                                    >
                                                        <TaskDeadLineItem task={task}/>
                                                    </TaskDetailRow>

                                                    <TaskDetailRow
                                                        icon='bi bi-calendar2-check'
                                                        title='Completion Date'
                                                        children={formatDate(task.completed_at)}
                                                    />

                                                    <TaskDetailRow
                                                        icon='ri-line-chart-line '
                                                        title='Status'
                                                        bodyClasses={getBadgeClasses(task.status, '', false)}
                                                        children={toTitleCase(task.status)}
                                                    />

                                                    <TaskDetailRow
                                                        icon=' bi bi-check2-circle'
                                                        title='Completion Timeline'
                                                        children={task.completion_timeline}
                                                    />

                                                    <TaskDetailRow
                                                        icon='bi bi-people'
                                                        title='Timeline Group'
                                                        children={task.time_line_group}
                                                    />

                                                    <TaskDetailRow
                                                        icon='bi bi-tropical-storm'
                                                        title='Progress'
                                                    >
                                                        <div className='flex items-center'>
                                                            <ProgressBar
                                                                value={task.progress}
                                                                barColor='!bg-success'
                                                                withStatus={false}/>
                                                        </div>
                                                    </TaskDetailRow>

                                                    <TaskDetailRow
                                                        icon='bi bi-layout-wtf'
                                                        title='Launch'
                                                        children={task.milestoneLaunch}
                                                    />
                                                </div>
                                            </PerfectScrollbar>
                                        </div>
                                    </div>
                                    <div className="col-span-6">
                                        <div className='text-end'>
                                            <button type="button" className="hs-dropdown-toggle ti-modal-close-btn"
                                                    onClick={closeModal}>
                                                <span className="sr-only">Close</span>
                                                <svg className="w-3.5 h-3.5" width="8" height="8" viewBox="0 0 8 8"
                                                     fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M0.258206 1.00652C0.351976 0.912791 0.479126 0.860131 0.611706 0.860131C0.744296 0.860131 0.871447 0.912791 0.965207 1.00652L3.61171 3.65302L6.25822 1.00652C6.30432 0.958771 6.35952 0.920671 6.42052 0.894471C6.48152 0.868271 6.54712 0.854471 6.61352 0.853901C6.67992 0.853321 6.74572 0.865971 6.80722 0.891111C6.86862 0.916251 6.92442 0.953381 6.97142 1.00032C7.01832 1.04727 7.05552 1.1031 7.08062 1.16454C7.10572 1.22599 7.11842 1.29183 7.11782 1.35822C7.11722 1.42461 7.10342 1.49022 7.07722 1.55122C7.05102 1.61222 7.01292 1.6674 6.96522 1.71352L4.31871 4.36002L6.96522 7.00648C7.05632 7.10078 7.10672 7.22708 7.10552 7.35818C7.10442 7.48928 7.05182 7.61468 6.95912 7.70738C6.86642 7.80018 6.74102 7.85268 6.60992 7.85388C6.47882 7.85498 6.35252 7.80458 6.25822 7.71348L3.61171 5.06702L0.965207 7.71348C0.870907 7.80458 0.744606 7.85498 0.613506 7.85388C0.482406 7.85268 0.357007 7.80018 0.264297 7.70738C0.171597 7.61468 0.119017 7.48928 0.117877 7.35818C0.116737 7.22708 0.167126 7.10078 0.258206 7.00648L2.90471 4.36002L0.258206 1.71352C0.164476 1.61976 0.111816 1.4926 0.111816 1.36002C0.111816 1.22744 0.164476 1.10028 0.258206 1.00652Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="sm:border-b-2 border-gray-200 dark:border-white/10">
                                            <nav className="-mb-0.5 sm:flex sm:space-x-6 rtl:space-x-reverse">
                                                <Link
                                                    className="w-full sm:w-auto hs-tab-active:font-semibold hs-tab-active:border-primary hs-tab-active:text-primary py-4 px-1 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap text-defaulttextcolor dark:text-[#8c9097] dark:text-white/50 hover:text-primary active"
                                                    to="#" id="discussion-item" data-hs-tab="#discussion"
                                                    aria-controls="discussion">
                                                    <i className="bi bi-chat-dots text-lg"></i>
                                                    Discussion
                                                </Link>
                                                <Link
                                                    className="w-full sm:w-auto hs-tab-active:font-semibold hs-tab-active:border-primary hs-tab-active:text-primary py-4 px-1 inline-flex items-center gap-2 border-b-[3px] border-transparent text-sm whitespace-nowrap text-defaulttextcolor dark:text-[#8c9097] dark:text-white/50 hover:text-primary"
                                                    to="#" id="attachment-item" data-hs-tab="#attachment"
                                                    aria-controls="attachment">
                                                    <i className="ri-attachment-2 text-lg"></i>
                                                    Attachments
                                                </Link>
                                            </nav>
                                        </div>

                                        <div className="mt-3">
                                            <div id="discussion" role="tabpanel"
                                                 aria-labelledby="discussion-item">
                                                <Discussion
                                                    needHeader={false}
                                                    storeEndPoint={`/pms/tasks/${task?.id}/discussion/`}
                                                    getEndPoint={`/pms/tasks/${task?.id}/discussions/`}
                                                    users={task?.users}
                                                    maxHeight='max-h-[calc(100vh-35rem)] '
                                                />
                                            </div>
                                            <div id="attachment" className="hidden" role="tabpanel"
                                                 aria-labelledby="attachment-item">
                                                <div className="h-full bg-gray-50 rounded-lg overflow-hidden">
                                                    {task.attachments.length === 0 ? (
                                                        <div
                                                            className="flex flex-col items-center justify-center h-[calc(100%-60px)] rounded-lg overflow-hidden p-8">
                                                            <img
                                                                src="https://cdn.monday.com/images/files-gallery/empty-state-v2.svg"
                                                                alt="No files"
                                                                className="w-48 h-auto mb-6"
                                                            />
                                                            <p className="font-bold text-gray-700">There is No File
                                                                Available</p>
                                                        </div>
                                                    ) : (
                                                        <div className="p-4">

                                                            <div className="space-y-3">
                                                                <PerfectScrollbar
                                                                    className='max-h-[calc(100vh-15rem)] ps--active-y'
                                                                >
                                                                    {task.attachments.map((attachment) => (
                                                                    <div
                                                                        key={attachment.id}
                                                                        className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-all mb-4"
                                                                    >
                                                                        <div className="flex-shrink-0">
                                                                            <div
                                                                                className="w-12 h-12 flex items-center justify-center"
                                                                                dangerouslySetInnerHTML={{__html: generateFile(attachment)}}
                                                                            />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0 px-4">
                                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                                {attachment.file_name}
                                                                                {attachment.file_extension && `.${attachment.file_extension}`}
                                                                            </p>
                                                                            <div className="text-xs text-gray-400 mt-1">
                                                                                <span>{formatFileSize(attachment.file_size)}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center space-x-2">
                                                                            <a
                                                                                href={attachment.file_url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="p-1 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100"
                                                                                title="View / Download"
                                                                            >
                                                                                <i className="ri-eye-line"/>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                </PerfectScrollbar>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;
