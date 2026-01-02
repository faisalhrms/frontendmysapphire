import React, {useRef, useMemo, useState} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import { COURSE_ENROLLMENT_ROUTES } from "@modules/lms/routes.js";
import UserWithAvatar from "@components/UserWithAvatar.jsx";

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

const sourceTone = (s) => (s === "hr" ? "bg-warning" : "gray"); // ✅ fixed typo

export default function CourseEnrollmentList({isActive = true, externalFilters = [] }) {
    if (!isActive) return null;
    const tableRef = useRef(null);
    const navigate = useNavigate();
    const { search } = useLocation();

    const [advancedFilters, setAdvancedFilters] = useState([]);

    const refreshKey = useMemo(() => new URLSearchParams(search).get("refresh") || "0", [search]);

    const columns = [
        {
            Header: "Company",
            accessor: "company_name",
            filterable: true,
            Cell: ({ row }) => row?.original?.offering?.company?.name ?? "—",
        },
        {
            Header: "Course",
            accessor: "course_title",
            filterable: true,
            Cell: ({ row }) => row?.original?.offering?.course?.title ?? "—",
        },
        {
            Header: "User",
            accessor: "user",
            filterable: true,
            Cell: ({ value }) => <UserWithAvatar user={value} />,
        },
        {
            Header: "Source",
            accessor: "source",
            filterable: true,
            Cell: ({ value }) => <Badge tone={sourceTone(value)}>{value ?? "—"}</Badge>,
            width: 120,
        },
        {
            Header: "Status",
            accessor: "status",
            filterable: true,
            Cell: ({ value }) => <Badge tone={statusTone(value)}>{value ?? "—"}</Badge>,
            width: 140,
        },
        {
            Header: "Completed At",
            accessor: "completed_at",
            filterable: true,
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
                            type="button"
                        >
                            <i className="ri-eye-line" />
                        </button>
                        <button
                            className="ti-btn ti-btn-primary ti-btn-sm"
                            onClick={() => navigate(COURSE_ENROLLMENT_ROUTES.edit(id))}
                            type="button"
                        >
                            <i className="ri-edit-line" />
                        </button>
                    </div>
                );
            },
        },
    ];

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
                key={refreshKey}
                ref={tableRef}
                apiUrl="/lms/course-enrollments/datatable/"
                columns={columns}
                externalFilters={externalFilters}
                title="Course Enrollments"
                buttons={buttons}
                enableAdvancedFilters={true}
                advancedFilters={advancedFilters}
                setAdvancedFilters={setAdvancedFilters}
            />
        </div>
    );
}
