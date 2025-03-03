import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import {getStatusClasses} from "@helpers/badges.js";
import useFilters from "@hooks/useFilters.js";
import {formatDate} from "@helpers/dateTime.js";
import AvatarList from "@components/AvatarList.jsx";
import ProgressBar from "@components/ProgressBar.jsx";
import Tooltip from "@components/Tooltip.jsx";
import TaskListFilter from "@modules/project-management/components/task/TaskListFilter.jsx";

const TaskList = () => {
    const {
        control,
        handleSubmit,
        errors,
        getFilters,
        resetFilters,
    } = useFilters(
        useMemo(
            () => ({
                initialFilters: [
                    { name: "workspaces" },
                    { name: "teams" },
                    { name: "status" },
                    { name: "tags" },
                    { name: "deadline_from" },
                    { name: "deadline_to" },
                    { name: "launch" },
                    { name: "is_ecom" }
                ],
            }),
            []
        )
    );

    const [filters, setFilters] = useState(getFilters());

    const onSubmit = useCallback((formData) => {
        setFilters(formData);
    }, []);

    const onClear = useCallback(() => {
        resetFilters();
        setFilters(getFilters());
    }, [resetFilters, getFilters]);

    const columns = [
        {
            Header: 'Workspace',
            accessor: 'workspace.name',
            disableSortBy: true,
            Cell: ({ value }) => {
                return <span className="badge badge-md !rounded-full bg-primary/10 text-primary"> {value ?? 'N/A'}</span>
            },
        },
        {
            Header: "Project", accessor: "project.name", disableSortBy: true,
            Cell: ({row}) => {
                const project = row.original.project;
                return (
                    <Tooltip
                        id={`project-tooltip-${project.id}`}
                        tooltipContent={`Click To View Project: ${project.name}`}
                    >
                        <Link
                            to={`/module/projects/detail/${project.id}`}
                            className='text-[0.80rem] text-[#323338]'
                            >
                            {project.name}
                        </Link>
                    </Tooltip>
                )
            },
        },
        { Header: "Milestone", accessor: "milestone.name", disableSortBy: true,
            Cell: ({value}) => (
                <p className='text-[0.80rem] text-[#323338]'>{value}</p>
            )
        },
        { Header: "Task", accessor: "name",
            Cell: ({row}) => {
                const task = row.original;
                return (
                    <Tooltip
                        id={`project-tooltip-${task.id}`}
                        tooltipContent={`Click To View Task: ${task.name}`}
                    >
                        <Link
                            to={`/module/tasks/detail/${task.id}`}>
                            {task.name}
                        </Link>
                    </Tooltip>
                )
            },
        },
        {
            Header: 'Teams',
            accessor: 'teams',
            disableSortBy: true,
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
        },
        {
            Header: "Status",
            accessor: "status",
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
        },
        { Header: "Completion Timeline", accessor: "status_completion_timeline", disableSortBy: true, },
        { Header: "Timeline Group", accessor: "timeline_groups", disableSortBy: true, },
        { Header: "Launch", accessor: "milestone.ended_at", disableSortBy: true,
            Cell: ({value}) => (
                formatDate(value, "MMM dd, yyyy")
            )
        },
        { Header: "E-com Deliverable", accessor: "is_ecom",
            Cell: ({value}) => (value ? 'Yes': 'No')
        },
        {
            Header: 'Progress',
            accessor: 'progress',
            disableSortBy: true,
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <TaskListFilter control={control} errors={errors} clearFilter={onClear} />
            </form>
            <DataTable
                columns={columns}
                title="Tasks"
                apiUrl="/pms/tasks/datatable/"
                filter={filters}
                needHeader={false}
            />
        </>
    );
};

export default TaskList;
