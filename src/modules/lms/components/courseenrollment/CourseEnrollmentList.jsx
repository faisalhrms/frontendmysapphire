import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import { COURSE_ENROLLMENT_ROUTES } from "@modules/lms/routes.js";

const Badge = ({ tone = "gray", children }) => {
    const cls =
        tone === "bg-success"
            ? "bg-success/10 text-success"
            : tone === "bg-info"
                ? "bg-info/10 text-info"
                : tone === "bg-warning"
                    ? "bg-warning/10 text-warning"
                    : "bg-gray-100 text-gray-700";

    return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
      {children}
    </span>
    );
};

const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : "—");

const statusTone = (s) => {
    if (s === "completed") return "bg-success";
    if (s === "in_progress") return "bg-primary";
    return "gray";
};

const sourceTone = (s) => (s === "hr" ? "bg-waring" : "gray");

export default function CourseEnrollmentList({ externalFilters = [] }) {
    const tableRef = useRef(null);
    const navigate = useNavigate();

    const columns = [
        { Header: "ID", accessor: "id", width: 80 },

        {
            Header: "Company",
            accessor: "company_name",
            Cell: ({ row }) => row?.original?.offering?.company?.name ?? "—",
        },
        {
            Header: "Course",
            accessor: "course_title",
            Cell: ({ row }) => row?.original?.offering?.course?.title ?? "—",
        },
        {
            Header: "Offering",
            accessor: "offering_id",
            Cell: ({ row }) => row?.original?.offering?.id ?? "—",
            width: 110,
        },

        {
            Header: "User",
            accessor: "user_label",
            Cell: ({ row }) => {
                const u = row?.original?.user;
                if (!u) return "—";
                return u?.name || u?.username || u?.email || `User #${u?.id ?? "—"}`;
            },
        },

        {
            Header: "Source",
            accessor: "source",
            Cell: ({ value }) => <Badge tone={sourceTone(value)}>{value ?? "—"}</Badge>,
            width: 120,
        },
        {
            Header: "Status",
            accessor: "status",
            Cell: ({ value }) => <Badge tone={statusTone(value)}>{value ?? "—"}</Badge>,
            width: 140,
        },

        {
            Header: "Completed At",
            accessor: "completed_at",
            Cell: ({ value }) => formatDate(value),
            width: 190,
        },

        { Header: "Score", accessor: "score", width: 110 },
        { Header: "Time (sec)", accessor: "total_time_seconds", width: 130 },

        {
            Header: "Actions",
            accessor: "__actions__",
            disableSortBy: true,
            width: 220,
            Cell: ({ row }) => {
                const id = row?.original?.id;
                return (
                    <div className="flex gap-2">
                        <button
                            className="ti-btn ti-btn-secondary ti-btn-sm"
                            onClick={() => navigate(COURSE_ENROLLMENT_ROUTES.view(id))}
                        >
                            <i className={"ri-eye-line"}></i>
                        </button>
                        <button
                            className="ti-btn ti-btn-primary ti-btn-sm"
                            onClick={() => navigate(COURSE_ENROLLMENT_ROUTES.edit(id))}
                        >
                            <i className={"ri-edit-line"}></i>
                        </button>
                    </div>
                );
            },
        },
    ];

    // ✅ NEW: show create button inside DataTable header (right side)
    const buttons = (
        <Link
            to={COURSE_ENROLLMENT_ROUTES.create}
            className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
        >
            + Create Enrollment
        </Link>
    );

    return (
        <div className="p-4">
            <DataTable
                ref={tableRef}
                apiUrl="/lms/course-enrollments/datatable/"
                columns={columns}
                externalFilters={externalFilters}
                title="Course Enrollments"
                buttons={buttons}
            />
        </div>
    );
}
