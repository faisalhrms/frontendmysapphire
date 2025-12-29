// src/modules/requisition/pages/RequisitionList.jsx
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
import { Shield } from "lucide-react";
import IconPageHeader from "../../layouts/includes/IconPageHeader.jsx";
import { REQUISITION_ROUTES } from "../routes.js";

const RequisitionList = ({ externalFilters = [] }) => {
    const tableRef = useRef(null);

    const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "—");

    const statusOptions = [
        "draft",
        "under_approval",
        "approved",
        "rejected",
        "published",
        "closed",
    ].map((s) => ({ label: toTitleCase(s.replaceAll("_", " ")), value: s }));

    const reqTypeOptions = ["new", "replacement", "additional"].map((t) => ({
        label: toTitleCase(t),
        value: t,
    }));

    // helpers
    const buildPublicUrl = (row) =>
        row.public_form_url ||
        (row.public_form_slug
            ? `${window.location.origin}/careers/apply/${row.public_form_slug}`
            : null);

    const copyToClipboard = async (text) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            alert("Public link copied to clipboard.");
        } catch {
            // fallback
            const ta = document.createElement("textarea");
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
            alert("Public link copied to clipboard.");
        }
    };

    const columns = [
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => {
                const status = row.original.status;
                const blockedStatuses = ["under_approval", "approved", "published", "closed"];
                const isBlocked = blockedStatuses.includes(status);

                return (
                    <div className="flex gap-2">
                        {!isBlocked ? (
                            <Link to={`/module/requisition/edit/${row.original.id}`}>
                                <button className="ti-btn ti-btn-primary ti-btn-sm" title="Edit">
                                    <i className="ri-edit-line" />
                                </button>
                            </Link>
                        ) : (
                            <button
                                className="ti-btn ti-btn-primary ti-btn-sm opacity-40 cursor-not-allowed"
                                disabled
                                title={`Edit disabled for status: ${status.replaceAll("_", " ")}`}
                            >
                                <i className="ri-edit-line" />
                            </button>
                        )}

                        <Link to={`/module/requisition/detail/${row.original.id}`}>
                            <button className="ti-btn ti-btn-info ti-btn-sm" title="View">
                                <i className="ri-eye-line" />
                            </button>
                        </Link>
                        <Link to={`/module/requisition/${row.original.id}/applicants`}>
                        <button
                                className="ti-btn ti-btn-success-gradient ti-btn-sm"
                                title="View Applicants"
                            >
                                <i className="bi bi-people"></i>
                            </button>
                        </Link>
                    </div>
                );
            },
        },

        // NEW: Public column (copy + open)
        {
            Header: "Public",
            accessor: "public_form_url",
            disableSortBy: true,
            Cell: ({ row }) => {
                const url = buildPublicUrl(row.original);
                const disabled = !url;

                return (
                    <div className="flex gap-2">
                        <button
                            className={`ti-btn ti-btn-secondary ti-btn-sm ${
                                disabled ? "opacity-40 cursor-not-allowed" : ""
                            }`}
                            disabled={disabled}
                            onClick={() => url && copyToClipboard(url)}
                            title={disabled ? "No public URL available" : "Copy public link"}
                        >
                            <i className="ri-links-line" />
                        </button>

                        <a
                            href={url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => disabled && e.preventDefault()}
                            title={disabled ? "No public URL available" : "Open public page"}
                        >
                            <button
                                className={`ti-btn ti-btn-success ti-btn-sm ${
                                    disabled ? "opacity-40 cursor-not-allowed" : ""
                                }`}
                                disabled={disabled}
                            >
                                <i className="ri-external-link-line" />
                            </button>
                        </a>
                    </div>
                );
            },
        },

        {
            Header: "Req No",
            accessor: "req_no",
            filterable: true,
            filterType: "text",
            filterKey: "req_no",
            Cell: ({ value }) => value || "—",
        },
        {
            Header: "Title",
            accessor: "job_description.position_title",
            filterable: true,
            filterType: "text",
            filterKey: "job_description__position_title",
            Cell: ({ row }) => row.original.job_description?.position_title || "—",
        },
        {
            Header: "Designation",
            accessor: "designation",
            filterable: true,
            filterType: "text",
            Cell: ({ row }) => {
                const d = row.original.designation;
                if (!d) return "—";
                if (typeof d === "object") return d.name || "—";
                return `#${d}`;
            },
        },
        {
            Header: "Openings",
            accessor: "openings",
            filterable: true,
            filterType: "number",
        },
        {
            Header: "Type",
            accessor: "req_type",
            filterable: true,
            filterType: "select",
            filterOptions: reqTypeOptions,
            Cell: ({ value }) => toTitleCase(String(value || "").replaceAll("_", " ")),
        },
        {
            Header: "Status",
            accessor: "status",
            filterable: true,
            filterType: "select",
            filterOptions: statusOptions,
            Cell: ({ row }) => (
                <span className={getBadgeClasses(row.original.status)}>
          {toTitleCase(row.original.status.replaceAll("_", " "))}
        </span>
            ),
        },
        {
            Header: "Current Approver",
            accessor: "current_approver.full_name",
            filterable: true,
            filterType: "text",
            filterKey: "current_approver__full_name",
            Cell: ({ row }) =>
                row.original.current_approver?.full_name ||
                row.original.current_approver?.email ||
                "—",
        },
        {
            Header: "Company",
            accessor: "company.name",
            filterable: true,
            filterType: "text",
            filterKey: "company__name",
            Cell: ({ row }) => row.original.company?.name || "—",
        },
        {
            Header: "Created On",
            accessor: "created_at",
            filterable: true,
            filterType: "date",
            filterKey: "created_at",
            Cell: ({ value }) => formatDate(value),
        },
    ];

    const buttons = (
        <div className="grid grid-cols-1">
            <Link
                to={REQUISITION_ROUTES.REQUISITION.ADD.path}
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle" /> Add Requisition
            </Link>
        </div>
    );

    return (
        <>
            <IconPageHeader
                heading="Job Requisitions"
                description="Manage and review organizational policies, their visibility, and related documents."
                icon={Shield}
            />
            <DataTable
                ref={tableRef}
                columns={columns}
                title="Requisitions"
                apiUrl={`/requisition/datatable/`}
                buttons={buttons}
                enableAdvancedFilters={true}
                externalFilters={externalFilters}
                hiddenParameters={["tab"]}
            />
        </>
    );
};

export default RequisitionList;
