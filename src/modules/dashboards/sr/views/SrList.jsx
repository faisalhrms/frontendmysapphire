import React, {useEffect, useState} from "react"
import DataTable from "@components/DataTable.jsx"
import {format} from "date-fns"
import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom"
import PageHeader from "@modules/layouts/includes/PageHeader.jsx"
import HighlightCell from "@modules/sr-management/component/HighlightCell.jsx";
import Tooltip from "@components/Tooltip.jsx";

const SrList = () => {
    const [apiUrl, setApiUrl] = useState(null)
    const {status} = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (status) {
            const paramsString = searchParams.toString()
            setApiUrl(`dashboard/status/${status}${paramsString ? `?${paramsString}` : ""}`)
        } else {
            setApiUrl(null)
        }
    }, [status, searchParams])
    const columns = [
        {
            Header: "Action",
            accessor: "action",
            Cell: ({row}) => {
                const {id} = row.original
                return (
                    <div className="flex space-x-2">
                        <Link
                            to={`/module/srm/taskgeneratedform/${id}`}
                            rel="noopener noreferrer"
                            className="ti-btn ti-btn-success ti-btn-sm"
                        >
                            <i className="ri-eye-line"></i>
                        </Link>
                    </div>
                )
            }
        },
        {
            Header: "SR #",
            accessor: "sr_number",
            Cell: ({value, row}) => (
                <HighlightCell highlight={!row.original.is_read}>
                    {value}
                </HighlightCell>
            ),
        },
        {
            Header: "Task Type",
            accessor: "sr_type.name",
            Cell: ({value, row}) => (
                <HighlightCell highlight={!row.original.is_read}>
                    {value || "N/A"}
                </HighlightCell>
            ),
        },
        {
            Header: "Requester Location",
            accessor: "location.name",
            Cell: ({value, row}) =>
                value ? (
                    <HighlightCell highlight={!row.original.is_read}>
                        {value}
                    </HighlightCell>
                ) : (
                    "N/A"
                ),
        },
         {
            Header: "Request Title",
            accessor: "request_title",
            Cell: ({value, row}) =>
                value ? (
                    <div>
                        <Tooltip
                            id={`request-tooltip-${row.index}`}
                            text={value}
                            tooltipContent={value}
                        >
                            <HighlightCell highlight={!row.original.is_read}>
                                {value.length > 25 ? `${value.slice(0, 25)}...` : value}
                            </HighlightCell>
                        </Tooltip>
                    </div>
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
      ...(status === "Completed"
        ? [
            {
              Header: "Completed At",
              accessor: "completed_at",
              Cell: ({ value }) =>
                value ? (
                  <span className="bg-success/10 text-info px-2 py-1 rounded-md">
                    {format(new Date(value), "MMM d, yyyy, h:mm a")}
                  </span>
                ) : (
                  <span className="text-gray-500">N/A</span>
                ),
            }
          ]
        : []),

        {
            Header: "Requester",
            accessor: "reporter",
            Cell: ({value}) => (
                value ? (
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-md">
                {value}
            </span>
                ) : (
                    <span className="text-gray-500">N/A</span>
                )
            ),
        },
        {
            Header: "Assignee",
            accessor: "sr_tasks",
            Cell: ({value, row}) => {
                if (Array.isArray(value) && value.length > 0) {
                    const allAssignees = value.flatMap(task => task.assignees.map(a => a.name));
                    const uniqueAssignees = [...new Set(allAssignees)];
                    return (
                        <div className="flex flex-wrap gap-1">
                            {uniqueAssignees.map((assignee, index) => (
                                <HighlightCell key={index} highlight={!row.original.is_read}>
                  <span className="bg-green/10 text-success px-2 py-1 rounded-md">
                    {assignee}
                  </span>
                                </HighlightCell>
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
                    return sr_tasks.map((task) => task.status).join(", ");
                }
                return "No Tasks";
            },
        },
    ]
    return (
        <>
            <PageHeader currentpage="SR Dashboard" activepage="Sr dashboard" mainpage={status}/>
            {apiUrl ? (
                <DataTable columns={columns} apiUrl={apiUrl} title={status}/>
            ) : (
                <p className="text-center text-gray-500">No data available</p>
            )}
        </>
    )
}

export default SrList
