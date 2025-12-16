import React from "react";
import { useParams, Link } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { Users } from "lucide-react";
import Avatar from "@components/Avatar.jsx";

const RequisitionApplicantsList = () => {
    const { id } = useParams(); // requisitionId

    const columns = [
        // Actions column (eye for detail)
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => {
                const appId = row?.original?.id;
                return (
                    <div className="flex justify-center space-x-2">
                        <Link to={`/module/requisitions/${id}/applicants/${appId}`}>
                            <button
                                className="ti-btn ti-btn-secondary ti-btn-sm"
                                title="View Applicant"
                            >
                                <i className="ri-eye-line" />
                            </button>
                        </Link>
                    </div>
                );
            },
        },

        {
            Header: "Applicant",
            accessor: "full_name",
            filterType: "text",
            filterable: true,
            // map to an actual DB field so backend doesn't try to filter on "full_name"
            filterKey: "first_name",
            getCellProps: () => ({ className: "!text-left" }),
            Cell: ({ row }) => {
                const r = row?.original || {};
                const full =
                    r.full_name ||
                    [r.first_name, r.last_name].filter(Boolean).join(" ") ||
                    "N/A";

                return (
                    <div className="flex items-center">
                        <Avatar
                            avatar={r.avatar ? r.avatar : null}
                            full_name={full}
                            size="md"
                            parentClasses="bg-primary/10 !fill-primary"
                        />
                        <div className="ms-2">
                            <p className="font-semibold mb-0 flex items-center">{full}</p>
                            <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                                {r.email || "—"}
                            </p>
                        </div>
                    </div>
                );
            },
        },

        { Header: "Mobile", accessor: "mobile_number", filterType: "text", filterable: true },
        { Header: "CNIC", accessor: "cnic_number", filterType: "text", filterable: true },
        { Header: "City", accessor: "city", filterType: "text", filterable: true },
        {
            Header: "Current Title",
            accessor: "current_job_title",
            filterType: "text",
            filterable: true,
            Cell: ({ value }) => value || "—",
        },
        {
            Header: "Experience (yrs)",
            accessor: "total_experience_years",
            filterType: "text",
            filterable: true,
            Cell: ({ value }) => (value ?? value === 0 ? value : "—"),
        },
        {
            Header: "Expected Salary",
            accessor: "expected_salary",
            filterType: "text",
            filterable: true,
            Cell: ({ value }) => (value !== null && value !== undefined ? value : "—"),
        },
        {
            Header: "Notice (days)",
            accessor: "notice_period_days",
            filterType: "text",
            filterable: true,
            Cell: ({ value }) => (value !== null && value !== undefined ? value : "—"),
        },
        {
            Header: "Status",
            accessor: "status",
            filterable: true,
            filterType: "select",
            filterKey: "status",
            filterOptions: [
                { value: "submitted", label: "Submitted" },
                { value: "shortlisted", label: "Shortlisted" },
                { value: "interview_scheduled", label: "Interview Scheduled" },
                { value: "interviewed", label: "Interviewed" },
                { value: "offered", label: "Offered" },
                { value: "hired", label: "Hired" },
                { value: "rejected", label: "Rejected" },
            ],
            getCellProps: (cellInfo) => {
                const val = cellInfo.value;
                const map = {
                    submitted: { bg: "bg-slate-100", text: "text-slate-700" },
                    shortlisted: { bg: "bg-indigo/10", text: "text-indigo-600" },
                    interview_scheduled: { bg: "bg-warning/10", text: "text-warning" },
                    interviewed: { bg: "bg-purple/10", text: "text-purple" },
                    offered: { bg: "bg-info/10", text: "text-info" },
                    hired: { bg: "bg-success/10", text: "text-success" },
                    rejected: { bg: "bg-danger/10", text: "text-danger" },
                };
                const sty = map[val] || { bg: "bg-light", text: "text-default" };
                return { className: `capitalize px-2 py-1 rounded ${sty.bg} ${sty.text}` };
            },
        },
        {
            Header: "Resume",
            accessor: "resume_file_url",
            disableSortBy: true,
            filterable: false,
            Cell: ({ value }) =>
                value ? (
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                    >
                        View
                    </a>
                ) : (
                    "—"
                ),
        },
        {
            Header: "Portfolio",
            accessor: "portfolio_url",
            disableSortBy: true,
            filterType: "text",
            filterable: true,
            Cell: ({ value }) =>
                value ? (
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                    >
                        Open
                    </a>
                ) : (
                    "—"
                ),
        },
        {
            Header: "Applied At",
            accessor: "created_at",
            filterType: "datetime",
            filterable: true,
        },
    ];

    return (
        <>
            <IconPageHeader
                heading="Requisition Applicants"
                description="Browse all applicants for the selected requisition."
                icon={Users}
            />
            <DataTable
                columns={columns}
                title="Applicants"
                apiUrl={`/requisitions/${id}/applicants/datatable/`}
                enableAdvancedFilters={true}
                needHeader={false}
            />
        </>
    );
};

export default RequisitionApplicantsList;
