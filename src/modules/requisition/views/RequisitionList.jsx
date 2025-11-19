// src/modules/requisition/pages/RequisitionList.jsx
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
import {Shield} from "lucide-react";
import IconPageHeader from "../../layouts/includes/IconPageHeader.jsx";
import {REQUISITION_ROUTES} from "../routes.js";

const RequisitionList = ({  externalFilters = [] }) => {

    const tableRef = useRef(null);

    const formatDate = (iso) => (iso ? new Date(iso).toLocaleDateString() : "—");

    // Select options for filters
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

    const columns = [
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex gap-2">
                    <Link to={`/module/requisition/edit/${row.original.id}`}>
                        <button className="ti-btn ti-btn-primary ti-btn-sm" title="Edit">
                            <i className="ri-edit-line" />
                        </button>
                    </Link>
                    <Link to={`/module/requisition/detail/${row.original.id}`}>
                        <button className="ti-btn ti-btn-info ti-btn-sm" title="View">
                            <i className="ri-eye-line" />
                        </button>
                    </Link>
                </div>
            ),
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
            // if your API later returns an object, this still works
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
