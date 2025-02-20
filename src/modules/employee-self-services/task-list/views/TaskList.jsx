import React, { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import {getBadgeClasses, getStatusClasses} from "@helpers/badges.js";
// import TaskListFilter from "@modules/tasks/components/TaskListFilter.jsx";
import useFilters from "@hooks/useFilters.js";
import {formatDate} from "@helpers/dateTime.js";
import AvatarList from "@components/AvatarList.jsx";
import ProgressBar from "@components/ProgressBar.jsx";
import Tooltip from "@components/Tooltip.jsx";

const TaskList = () => {
    // const {
    //     control,
    //     handleSubmit,
    //     errors,
    //     getFilters,
    //     resetFilters,
    // } = useFilters(
    //     useMemo(
    //         () => ({
    //             initialFilters: [
    //                 { name: "project_name" },
    //                 { name: "milestone_name" },
    //                 { name: "status" },
    //                 { name: "timeline_groups" },
    //             ],
    //         }),
    //         []
    //     )
    // );

    // const [filters, setFilters] = useState(getFilters());

    // const onSubmit = useCallback((formData) => {
    //     setFilters(formData);
    // }, []);
    //
    // const onClear = useCallback(() => {
    //     resetFilters();
    //     setFilters(getFilters());
    // }, [resetFilters, getFilters]);

    const columns = [
        { Header: "Project", accessor: "project.name", disableSortBy: true,
            Cell: ({row}) => {
                const project = row.original.project;
                return (
                    <Tooltip
                        id={`project-tooltip-${project.id}`}
                        tooltipContent={`Click To View Project: ${project.name}`}
                    >
                        <Link
                            to={`/module/projects/detail/${project.id}`}
                            >
                            {project.name}
                        </Link>
                    </Tooltip>
                )
            },
        },
        { Header: "Milestone", accessor: "milestone.name", disableSortBy: true, },
        { Header: "Task", accessor: "name",
            Cell: ({row}) => {
                const task = row.original;
                return (
                    <Tooltip
                        id={`project-tooltip-${task.id}`}
                        tooltipContent={`Click To View Task: ${task.name}`}
                    >
                        <Link
                            to={`/module/tasks/detail/${task.id}`}
                            className="font-semibold text-[.875rem]">
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
                    <AvatarList users={users} />
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
        { Header: "Status Timeline", accessor: "status_completion_timeline", disableSortBy: true, },
        { Header: "Timeline Group", accessor: "timeline_groups", disableSortBy: true, },
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
                            <span key={index} className="badge bg-primary/10 text-primary">
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
            <PageHeader currentpage="Tasks" mainpage="Tasks" />
            {/*<form onSubmit={handleSubmit(onSubmit)}>*/}
            {/*    <TaskListFilter control={control} errors={errors} onClear={onClear} />*/}
            {/*</form>*/}
            <DataTable
                columns={columns}
                title="Tasks"
                apiUrl="/pms/tasks/datatable/"
                // filter={filters}
            />
        </>
    );
};

export default TaskList;
