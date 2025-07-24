import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import {format} from "date-fns";
import {Link, useNavigate} from "react-router-dom";
import {getBadgeClasses} from "@helpers/badges.js";
import {toTitleCase} from "@helpers/formatters.js";
import Tooltip from "@components/Tooltip.jsx";
import HighlightCell from "@modules/sr-management/component/HighlightCell.jsx";

const TaskCompletedTable = () => {
    const navigate = useNavigate();

    const columns = [
        {
            Header: "Action",
            accessor: "action",
            Cell: ({row}) => {
                const {id} = row.original;
                return (
                    <div className="flex space-x-2">
                        <Link
                            to={`/module/srm/taskcompletedform/${id}`}
                            aria-label={`Task-Completed/${id}`}
                            rel="noopener noreferrer"
                            className="ti-btn ti-btn-success ti-btn-sm"
                        >
                            <i className="ri-eye-line"></i>
                        </Link>
                    </div>
                );
            },
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
            Cell: ({value}) =>
                value ? (
                    <span className="bg-info/10 text-info px-2 py-1 rounded-md">
            {format(new Date(value), "MMM d, yyyy, h:mm a")}
          </span>
                ) : (
                    <span className="text-gray-500">N/A</span>
                ),
        },
        {
            Header: "Requester",
            accessor: "reporter",
            Cell: ({value}) =>
                value ? value : <span className="text-gray-500">N/A</span>,
        },
        {
            Header: "Priority",
            accessor: "priority",
            Cell: ({row}) => {
                const {sr_tasks} = row.original;
                if (Array.isArray(sr_tasks) && sr_tasks.length > 0) {
                    return (
                        <div className="flex flex-wrap gap-1">
                            {sr_tasks.map((task, index) => (
                                <span key={index} className={getBadgeClasses(task.priority)}>
                  {toTitleCase(task.priority)}
                </span>
                            ))}
                        </div>
                    );
                }
                return <span className="text-gray-500">No Tasks</span>;
            },
        },
        {
            Header: "Assignee",
            accessor: "sr_tasks",
            Cell: ({value}) => {
                if (Array.isArray(value) && value.length > 0) {
                    const allAssignees = value.flatMap(task => task.assignees.map(a => a.name));
                    const uniqueAssignees = [...new Set(allAssignees)];
                    return (
                        <div className="flex flex-wrap gap-1">
                            {uniqueAssignees.map((assignee, index) => (
                                <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                  {assignee}
                </span>
                            ))}
                        </div>
                    );
                }
                return <span className="text-gray-500">No Assignees</span>;
            },
        },
        {
            Header: "Status",
            accessor: "status",
            Cell: ({row}) => {
                const {sr_tasks} = row.original;
                if (Array.isArray(sr_tasks) && sr_tasks.length > 0) {
                    return sr_tasks.map(task => task.status).join(", ");
                }
                return "No Tasks";
            },
        },
    ];

    return (
        <DataTable
            columns={columns}
            apiUrl="service-request/completed/sr/"
            title="Task Completed"
        />
    );
};

export default TaskCompletedTable;
