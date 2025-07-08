import React from "react";
import { Link } from "react-router-dom";
import DataTable from "@components/DataTable.jsx";
import { POLICIES_ROUTES } from "@modules/policies/routes.js";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import InfoAlert from "../../../InfoAlert.jsx";

const SelfPolicies = () => {

    const renderIcon = (attachment) => {
        const { file_type } = attachment;
        if (file_type.startsWith("image")) return <i className="ri-image-line" />;
        if (file_type.startsWith("video")) return <i className="ri-video-line" />;
        if (file_type.startsWith("audio")) return <i className="ri-user-voice-line" />;
        return <i className="ti ti-file-text" />;
    };

    const columns = [
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
    ];

    return (
        <>
            <PageHeader currentpage="My Policies" mainpage="Policies" activepage="My Policies" />
            <InfoAlert />
            <DataTable
                columns={columns}
                title="My Policies"
                apiUrl="/policies/ess/datatable/"
                enableAdvancedFilters={true}
            />
        </>
    );
};

export default SelfPolicies;
