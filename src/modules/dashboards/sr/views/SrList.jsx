import React, {useEffect, useState} from "react";
import DataTable from "@components/DataTable.jsx";
import {format} from "date-fns";
import {useNavigate, useParams} from "react-router-dom";

const SrList = () => {
    const [apiUrl, setApiUrl] = useState("-");
    const {status} = useParams();

    const navigate = useNavigate();

    const onViewTask = (id) => {
        navigate(`/module/srm/taskgeneratedform/${id}`);
    };
    useEffect(() => {
        if (status) {
            setApiUrl(`/service-requests/status/${status}`);
        }
    }, [status]);

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
                return "New";
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


    return <DataTable columns={columns} apiUrl={apiUrl} title="SR Dashboard"/>;
};

export default SrList;
