// src/modules/CustomerAssist/components/CustomerAssistList.jsx

import React from "react";
import { Link, useLocation } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import { CUSTOMER_ASSIST_ROUTES } from "@modules/CustomerAssist/routes.js";
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
import { formatDate } from "@helpers/dateTime.js";
import { useHasPermission } from "@modules/auth/hooks/authHooks.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const CustomerAssistList = ({ isLoading,url,isActive }) => {
    if (!isActive) {
        return null
    }
    if (isLoading) {
        return <LoadingSpinner />;
    }
    const columns = [
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => {
                const id = row.original.id;
                const canEdit = useHasPermission("customer_assist.change_customerassistcase");
                const canView = useHasPermission("customer_assist.view_customerassistcase");
                return (
                    <div className="flex space-x-2">
                        {canEdit && (
                            <Link to={CUSTOMER_ASSIST_ROUTES.EDIT.path.replace(":id", id)}>
                                <button className="ti-btn ti-btn-primary ti-btn-sm">
                                    <i className="ri-edit-line" />
                                </button>
                            </Link>
                        )}
                        {canView && (
                            <Link to={CUSTOMER_ASSIST_ROUTES.DETAIL.path.replace(":id", id)}>
                                <button className="ti-btn ti-btn-info ti-btn-sm">
                                    <i className="ri-eye-line" />
                                </button>
                            </Link>
                        )}
                    </div>
                );
            },
        },
        {
            Header: "Case Number",
            accessor: "case_number",
            filterable: true,
            filterType: "text",
        },
        {
            Header: "Customer Name",
            accessor: "customer_name",
            filterable: true,
            filterType: "text",
        },
        {
            Header: "Email",
            accessor: "email",
            filterable: true,
            filterType: "text",
        },
        {
            Header: "Phone",
            accessor: "phone",
            filterable: true,
            filterType: "text",
        },
        {
            Header: "Status",
            accessor: "case_status", // or "status" if your API returns status field
            filterable: true,
            filterType: "text",
            // If you know status options, you can provide filterOptions here:
            // filterOptions: [
            //   { label: "New", value: "New" },
            //   { label: "Open", value: "Open" },
            //   ...
            // ],
            Cell: ({ row }) => {
                const value = row.original.case_status || row.original.status;
                // render badge; getBadgeClasses should accept the raw value and return a CSS class
                return (
                    <span className={getBadgeClasses(value)}>
            {toTitleCase(value)}
          </span>
                );
            },
        },
        {
            Header: "Priority",
            accessor: "priority",
            filterable: true,
            filterType: "text",
            Cell: ({ row }) => <span>{toTitleCase(row.original.priority)}</span>,
        },
        {
            Header: "Origin",
            accessor: "origin",
            filterable: true,
            filterType: "text",
            Cell: ({ row }) => <span>{toTitleCase(row.original.origin)}</span>,
        },
        {
            Header: "Type",
            accessor: "type",
            filterable: true,
            filterType: "text",
            Cell: ({ row }) => <span>{toTitleCase(row.original.type)}</span>,
        },
        {
            Header: "Created At",
            accessor: "created_at",
            Cell: ({ value }) =>
                formatDate(value, "MMM dd, yyyy - HH:mm"),
            filterable: true,
            filterType: "datetime",
        },
    ];


    return (
        <>
            <DataTable
                columns={columns}
                title="Customer Assist Resolved Cases"
                apiUrl={url}
                enableAdvancedFilters={true}
            />
        </>
    );
};

export default CustomerAssistList;
