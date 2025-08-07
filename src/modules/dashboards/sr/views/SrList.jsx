import React, {useEffect, useState} from "react"
import DataTable from "@components/datatable/DataTable.jsx"
import {format} from "date-fns"
import {Link, useNavigate, useParams, useSearchParams} from "react-router-dom"
import PageHeader from "@modules/layouts/includes/PageHeader.jsx"
import HighlightCell from "@modules/sr-management/component/HighlightCell.jsx"
import Tooltip from "@components/Tooltip.jsx"
import {toTitleCase} from "@helpers/formatters.js";
import {normalizeStatus} from "@modules/sr-management/services/srServices.js";
import {getBadgeClasses} from "@helpers/badges.js";

const SrList = () => {
    const [apiUrl, setApiUrl] = useState(null)
    const {status} = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (status) {
            const paramsString = searchParams.toString()
            setApiUrl(`dashboard/status/${status}/${paramsString ? `?${paramsString}` : ""}`)
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
            },
        },
        {
            Header: "SR #",
            accessor: "sr_number",
            Cell: ({value, row}) => (
                <div className="flex items-center space-x-1">
              <span className={row.original.is_read ? "" : "font-semibold"}>
                {value}
              </span>
                    {!row.original.is_read && <i className="ri-message-2-line text-danger"/>}
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
        ...(status === "Completed"
            ? [
        {
            Header: "Completed At",
            accessor: "completed_at",
            Cell: ({ value }) => (
                <div className="space-x-1 rtl:space-x-reverse">
                    {value ? format(new Date(value), "MMM d, yyyy, h:mm a") : <span className="text-gray-500">N/A</span>}
                </div>
            ),
            getCellProps: cellInfo => {
                const completed = new Date(cellInfo.value);
                const needBy = new Date(cellInfo.row.original.need_by_date);
                const isLate = completed > needBy;
                return {
                    className: `!text-center ${isLate ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`
                };
            }
        },


            ]
            : []),
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
                className: `!text-center bg-indigo/10 text-blue text-sm`
            })
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
    ]

    return (
        <>
            <PageHeader currentpage="SR Dashboard" activepage="Sr dashboard" mainpage={status}/>
            {apiUrl ? (
                <DataTable
                    columns={columns}
                    apiUrl={apiUrl}
                    title={status}
                    externalFilters={['company_id', 'store_region_id', 'city_id', 'location_id', 'department_id', 'sub_department_id', 'month', 'year_dashboard', 'status']}
                />
            ) : (
                <p className="text-center text-gray-500">No data available</p>
            )}
        </>
    )
}

export default SrList
