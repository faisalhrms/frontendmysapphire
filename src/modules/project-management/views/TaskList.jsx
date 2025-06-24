import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import {getStatusClasses} from "@helpers/badges.js";
import {formatDate} from "@helpers/dateTime.js";
import AvatarList from "@components/AvatarList.jsx";
import ProgressBar from "@components/ProgressBar.jsx";
import Tooltip from "@components/Tooltip.jsx";
import {useTaskDetailModal} from "@modules/project-management/hooks/taskHooks.js";
import TaskDetailModalPortal from "@modules/project-management/components/task/TaskDetailModalPortal.jsx";
import {taskStatuses} from "@modules/project-management/services/taskService.js";

const TaskList = () => {
    const {
        openTaskDetailModal,
        closeTaskDetailModal,
        isTaskDetailModalOpen,
        isTaskDetailLoading,
        task,
    } = useTaskDetailModal()

    const columns = [
        {
            Header: 'Workspace',
            accessor: 'workspace.name',
            disableSortBy: true,
            Cell: ({ value }) => {
                return <span className="badge badge-md !rounded-full bg-primary/10 text-primary"> {value ?? 'N/A'}</span>
            },
            filterType: 'text',
            filterable: true,
            filterKey: 'milestone__project__workspace__name'
        },
        {
            Header: "Project",
            accessor: "project.name",
            disableSortBy: true,
            filterType: 'text',
            filterable: true,
            filterKey: 'milestone__project__name',
            Cell: ({row}) => {
                const project = row.original.project;
                return (
                    <Tooltip
                        id={`project-tooltip-${project.id}`}
                        tooltipContent={`Click To View Project: ${project.name}`}
                    >
                        <Link
                            to={`/module/projects/detail/${project.id}`}
                            className=''
                            >
                            {project.name.length>20?project.name.slice(0, 20) + "...":project.name}
                        </Link>
                    </Tooltip>
                )
            },
        },
        {
            Header: "Milestone",
            accessor: "milestone.name",
            disableSortBy: true,
            filterType: 'text',
            filterable: true,
            filterKey: 'milestone__name',
            Cell: ({value}) => (
                <p className=''>{value.length>20?value.slice(0,20)+"...":value}</p>
            )
        },
        {
            Header: "Task",
            accessor: "name",
            filterType: 'text',
            filterable: true,
            Cell: ({row}) => {
                const task = row.original;
                return (
                    <Tooltip
                        id={`project-tooltip-${task.id}`}
                        tooltipContent={`Click To View Task: ${task.name}`}
                    >
                        <Link
                            onClick={() => {openTaskDetailModal(task.id)}}
                            to="#">

                            {task.name.length>20?task.name.slice(0, 20) + "...":task.name}
                        </Link>
                    </Tooltip>
                )
            },
        },
        {
            Header: 'Teams',
            accessor: 'teams',
            disableSortBy: true,
            filterType: 'text',
            filterable: true,
            filterKey: 'teams__name',
            Cell: ({ value }) => (
                <div className="space-x-1 rtl:space-x-reverse">
                    {Array.isArray(value) && value.length > 0 && (
                        [...new Set(value)].map((team, index) => (
                            <span key={index} className="badge bg-primary/10 text-primary">
                                {toTitleCase(team.name)}
                            </span>
                        ))
                    )}
                </div>
            ),
        },
        {
            Header: 'Person',
            accessor: 'users',
            disableSortBy: true,
            filterType: 'text',
            filterable: true,
            filterKey: 'users__full_name',
            Cell: ({row}) => {
                const users = row.original.users;
                return (
                    <>
                        <AvatarList users={users} />
                    </>
                );
            },
        },
        {
            Header: "Deadline",
            accessor: "ended_at",
            Cell: ({ value }) => formatDate(value, "MMM dd, yyyy - HH:mm"),
            filterType: 'datetime',
            filterable: true,
        },
        {
            Header: "Status",
            accessor: "status",
            filterType: 'select',
            filterable: true,
            filterOptions: taskStatuses,
            Cell: ({ row }) => (
                <span className={getStatusClasses(row.original.status)}>
                {toTitleCase(row.original.status)}
            </span>
            ),
        },
        {
            Header: "Completion Date",
            accessor: "completed_at",
            Cell: ({ value }) => (value ? formatDate(value, "MMM dd, yyyy") : ""),
            filterType: 'datetime',
            filterable: true,
        },
        { Header: "Completion Timeline", accessor: "completion_timeline", disableSortBy: true, filterable: false},
        { Header: "Timeline Group", accessor: "time_line_group", disableSortBy: true, filterable: false},
        {
            Header: "Launch/Milestone Deadline",
            accessor: "milestone.ended_at",
            disableSortBy: true,
            filterType: 'date',
            filterable: true,
            filterKey: 'milestone__ended_at',
            Cell: ({value}) => (
                formatDate(value, "MMM dd, yyyy")
            )
        },
        { Header: "E-com Deliverable",
            accessor: "is_ecom",
            filterType: 'boolean',
            filterable: true,
            Cell: ({value}) => (value ? 'Yes': 'No')
        },
        {
            Header: 'Progress',
            accessor: 'progress',
            disableSortBy: true,
            filterable: false,
            Cell: ({ row }) => {
                return (
                    <ProgressBar
                        value={row.original.progress}
                        withStatus={false}
                    />
                );
            },
        },
        {
            Header: 'Tags',
            accessor: 'tags',
            filterType: 'text',
            filterable: true,
            filterKey: 'tags__name',
            Cell: ({ value }) => (
                <div className="space-x-1 rtl:space-x-reverse">
                    {Array.isArray(value) && value.length > 0 && (
                        [...new Set(value)].map((tag, index) => (
                            <span key={index} className="badge !rounded-full bg-light text-default">
                                {toTitleCase(tag.name)}
                            </span>
                        ))
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <PageHeader currentpage="Task List" activepage="Task" mainpage="Task List"/>
            <DataTable
                columns={columns}
                title="Tasks"
                apiUrl="/pms/tasks/datatable/"
                needHeader={false}
                enableAdvancedFilters={true}
            />

            {
                isTaskDetailModalOpen &&
                <TaskDetailModalPortal
                    task={task}
                    isLoading={isTaskDetailLoading}
                    closeModal={closeTaskDetailModal}
                />
            }
            <div id="modal-root"></div>
        </>
    );
};

export default TaskList;
