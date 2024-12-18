import React from "react";
import DataTable from "@components/DataTable.jsx";
import {useNavigate} from "react-router-dom";
import {format} from "date-fns";

const PendingRequestsTable = () => {

    const navigate = useNavigate();

    const onCreateTask = (id) => {
        navigate(`/module/srm/createtask/${id}`);
    };

    const columns = [
        { Header: "SR #", accessor: "sr_number" },
        { Header: "Task Type", accessor: "sr_type.name" },
        { Header: "Requester Location", accessor: "location.name" },
        { Header: "Request Title", accessor: "request_title" },
         { Header: "SR Time", accessor: "created_at",
        Cell: ({ value }) => value ? format(new Date(value), "yyyy-MM-dd hh:mm a") : "",
        },
        { Header: "Requester", accessor: "reporter" },
        { Header: "Assignee", accessor: "assignee" },
        {
            Header: "Action",
            accessor: "status",
            Cell: ({ row }) => {
                const { id } = row.original;
                return (
                    <div className="flex space-x-2">
                        <button onClick={() => onCreateTask(id)} className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-calendar-check-line"></i>
                        </button>
                        <button className="ti-btn ti-btn-danger ti-btn-sm">
                            <i className="ri-close-circle-line"></i>
                        </button>
                    </div>
                );
            },
        },
    ];

    return <DataTable columns={columns} apiUrl="service-request/pending/sr/" title="Task Pending"/>;
};

export default PendingRequestsTable;
