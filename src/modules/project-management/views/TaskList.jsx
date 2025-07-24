import React from "react";
import { Link } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import {getBadgeClasses, getStatusClasses} from "@helpers/badges.js";
import {formatDate} from "@helpers/dateTime.js";
import AvatarList from "@components/AvatarList.jsx";
import ProgressBar from "@components/ProgressBar.jsx";
import Tooltip from "@components/Tooltip.jsx";
import {useTaskDetailModal} from "@modules/project-management/hooks/taskHooks.js";
import TaskDetailModalPortal from "@modules/project-management/components/task/TaskDetailModalPortal.jsx";
import {taskStatuses} from "@modules/project-management/services/taskService.js";
import TaskStatusDropdown from "@modules/project-management/components/dropdowns/TaskStatusDropdown.jsx";
import {ListTodo} from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {priorities} from "@modules/project-management/services/projectService.js";
import TaskDeadLineItem from "@modules/project-management/components/task/TaskDeadLineItem.jsx";

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
            filterType: 'text',
            filterable: true,
            filterKey: 'milestone__project__workspace__name',
            excelAlignment: 'left',
            Cell: ({cell}) => {
                return cell.value
            },
            getCellProps: (cellInfo) => {
                return {
                    className: `!text-center bg-secondary/10 text-secondary`,
                }
            },
        },
        {
            Header: "Project",
            accessor: "project.name",
            disableSortBy: true,
            filterType: 'text',
            filterable: true,
            filterKey: 'milestone__project__name',
            excelAlignment: 'left',
            getCellProps: (cellInfo) => {
                return {
                    className: `!text-left`,
                }
            },
            Cell: ({row}) => {
                const project = row.original.project;
                return (
                    <Tooltip
                        id={`project-tooltip-${project.id}`}
                        tooltipContent={project.name}
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
            excelAlignment: 'left',
            Cell: ({value}) => (
                <p className=''>{value.length>20?value.slice(0,20)+"...":value}</p>
            ),
            getCellProps: (cellInfo) => {
                return {
                    className: `!text-left`,
                }
            },
        },
        {
            Header: "Task",
            accessor: "name",
            filterType: 'text',
            filterable: true,
            excelAlignment: 'left',
            Cell: ({row}) => {
                const task = row.original;
                return (
                    <Tooltip
                        id={`task-tooltip-${task.id}`}
                        tooltipContent={task.name}
                    >
                        <Link
                            onClick={() => {openTaskDetailModal(task.id)}}
                            to="#">

                            {task.name.length>20?task.name.slice(0, 20) + "...":task.name}
                        </Link>
                    </Tooltip>
                )
            },
            getCellProps: (cellInfo) => {
                return {
                    className: `!text-left`,
                }
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
                            toTitleCase(team.name)
                        ))
                    )}
                </div>
            ),
            getCellProps: (cellInfo) => {
                return {
                    className: `!text-center bg-primary/10 text-primary`,
                }
            },
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
            Header: "Assigned Date",
            accessor: "started_at",
            Cell: ({ value }) => formatDate(value, "MMM dd, yyyy - HH:mm"),
            filterType: 'datetime',
            filterable: true,
            excelColumnType: 'date',
            excelFormat: "MMM dd, yyyy",
        },
        {
            Header: "Deadline",
            accessor: "ended_at",
            filterType: 'datetime',
            filterable: true,
            excelColumnType: 'date',
            excelFormat: "MMM dd, yyyy",
            Cell: ({ row }) => (
                <TaskDeadLineItem task={row.original} />
            ),
        },
        {
            Header: "Status",
            accessor: "status",
            filterType: 'select',
            filterable: true,
            filterOptions: taskStatuses,
            excelStyleMap: {
                open:           { label: 'OPEN',            bgColor: '#1976D2', textColor: '#FFFFFF' }, // blue
                not_started:    { label: 'NOT STARTED',     bgColor: '#F57C00', textColor: '#FFFFFF' }, // orange
                in_progress:    { label: 'IN PROGRESS',     bgColor: '#9E9E9E', textColor: '#FFFFFF' }, // gray
                half_completed: { label: 'HALF COMPLETED',  bgColor: '#388E3C', textColor: '#FFFFFF' }, // dark green
                near_completion:{ label: 'NEAR COMPLETION', bgColor: '#0097A7', textColor: '#FFFFFF' }, // cyan-ish
                completed:      { label: 'COMPLETED',       bgColor: '#2E7D32', textColor: '#FFFFFF' }, // green
                reopened:       { label: 'REOPENED',        bgColor: '#7B1FA2', textColor: '#FFFFFF' }, // purple
                on_hold:        { label: 'ON HOLD',         bgColor: '#C2185B', textColor: '#FFFFFF' }, // pink
                cancelled:      { label: 'CANCELLED',       bgColor: '#D32F2F', textColor: '#FFFFFF' }, // red
            },
            Cell: ({ row }) => (
                <div className={`min-w-[200px]`}>
                    {(() => {
                        return (row.original.status !== 'under_approval') ? (
                            <TaskStatusDropdown status={row.original.status} taskId={row.original.id} />
                        ) : (
                            <p className={getStatusClasses(row.original.status)}>{toTitleCase(row.original.status)}</p>
                        );
                    })()}
                </div>
            ),
        },
        {
            Header: "Completion Date",
            accessor: "completed_at",
            Cell: ({value}) => (value ? formatDate(value, "MMM dd, yyyy") : ""),
            filterType: 'datetime',
            filterable: true,
            excelColumnType: 'date',
            excelFormat: "MMM dd, yyyy",
        },
        {
            Header: "Completion Timeline",
            accessor: "completion_timeline",
            disableSortBy: true,
            filterable: false,
            excelColumnType: 'number',
            getCellProps: (cellInfo) => {
                const value = cellInfo.value;
                if (value == null) {
                    return {};
                }
                return {
                    className: value < 1 ? 'bg-success text-white' : 'bg-red text-white',
                };
            }

        },
        {Header: "Aging", accessor: "aging", disableSortBy: true, filterable: false, excelColumnType: 'number'},
        {
            Header: "Timeline Group",
            accessor: "time_line_group",
            disableSortBy: true,
            filterable: false,
            getCellProps: (cellInfo) => {
                const value = cellInfo.value;
                let bgClass = "bg-info";
                if (value.includes("Delayed")) {
                    bgClass = "bg-red";
                } else {
                    switch (value) {
                        case "Advance":
                            bgClass = "bg-success";
                            break;
                        case "On Time":
                            bgClass = "bg-green";
                            break;
                        case "Between 1 – 5 days":
                            bgClass = "bg-yellow";
                            break;
                        case "Between 6 – 16 days":
                            bgClass = "bg-orange";
                            break;
                        case "More than 16 days":
                            bgClass = "bg-danger";
                            break;
                    }}

                return {
                    className: `text-white ${bgClass}`,
                };
            },
        },
        {
            Header: "Launch/Milestone Deadline",
            accessor: "milestone.ended_at",
            disableSortBy: true,
            filterType: 'date',
            filterable: true,
            filterKey: 'milestone__ended_at',
            excelColumnType: 'date',
            excelFormat: "MMM dd, yyyy",
            Cell: ({value}) => (
                formatDate(value, "MMM dd, yyyy")
            )
        },
        { Header: "E-com Deliverable",
            accessor: "is_ecom",
            filterType: 'boolean',
            filterable: true,
            Cell: ({value}) => (value ? 'Yes': 'No'),
            getCellProps: (cellInfo) => {
                return {
                    className: cellInfo.value ? 'bg-success text-white' : 'bg-info text-white',
                }
            },
        },
        {
            Header: 'Progress',
            accessor: 'progress',
            disableSortBy: true,
            filterable: false,
            excelColumnType:'number',
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
                    className: `${getBadgeClasses(cellInfo.value, '', false)}`,
                }
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
            <IconPageHeader
                heading="Task List"
                description="View and manage all project tasks in a tabular view"
                icon={ListTodo}
            />
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
                    viewOnly={false}
                />
            }
            <div id="modal-root"></div>
        </>
    );
};

export default TaskList;
