import React from "react";
import DataTable from "@components/DataTable.jsx";
import {format} from "date-fns";
import {useNavigate} from "react-router-dom";

const TaskGeneratedTable = () => {

    const navigate = useNavigate();

    const onViewTask = (id) => {
        navigate(`/module/srm/taskgeneratedform/${id}`);
    };

    const columns = [
        {Header: "SR #", accessor: "sr_number"},
        {Header: "Task Type", accessor: "sr_type.name"},
        {Header: "Requester Location", accessor: "location.name"},
        {Header: "Request Title", accessor: "request_title"},
        {
            Header: "SR Time", accessor: "created_at",
            Cell: ({value}) => value ? format(new Date(value), "yyyy-MM-dd hh:mm a") : "",
        },
        {Header: "Requester", accessor: "reporter"},
        {Header: "Assignee", accessor: "assignee"},
        {
            Header: "Status",
            accessor: "sr_tasks",
            Cell: ({value}) => {
                if (Array.isArray(value) && value.length > 0) {
                    return value.map((task) => task.status).join(", ");
                }
                return "No Tasks";
            },
        },
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
    ];


    return <DataTable columns={columns} apiUrl="/service-requests/task-generated" title="Task Generated"/>;
};

export default TaskGeneratedTable;
