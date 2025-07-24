import React from "react";
import { Link } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import { formatDate } from "@helpers/dateTime.js";
import { useHasPermission } from "@modules/auth/hooks/authHooks.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import InfoAlert from "../../../InfoAlert.jsx";
import { POLICIES_ROUTES } from "@modules/policies/routes.js";

const PoliciesList = () => {

    const renderIcon = (attachment) => {
        const { file_type } = attachment;
        if (file_type.startsWith("image")) return <i className="ri-image-line" />;
        if (file_type.startsWith("video")) return <i className="ri-video-line" />;
        if (file_type.startsWith("audio")) return <i className="ri-user-voice-line" />;
        return <i className="ti ti-file-text" />;
    };

    const columns = [
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => {
                const id = row.original.id;
                const canEdit = useHasPermission("policies.change_policy");
                const canView = useHasPermission("policies.view_policy");

                return (
                    <div className="flex space-x-2">
                        {canEdit && (
                            <Link to={`/policies/edit/${id}`}>
                                <button className="ti-btn ti-btn-primary ti-btn-sm">
                                    <i className="ri-edit-line" />
                                </button>
                            </Link>
                        )}
                    </div>
                );
            },
        },
        {
            Header: "Title",
            accessor: "title",
            filterable: true,
            filterType: "text",
            Cell: ({ value }) => value || "N/A",
        },
        {
            Header: "Description",
            accessor: "description",
            filterable: true,
            filterType: "text",
            Cell: ({ value }) => value || "N/A",
        },
        {
            Header: "Visibility",
            accessor: "is_public",
            Cell: ({ value }) => {
                if (value === true) return "Public";
                if (value === false) return "Private";
                return "N/A";
            },
        },
        {
            Header: "Companies",
            accessor: "companies",
            Cell: ({ row }) => {
                const companies = row.original.companies || [];
                return companies.length > 0
                    ? companies.map((c) => toTitleCase(c.name)).join(", ")
                    : "N/A";
            },
        },
        {
            Header: "Attachments",
            accessor: "attachments",
            disableSortBy: true,
            Cell: ({ row }) => {
                const attachments = row.original.attachments || [];
                if (attachments.length === 0) return "N/A";
                return (
                    <div className="flex space-x-2">
                        {attachments.map((att, idx) => (
                            <Link
                                key={idx}
                                to={att.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`${att.file_name}.${att.file_extension}`}
                                className="text-xl hover:text-primary"
                            >
                                {renderIcon(att)}
                            </Link>
                        ))}
                    </div>
                );
            },
        },
        {
            Header: "Departments",
            accessor: "departments",
            Cell: ({ row }) => {
                const depts = row.original.departments || [];
                return depts.length > 0
                    ? depts.map((d) => toTitleCase(d.name)).join(", ")
                    : "N/A";
            },
        },
        {
            Header: "Users",
            accessor: "users",
            Cell: ({ row }) => {
                const users = row.original.users || [];
                return users.length > 0
                    ? users.map((u) => toTitleCase(u.name)).join(", ")
                    : "N/A";
            },
        },
        {
            Header: "Created By",
            accessor: "created_by",
            Cell: ({ row }) => row.original.created_by?.name || "N/A",
        },
        {
            Header: "Created At",
            accessor: "created_at",
            filterable: true,
            filterType: "datetime",
            Cell: ({ value }) =>
                value ? formatDate(value, "MMM dd, yyyy - HH:mm") : "N/A",
        },
    ];

    const buttons = (
        <div className="grid grid-cols-1 sm:grid-cols-1">
            <Link
                to={POLICIES_ROUTES.ADD.path}
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i> Add New Policy
            </Link>
        </div>
    );

    return (
        <>
            <PageHeader currentpage="Policies" mainpage="Policies List" activepage="Policies" />
            <InfoAlert />
            <DataTable
                columns={columns}
                title="Policies"
                apiUrl="/policies/datatable/"
                buttons={buttons}
                enableAdvancedFilters={true}
            />
        </>
    );
};

export default PoliciesList;
