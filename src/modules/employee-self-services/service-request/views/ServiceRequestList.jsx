import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import { SELF_SERVICES_ROUTES } from "@modules/employee-self-services/routes.js";
import { submitServiceRequest } from "@modules/employee-self-services/services/service-request/ServiceRequestServices.js";
import { formatDate } from "@helpers/dateTime.js";

const ServiceRequestList = () => {
    const navigate = useNavigate();
    const [submittedRows, setSubmittedRows] = useState({});

    const handleEdit = (id) => {
        navigate(`/module/ess/service-request/edit/${id}`);
    };

    const handleView = (id) => {
        navigate(`/module/ess/service-request/detail/${id}`);
    };

    const handleSubmit = async (id) => {
        try {
            await submitServiceRequest(id);
            setSubmittedRows((prev) => ({ ...prev, [id]: true })); 
        } catch (error) {
            console.error("Error submitting request:", error.message);
        }
    };

    const columns = [
        { Header: 'SR #', accessor: 'sr_number' },
        { Header: 'SR Type', accessor: 'sr_type.name' },
        { Header: 'Location', accessor: 'location.name' },
        {
            Header: "Request Title",
            accessor: "request_title",
            Cell: ({ value }) => 
              value ? (value.length > 20 ? `${value.slice(0, 20)}...` : value) : "-"
          },
        { Header: 'Requester', accessor: 'reporter' },
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
                return "UnAssigned";
            },
        },
        { Header: 'Status', accessor: 'status' },
        {
            Header: 'Created at',
            accessor: row => formatDate(row.created_at) 
        },
        {
            Header: 'Actions',
            Cell: ({ row }) => {
                const { id, is_submitted } = row.original;

                return (
                    <div className="flex space-x-2">
                        {!is_submitted && !submittedRows[id] && (
                            <button onClick={() => handleEdit(id)} className="ti-btn ti-btn-primary ti-btn-sm">
                                <i className="ri-edit-line"></i>
                            </button>
                        )}

                        {(is_submitted || submittedRows[id]) && (
                            <button onClick={() => handleView(id)} className="ti-btn ti-btn-info ti-btn-sm">
                                <i className="ri-eye-line"></i>
                            </button>
                        )}

                        {(!is_submitted && !submittedRows[id]) && (
                            <button onClick={() => handleSubmit(id)} className="ti-btn ti-btn-primary ti-btn-sm">
                                <i className="ri-share-forward-line"></i>
                            </button>
                        )}
                    </div>
                );
            }
        },
    ];

    const buttons = (
        <div className="flex space-x-2">
            <Link to={SELF_SERVICES_ROUTES.SERVICES.CREATE.path} className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]">
                <i className="ri-add-line font-semibold align-middle"></i> Create Service
            </Link>
        </div>
    );

    return (
        <>
            <PageHeader currentpage="Employee Self Services" mainpage="Employee Services" />
            <DataTable
                columns={columns}
                title="Self Services"
                apiUrl="/service-request/datatable"
                buttons={buttons}
            />
        </>
    );
}

export default ServiceRequestList;
