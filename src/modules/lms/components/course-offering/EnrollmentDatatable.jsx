import React, { useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import { COURSE_OFFERING_ROUTES } from "@modules/lms/routes.js";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { Users } from "lucide-react";


const Badge = ({ ok, children }) => (
    <span
        className={[
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            ok ? "bg-success/10 text-success" : "bg-danger/10 text-danger",
        ].join(" ")}
    >
    {children}
  </span>
);

const formatDateOnly = (value) => {
    if (!value) return "—";
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const formatDuration = (secs) => {
    const s = Number(secs ?? 0);
    if (!Number.isFinite(s) || s <= 0) return "0s";
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const r = Math.floor(s % 60);
    if (h > 0) return `${h}h ${m}m ${r}s`;
    if (m > 0) return `${m}m ${r}s`;
    return `${r}s`;
};

export default function EnrollmentDatatable({ externalFilters = [] }) {
    const tableRef = useRef(null);
    const [searchParams] = useSearchParams();
    const offeringId = searchParams.get("offering_id");

    const apiUrl = useMemo(() => {
        const base = "http://127.0.0.1:8000/api";
        return offeringId
            ? `${base}/lms/course-enrollments/datatable?offering_id=${offeringId}`
            : `${base}/lms/course-enrollments/datatable`;
    }, [offeringId]);

    const columns = useMemo(
        () => [
            { Header: "ID", accessor: "id", width: 80 },

            {
                Header: "Offering",
                accessor: "offering.id",
                Cell: ({ value, row }) => value ?? row.original?.offering?.id ?? "—",
                width: 90,
            },
            {
                Header: "Company",
                accessor: "offering.company.name",
                Cell: ({ value, row }) => value ?? row.original?.offering?.company?.name ?? "—",
            },
            {
                Header: "Course",
                accessor: "offering.course.title",
                Cell: ({ value, row }) => value ?? row.original?.offering?.course?.title ?? "—",
            },

            {
                accessor: "offering.is_published",
                Header: "Published",
                Cell: ({ row }) => (
                    <span
                        className={`px-2 py-1 rounded text-xs ${
                            row.original?.offering?.is_published
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-700"
                        }`}
                    >
            {row.original?.offering?.is_published ? "Yes" : "No"}
          </span>
                ),
                width: 120,
            },
            {
                accessor: "offering.allow_self_enroll",
                Header: "Self Enroll",
                Cell: ({ row }) => (
                    <span
                        className={`px-2 py-1 rounded text-xs ${
                            row.original?.offering?.allow_self_enroll
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-700"
                        }`}
                    >
            {row.original?.offering?.allow_self_enroll ? "Allowed" : "No"}
          </span>
                ),
                width: 140,
            },

            { Header: "Start", accessor: "offering.started_at", Cell: ({ value }) => formatDateOnly(value) },
            { Header: "End", accessor: "offering.ended_at", Cell: ({ value }) => formatDateOnly(value) },

            {
                Header: "User",
                accessor: "user.full_name",
                Cell: ({ value, row }) => value ?? row.original?.user?.full_name ?? "—",
            },
            {
                Header: "Email",
                accessor: "user.email",
                Cell: ({ value, row }) => value ?? row.original?.user?.email ?? "—",
            },

            { Header: "Source", accessor: "source", width: 110, Cell: ({ value }) => value ?? "—" },

            {
                Header: "Status",
                accessor: "status",
                width: 140,
                Cell: ({ value }) => {
                    const v = String(value ?? "").toLowerCase();
                    const ok = v === "completed" || v === "passed";
                    return <Badge ok={ok}>{value ?? "—"}</Badge>;
                },
            },
            {
                Header: "Score",
                accessor: "score",
                width: 100,
                Cell: ({ value }) => (value === null || value === undefined ? "—" : value),
            },
            {
                Header: "Time",
                accessor: "total_time_seconds",
                width: 120,
                Cell: ({ value }) => formatDuration(value),
            },
            {
                Header: "Completed",
                accessor: "completed_at",
                width: 140,
                Cell: ({ value }) => formatDateOnly(value),
            },
        ],
        []
    );

    const buttons = (
        <div className="flex gap-2">
            <Link
                to={COURSE_OFFERING_ROUTES.list}
                className="ti-btn ti-btn-secondary !py-1 !px-2 !text-[0.75rem]"
            >
                ← Back to Offerings
            </Link>
        </div>
    );

    return (
        <>
        <IconPageHeader
            heading={offeringId ? `Course Enrollments (Offering #${offeringId})` : "Course Enrollments"}
            description="View learners enrolled in this offering and track progress."
            icon={Users}
        />
        <div className="p-4">
            <DataTable
                ref={tableRef}
                apiUrl={apiUrl}
                columns={columns}
                externalFilters={externalFilters}
                title={offeringId ? `Course Enrollments (Offering #${offeringId})` : "Course Enrollments"}
                buttons={buttons}
            />
        </div>
        </>
    );
}
