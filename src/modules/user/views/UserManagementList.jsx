import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";

const UserManagementList = (props) => {
    const { search } = useLocation();
    const params = new URLSearchParams(search);
    const statusFilter = params.get('status') || ''; // Example of using search parameters for filters

    // Setting up columns
    const columns = [

        { Header: "Full Name", accessor: "user.full_name" },
        { Header: "Email", accessor: "user.email" },
        {
            Header: "Email Host",
            accessor: "email_host",
            Cell: ({ value }) => value === null ? "N/A" : value ? "Yes" : "No"
        },
        {
            Header: "ERP User",
            accessor: "erp_user",
            Cell: ({ value }) => value === null ? "N/A" : value ? "Yes" : "No"
        },
        {
            Header: "One Drive",
            accessor: "one_drive",
            Cell: ({ value }) => value === null ? "N/A" : value ? "Yes" : "No"
        },
        {
            Header: "MS Team",
            accessor: "ms_team",
            Cell: ({ value }) => value === null ? "N/A" : value ? "Yes" : "No"
        },
        {
            Header: "Subscriptions",
            accessor: "subscriptions",
            Cell: ({ value }) => value.length === 0 ? "Null" : value
        }
    ];

    // Buttons (if needed for any specific actions like "Add User" or similar)


    return (
        <>
            <PageHeader currentpage="User Management" mainpage="User Management" />
            <DataTable
                columns={columns}
                title="User Management"
                apiUrl={`/employee-details/list?status=${statusFilter}`} // Example API call with filter

            />
        </>
    );
};

export default UserManagementList;
