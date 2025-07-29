import React from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
import { formatDate } from "@helpers/dateTime.js";

const CustomerAssistCasesDatatable = ({ isActive }) => {
    if (!isActive) {
        return null
    }
    const columns = [
        {
            Header: "Case Number",
            accessor: "case_number",
            Cell: ({ row }) => {
                const value = row.original.case_number;
                return value ? (
                    <div className="flex items-center space-x-2 text-secondary">
                        <i className="ri-hashtag"></i>
                        <span>{toTitleCase(value)}</span>
                    </div>
                ) : <span className="text-gray-400">-</span>;
            },
        },
        {
            Header: "Customer Name",
            accessor: "customer_name",
            Cell: ({ row }) => {
                const value = row.original.customer_name;
                return value ? (
                    <div className="flex items-center space-x-2">
                        <i className="ri-user-line"></i>
                        <span>{value}</span>
                    </div>
                ) : <span className="text-gray-400">-</span>;
            },
        },
        {
            Header: "Email",
            accessor: "email",
            Cell: ({ row }) => {
                const value = row.original.email;
                return value ? (
                    <div className="flex items-center space-x-2">
                        <i className="ri-mail-line"></i>
                        <span>{value}</span>
                    </div>
                ) : <span className="text-gray-400">-</span>;
            },
        },
        {
            Header: "Phone",
            accessor: "phone",
            Cell: ({ row }) => {
                const value = row.original.phone;
                return value ? (
                    <div className="flex items-center space-x-2">
                        <i className="ri-phone-line"></i>
                        <span>{value}</span>
                    </div>
                ) : <span className="text-gray-400">-</span>;
            },
        },
        {
            Header: "Status",
            accessor: "case_status",
            Cell: ({ row }) => {
                const value = row.original.case_status;
                return value ? (
                    <div className="flex items-center space-x-2">
                        <i className="ri-information-line text-primary"></i>
                        <span className="badge badge-md !rounded-full bg-primary/10 text-primary">
            {toTitleCase(value)}
          </span>
                    </div>
                ) : <span className="text-gray-400">-</span>;
            },
        },
        {
            Header: "Priority",
            accessor: "priority",
            Cell: ({ row }) => {
                const value = row.original.priority;
                return value ? (
                    <div className="flex items-center space-x-2">
                        <i className="ri-alert-line"></i>
                        <span className={getBadgeClasses(value)}>
            {toTitleCase(value)}
          </span>
                    </div>
                ) : <span className="text-gray-400">-</span>;
            },
        },
        {
            Header: "Origin",
            accessor: "origin",
            Cell: ({ row }) => {
                const value = row.original.origin;
                return value ? (
                    <div className="flex items-center space-x-2 text-primary">
                        <i className="ri-map-pin-line"></i>
                        <span>{toTitleCase(value)}</span>
                    </div>
                ) : <span className="text-gray-400">-</span>;
            },
        },
        {
            Header: "Type",
            accessor: "type",
            Cell: ({ row }) => {
                const value = row.original.type;
                return value ? (
                    <div className="flex items-center space-x-2">
                        <i className="ri-file-list-line"></i>
                        <span>{toTitleCase(value)}</span>
                    </div>
                ) : <span className="text-gray-400">-</span>;
            },
        },
        {
            Header: "Reason",
            accessor: "reason",
            Cell: ({ row }) => {
                const value = row.original.reason;
                return value ? (
                    <div className="flex items-center space-x-2">
                        <i className="ri-question-answer-line"></i>
                        <span>{toTitleCase(value)}</span>
                    </div>
                ) : <span className="text-gray-400">-</span>;
            },
        },
        {
            Header: "Subject",
            accessor: "subject",
            Cell: ({ row }) => {
                const value = row.original.subject;
                return value ? (
                    <div className="flex items-center space-x-2">
                        <i className="ri-article-line"></i>
                        <span>{value}</span>
                    </div>
                ) : <span className="text-gray-400">-</span>;
            },
        },
        {
            Header: "CC Resolution",
            accessor: "cc_resolution",
            Cell: ({ row }) => {
                const value = row.original.cc_resolution;
                return value ? (
                    <div className="flex items-center space-x-2 line-clamp-2">
                        <i className="ri-checkbox-circle-line"></i>
                        <span>{value}</span>
                    </div>
                ) : <span className="text-gray-400">-</span>;
            },
        },
        {
            Header: "Created At",
            accessor: "case_created_date",
            Cell: ({ value }) => (
                value ? (
                    <div className="flex items-center space-x-2">
                        <i className="ri-time-line"></i>
                        <span>{formatDate(value, "MMM dd, yyyy - HH:mm")}</span>
                    </div>
                ) : <span className="text-gray-400">-</span>
            ),
            filterable: true,
            filterType: "datetime",
        },
        {
            Header: "Closed",
            accessor: "is_closed",
            Cell: ({ row }) => {
                const isClosed = row.original.is_closed;
                const label = isClosed ? "Closed" : "Open";
                const icon = isClosed ? "ri-lock-line" : "ri-lock-unlock-line";
                return (
                    <div className="flex items-center space-x-2">
                        <i className={icon}></i>
                        <span className={getBadgeClasses(label)}>{label}</span>
                    </div>
                );
            },
        },
        {
            Header: "Closed At",
            accessor: "case_close_date",
            Cell: ({ value }) => (
                value ? (
                    <div className="flex items-center space-x-2">
                        <i className="ri-calendar-check-line"></i>
                        <span>{formatDate(value, "MMM dd, yyyy - HH:mm")}</span>
                    </div>
                ) : <span className="text-gray-400">-</span>
            ),
        },
    ];


    return (
        <>
            <DataTable
                columns={columns}
                title="Customer Assist All Cases"
                apiUrl={`/customer-assist/cases/datatable/`}
                enableAdvancedFilters={false}
            />
        </>
    );
};

export default CustomerAssistCasesDatatable;
