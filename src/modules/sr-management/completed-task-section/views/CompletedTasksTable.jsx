import React from "react";
import DataTable from "@components/DataTable.jsx";
import {format} from "date-fns";
import {useNavigate} from "react-router-dom";

const TaskCompletedTable = () => {

    const navigate = useNavigate();

    const onViewTask = (id) => {
        navigate(`/module/srm/taskcompletedform/${id}`);
    };

    const columns = [
        {
            Header: "Action",
            accessor: "action",
            Cell: ({row}) => {
                const {id} = row.original;
                return (
                    <div className="flex space-x-2">
                        <button onClick={() => onViewTask(id)} className="ti-btn ti-btn-success ti-btn-sm">
                            <i className="ri-eye-line"></i>
                        </button>
                    </div>
                );
            },
        },
        {Header: "SR #", accessor: "sr_number"},
        {Header: "Task Type", accessor: "sr_type.name"},
        {Header: "Requester Location", accessor: "location.name"},
        {
            Header: "Request Title",
            accessor: "request_title",
            Cell: ({value}) =>
                value ? (value.length > 20 ? `${value.slice(0, 20)}...` : value) : "-"
        },

        {
            Header: "SR Time", accessor: "created_at",
            Cell: ({value}) => value ? format(new Date(value), "yyyy-MM-dd hh:mm a") : "",
        },
        {Header: "Requester", accessor: "reporter"},
        {
            Header: "Assignee",
            accessor: "sr_tasks",
            Cell: ({value}) => {
                if (Array.isArray(value) && value.length > 0) {
                    const allAssignees = value.flatMap(task =>
                        task.assignees.map(a => a.name)
                    );
                    const uniqueAssignees = [...new Set(allAssignees)];
                    return uniqueAssignees.join(", ");
                }
                return "No Assignees";
            },
        },
        {
            Header: "Status",
            Cell: ({row}) => {
                const {sr_tasks} = row.original;
                if (Array.isArray(sr_tasks) && sr_tasks.length > 0) {
                    return sr_tasks.map((task) => task.status).join(", ");
                }
                return "No Tasks";
            },
        },


    ];

    return <DataTable columns={columns} apiUrl="service-request/completed/sr/" title="Task Completed"/>;
};

export default TaskCompletedTable;
