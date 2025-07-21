import DataTable from "@components/DataTable.jsx";
import React from "react";
import ProgressBar from "@components/ProgressBar.jsx";
import {getBadgeClasses} from "@helpers/badges.js";
import {toTitleCase} from "@helpers/formatters.js";
import {formatDate} from "@helpers/dateTime.js";
import AvatarList from "@components/AvatarList.jsx";
import {Link} from "react-router-dom";
import Tooltip from "@components/Tooltip.jsx";
import {priorities, projectStatuses} from "@modules/project-management/services/projectService.js";

const ProjectTableCard = ({filters}) => {
    const columns = [
        {
            Header: 'Project',
            accessor: 'name',
            excelAlignment: 'left',
            filterType: 'text',
            filterable: true,
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
            Header: 'Status',
            accessor: 'status',
            filterType: 'select',
            filterable: true,
            filterOptions: projectStatuses,
            excelStyleMap: {
                not_started:    { label: 'NOT STARTED',     bgColor: '#F57C00', textColor: '#FFFFFF' }, // orange
                active:         { label: 'ACTIVE',          bgColor: '#9E9E9E', textColor: '#FFFFFF' }, // gray
                completed:      { label: 'COMPLETED',       bgColor: '#2E7D32', textColor: '#FFFFFF' }, // green
                on_hold:        { label: 'ON HOLD',         bgColor: '#C2185B', textColor: '#FFFFFF' }, // pink
                archived:       { label: 'ARCHIVED',        bgColor: '#D32F2F', textColor: '#FFFFFF' }, // red
            },
            headerClassName: '!text-center',
            Cell: ({cell}) => {
                return toTitleCase(cell.value);
            },
            getCellProps: (cellInfo) => {
                return {
                    className: `!text-center ${getBadgeClasses(cellInfo.value, '', false)}`,
                }
            },
        },
        {
            Header: 'Estimated Time',
            accessor: 'estimated_time',
        },
        {
            Header: 'Start Date',
            accessor: 'started_at',
            filterType: 'datetime',
            filterable: true,
            excelColumnType: 'date',
            excelFormat: "MMM dd, yyyy",
            Cell: ({ value }) => {
                return (
                    formatDate(value)
                );
            },
        },
        {
            Header: 'End Date',
            accessor: 'ended_at',
            filterType: 'datetime',
            filterable: true,
            excelColumnType: 'date',
            excelFormat: "MMM dd, yyyy",
            Cell: ({ value }) => {
                return (
                    formatDate(value)
                );
            },
        },
        {
            Header: 'Progress',
            accessor: 'progress',
            disableSortBy: true,
            excelColumnType:'number',
            Cell: ({ value }) => {
                return (
                    <ProgressBar
                        value={value}
                    />
                );
            },
        },
        {
            Header: 'Team',
            accessor: 'users',
            disableSortBy: true,
            filterType: 'text',
            filterable: true,
            filterKey: 'users__full_name',
            Cell: ({value}) => {
                return (
                    <AvatarList users={value} />
                );
            },
        },
        {
            Header: 'Priority',
            accessor: 'priority',
            filterType: 'select',
            filterable: true,
            filterOptions: priorities,
            excelStyleMap: {
                low: {label: 'LOW', bgColor: '#9E9E9E', textColor: '#FFFFFF'},
                high: {label: 'HIGH', bgColor: '#D32F2F', textColor: '#FFFFFF'},
                medium: {label: 'MEDIUM', bgColor: '#0097A7', textColor: '#FFFFFF'},
            },
            headerClassName: '!text-center',
            Cell: ({cell}) => {
                return toTitleCase(cell.value);
            },
            getCellProps: (cellInfo) => {
                return {
                    className: `!text-center ${getBadgeClasses(cellInfo.value, '', false)}`,
                }
            },
        }
    ];
    const buttons = (
            <div className="flex space-x-2">
                <Link to="/module/projects/create"  className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]">
                    <i className="ri-add-line font-semibold align-middle"></i> Add New Project
                </Link>
            </div>
    );
    return (
        <div className="xl:col-span-12 col-span-12">
            <DataTable
                columns={columns}
                title="All Projects"
                apiUrl={`/dashboard/pms/datatable/`}
                filter={filters}
                enableAdvancedFilters={true}
                buttons={buttons}
            />
        </div>
    )
}

export default ProjectTableCard