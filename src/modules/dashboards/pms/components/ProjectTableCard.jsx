import DataTable from "@components/DataTable.jsx";
import React from "react";
import ProgressBar from "@components/ProgressBar.jsx";
import {getBadgeClasses} from "@helpers/badges.js";
import {toTitleCase} from "@helpers/formatters.js";
import {formatDate} from "@helpers/dateTime.js";
import AvatarList from "@components/AvatarList.jsx";
import {Link} from "react-router-dom";
import Tooltip from "@components/Tooltip.jsx";

const ProjectTableCard = ({filters}) => {
    const columns = [
        { Header: "Project No", accessor: "project_no" },
        {
            Header: 'Title',
            accessor: 'name',
            Cell: ({row}) => {
                const project = row.original;
                return <div>
                        <Tooltip
                            id={`project-tooltip-${project.id}`}
                            text={`(${project.project_no}) ${project.name}`}
                            tooltipContent={`Click To View Project: ${project.name}`}
                        >
                            <Link
                                to={`/module/projects/detail/${project.id}`}
                                className="font-semibold text-[.875rem] block text-truncate project-list-title">
                                {project.name}
                            </Link>
                        </Tooltip>
                        <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">Total <strong className="text-defaulttextcolor">{project.completed_tasks}/{project.total_tasks}</strong> tasks completed</p>
                        </div>;
            },
        },
        {
            Header: 'Assigned To',
            accessor: 'users',
            disableSortBy: true,
            Cell: ({value}) => {
                return (
                    <AvatarList users={value} />
                );
            },
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ value }) => {
                return (
                    <span className={getBadgeClasses(value)}>
                        {toTitleCase(value)}
                    </span>
                );
            },
        },
        {
            Header: 'Priority',
            accessor: 'priority',
            Cell: ({ value }) => {
                return (
                    <span className={getBadgeClasses(value)}>
                        {toTitleCase(value)}
                    </span>
                );
            },
        },
        {
            Header: 'Progress',
            accessor: 'completed_tasks',
            disableSortBy: true,
            Cell: ({ row }) => {
                const project = row.original;
                return (
                    <ProgressBar
                        total={project.total_tasks}
                        completed={project.completed_tasks}
                    />
                );
            },
        },
        {
            Header: 'Due Date',
            accessor: 'ended_at',
            Cell: ({ value }) => {
                return (
                    formatDate(value)
                );
            },
        },
    ];
    return (
        <div className="xl:col-span-12 col-span-12">
            <DataTable
                columns={columns}
                title="All Projects"
                apiUrl={`/dashboard/pms/datatable/`}
                filter={filters}
            />
        </div>
    )
}

export default ProjectTableCard