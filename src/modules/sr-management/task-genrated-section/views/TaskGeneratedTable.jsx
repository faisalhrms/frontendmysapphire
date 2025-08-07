import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import {format} from "date-fns";
import {Link} from "react-router-dom";
import {toTitleCase} from "@helpers/formatters.js";
import {getBadgeClasses} from "@helpers/badges.js";
import Tooltip from "@components/Tooltip.jsx";
import HighlightCell from "@modules/sr-management/component/HighlightCell.jsx";
import {normalizeStatus} from "@modules/sr-management/services/srServices.js";

const TaskGeneratedTable = () => {
    const columns = [
        {
            Header: "Action",
            accessor: "id",
            Cell: ({row}) => (
                <div className="flex space-x-2">
                    <Link
                        to={`/module/srm/taskgeneratedform/${row.original.id}`}
                        className="ti-btn ti-btn-info ti-btn-sm inline-flex items-center justify-center"
                    >
                        <i className="ri-eye-line"></i>
                    </Link>
                </div>
            ),
        },
        {
          Header: "SR #",
          accessor: "sr_number",
          Cell: ({ value, row }) => (
            <div className="flex items-center space-x-1">
              <span className={row.original.is_read ? "" : "font-semibold"}>
                {value}
              </span>
              {!row.original.is_read && <i className="ri-message-2-line text-danger" />}
            </div>
          ),
        },
        {
            Header: "Task Type",
            accessor: "sr_type.name",
            Cell: ({value}) => value || "N/A",
        },
        {
            Header: "Requester Location",
            accessor: "location.name",
            Cell: ({value}) => value || "N/A",
        },
        {
            Header: "Request Title",
            accessor: "request_title",
            width: 300,
            Cell: ({value, row}) =>
                value ? (
                    <Tooltip id={`request-tooltip-${row.index}`} text={value} tooltipContent={value}>
                        <HighlightCell highlight={!row.original.is_read}>
                            {value.length > 25 ? `${value.slice(0, 25)}...` : value}
                        </HighlightCell>
                    </Tooltip>
                ) : (
                    "-"
                ),
        },
        {
            Header: "SR Time",
            accessor: "created_at",
            Cell: ({ value }) => (
                <div className="space-x-1 rtl:space-x-reverse">
                    {value ? format(new Date(value), "MMM d, yyyy, h:mm a") : <span className="text-gray-500">N/A</span>}
                </div>
            ),
            getCellProps: () => ({
                className: `!text-center bg-info/10 text-info`
            })
        },
        {
            Header: "Requester",
            accessor: "reporter",
            width: 250,
            Cell: ({value}) =>
                value ? (
                    <span className="badge !rounded-full bg-light text-default">
            {value}
          </span>
                ) : (
                    <span className="text-gray-500">N/A</span>
                ),
        },
        {
            Header: 'Status',
            accessor: row => {
                const { sr_tasks } = row;
                if (Array.isArray(sr_tasks) && sr_tasks.length > 0) {
                    return sr_tasks[0].status;
                }
                return 'No Tasks';
            },
            id: 'status',
            width: 250,
            headerClassName: '!text-center',
            Cell: ({ cell }) => {
                const statusLabelMap = {
                    not_started: 'Not-Started',
                    in_progress: 'In-Progress',
                    on_hold: 'On-Hold',
                    cancelled: 'Cancelled',
                    completed: 'Completed',
                    waiting_for_pr: 'Waiting for PR',
                    waiting_for_budget: 'Waiting for Budget',
                    waiting_for_purchase: 'Waiting for Purchase',
                    waiting_for_quotation: 'Waiting for Quotation',
                    waiting_for_acknowledgement: 'Waiting for Acknowledgement',
                    waiting_for_approval: 'Waiting for Approval'
                };
                const key = normalizeStatus(cell.value);
                return statusLabelMap[key] || cell.value || 'Unknown';
            },
            getCellProps: cellInfo => {
                const key = normalizeStatus(cellInfo.value);
                return {
                    className: getBadgeClasses(key, '', false)
                };
            }
        },
        {
            Header: "Assignee",
            accessor: "sr_tasks",
            Cell: ({ value }) => (
                <div className="space-x-1 rtl:space-x-reverse">
                    {Array.isArray(value) && value.length > 0 ? (
                        [...new Set(value.flatMap(task => task.assignees.map(a => toTitleCase(a.name))))]
                            .map((assignee, index) => assignee)
                    ) : (
                        <span className="text-gray-500">No Assignees</span>
                    )}
                </div>
            ),
            getCellProps: () => ({
                className: `!text-center bg-indigo/10 text-blue`
            })
        },
        {
            Header: "Priority",
            accessor: "priority",
            Cell: ({ row }) => {
                const { sr_tasks } = row.original;
                if (Array.isArray(sr_tasks) && sr_tasks.length > 0) {
                    const priorities = sr_tasks.map(task => task.priority?.toLowerCase());
                    const uniquePriorities = [...new Set(priorities)];
                    return (
                        <div className="space-x-1 rtl:space-x-reverse">
                            {uniquePriorities.map((priority, index) => (
                                <span key={index}>
                                    {toTitleCase(priority)}
                                </span>
                            ))}
                        </div>
                    );
                }
                return <span className="text-gray-500">N/A</span>;
            },
            getCellProps: cellInfo => {
                const priority = cellInfo.row.original.sr_tasks?.[0]?.priority?.toLowerCase() || '';
                return {
                    className: getBadgeClasses(priority, '', false)
                };
            }
        },

    ];

    return (
        <DataTable
            columns={columns}
            apiUrl="/service-request/generated/sr/"
            title="Task Generated"
            externalFilters={['status']}
        />
    );
};

export default TaskGeneratedTable;
