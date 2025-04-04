import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import { useForm, Controller } from "react-hook-form";
import FormSelect from "@components/form/FormSelect.jsx";
import FormCheckbox from "@components/form/FormCheckbox.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { emailHost } from "@modules/user/services/userService.js";  // Assuming email host comes from this service
import { formatOptions, toTitleCase } from "@helpers/formatters.js";

const UserManagementList = (props) => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const statusFilter = params.get("status") || ""; // Example of using search parameters for filters

    // Setting up columns
    const columns = [
        { Header: "Full Name", accessor: "user.full_name" },
        { Header: "Email", accessor: "user.email" },
        {
            Header: "Email Host",
            accessor: "email_host",
            Cell: ({ value }) => value === null ? "N/A" : value ? "Yes" : "No",
        },
        {
            Header: "ERP User",
            accessor: "erp_user",
            Cell: ({ value }) => value === null ? "N/A" : value ? "Yes" : "No",
        },
        {
            Header: "One Drive",
            accessor: "one_drive",
            Cell: ({ value }) => value === null ? "N/A" : value ? "Yes" : "No",
        },
        {
            Header: "MS Team",
            accessor: "ms_team",
            Cell: ({ value }) => value === null ? "N/A" : value ? "Yes" : "No",
        },
        {
            Header: "Subscriptions",
            accessor: "subscriptions",
            Cell: ({ value }) => {
                if (value.length === 0) {
                    return "None"; // Handle empty subscriptions
                }
                return (
                    <span className="space-x-1 rtl:space-x-reverse">
                        {value.map((sub, index) => (
                            <span key={index} className="badge bg-primary/10 text-primary">
                                {toTitleCase(sub.name)} {/* Display each subscription's name */}
                            </span>
                        ))}
                    </span>
                );
            },
        },
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    {row.original.id ? (
                        <>
                            {/* Edit Button for existing users */}
                            <Link to={`/module/user-management/edit/${row.original.id}`}>
                                <button className="ti-btn ti-btn-primary ti-btn-sm">
                                    <i className="ri-edit-line"></i>
                                </button>
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* Create Button for new users, passing user.id to the create URL */}
                            <Link to={`/module/user-management/create/${row.original.user.id}`}>
                                <button className="ti-btn ti-btn-success ti-btn-sm">
                                    <i className="ri-add-line"></i>
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            ),
        },
    ];

    // Editable state for the list
    const [isEditable, setIsEditable] = useState(false);

    // Initialize the form for the inputs (Email Host, ERP User, etc.)
    const { control, handleSubmit } = useForm();

    const handleSaveList = (data) => {
        // Handle saving the updated data (this could be an API call to save the changes)
        console.log("Saved Data:", data);
        setIsEditable(false); // Close the editable mode after saving
    };

    return (
        <>
            <PageHeader currentpage="User Management" mainpage="User Management" />

            <DataTable
                columns={columns}
                title="User Management"
                apiUrl={`/employee-details/list/?status=${statusFilter}`} // Example API call with filter
            />

        </>
    );
};

export default UserManagementList;
