import React, {useRef, useMemo, useState} from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import { COURSE_ENROLLMENT_ROUTES } from "@modules/lms/routes.js";
import UserWithAvatar from "@components/UserWithAvatar.jsx";
import {toTitleCase} from "@helpers/formatters.js";
import ProgressBar from "@components/ProgressBar.jsx";
import {secToHrs} from "@helpers/dateTime.js";

const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : "—");

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
            accessor: "offering.company.name",
            filterable: true,
            Cell: ({ row }) => row?.original?.offering?.company?.name ?? "—",
        },
        {
            Header: "Course",
            accessor: "offering.course.title",
            filterable: true,
            Cell: ({ row }) => row?.original?.offering?.course?.title ?? "—",
        },
        {
            Header: "User",
            accessor: "user",
            filterable: true,
            filterKey: "users__full_name",

            excelFormat: (u) => u?.full_name || u?.name || u?.email || "—",

            Cell: ({ value }) => <UserWithAvatar user={value} />,
        },

        {
            Header: "Source",
            accessor: "source",
            filterType: "select",
            filterable: true,
            filterOptions: [
                { label: "SELF", value: "self" },
                { label: "HR", value: "hr" },
            ],
            Cell: ({ value }) => value.toUpperCase(),
            getCellProps: () => ({ className: "bg-slate-200 text-dark" }),
            width: 120,
        },

        {
            Header: "Status",
            accessor: "status",
            filterType: "select",
            filterable: true,
            filterOptions: [
                { label: "Assigned", value: "assigned" },
                { label: "In Progress", value: "in_progress" },
                { label: "Completed", value: "blocked" },
            ],
            Cell: ({ value }) => toTitleCase(value),

            excelStyleMap: {
                assigned:    { label: "Assigned",    bgColor: "#FFF7E6", textColor: "#B45309" },
                in_progress: { label: "In Progress", bgColor: "#E0F2FE", textColor: "#0369A1" },
                blocked:     { label: "Completed",   bgColor: "#DCFCE7", textColor: "#15803D" },
                completed:   { label: "Completed",   bgColor: "#DCFCE7", textColor: "#15803D" },
            },

            getCellProps: (cellInfo) => {
                const value = cellInfo.value || "";
                let bgClass = "";
                switch (value) {
                    case "assigned":
                        bgClass = "bg-warning/10 text-warning";
                        break;
                    case "in_progress":
                        bgClass = "bg-info/10 text-info";
                        break;
                    case "blocked":
                    case "completed":
                    default:
                        bgClass = "bg-success/10 text-success";
                }
                return { className: `${bgClass}` };
            },

            width: 140,
        },
        {
            Header: "Rating",
            accessor: "avg_rating",
            filterable: false,
            width: 170,
            disableSortBy: true,
            Cell: ({ row }) => {
                const avg = Number(row.original?.avg_rating ?? 0);
                const rounded = Math.round(avg * 10) / 10;
                const starsFilled = Math.round(rounded);
                const stars = Array.from({ length: 5 }, (_, i) => i < starsFilled);

                return (
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <div className="flex items-center gap-0.5">
                            {stars.map((filled, i) => (
                                <svg
                                    key={i}
                                    viewBox="0 0 20 20"
                                    className={`w-4 h-4 ${filled ? "text-warning" : "text-zinc-200"}`}
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.964a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.374 2.452a1 1 0 00-.364 1.118l1.286 3.964c.3.921-.755 1.688-1.538 1.118l-3.374-2.452a1 1 0 00-1.175 0l-3.374 2.452c-.783.57-1.838-.197-1.538-1.118l1.286-3.964a1 1 0 00-.364-1.118L2.05 9.391c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.964z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                );
            },
        },

        {
            Header: "Scorm Status",
            accessor: "scorm_status",
            filterType: "select",
            filterable: true,
            filterOptions: [
                { value: "not attempted", label: "Not Attempted" },
                { value: "browsing", label: "Browsing" },
                { value: "incomplete", label: "Incomplete" },
                { value: "completed", label: "Completed" },
                { value: "passed", label: "Passed" },
                { value: "failed", label: "Failed" },
            ],
            Cell: ({ value }) => toTitleCase(value),
            width: 150,
        },

        {
            Header: "Progress",
            accessor: "progress",
            filterable: false,
            excelColumnType: "number",
            width: 200,
            Cell: ({ row }) => (
                <ProgressBar value={row.original.progress} withStatus={false} />
            ),
        },

        {
            Header: "Completed At",
            accessor: "completed_at",
            filterable: true,
            filterType: "datetime",
            excelColumnType: "datetime",
            Cell: ({ value }) => formatDate(value, "MMM dd, yyyy - HH:mm"),
            width: 190,
        },
        {
            Header: "Last Activity At",
            accessor: "last_activity_at",
            filterable: true,
            filterType: "datetime",
            excelColumnType: "datetime",
            Cell: ({ value }) => formatDate(value, "MMM dd, yyyy - HH:mm"),
            width: 190,
        },

        { Header: "Score", accessor: "score", width: 110 },

        {
            Header: "Time Spent",
            accessor: "total_time_seconds",
            excelFormat: (sec) => secToHrs(sec),
            Cell: ({ value }) => secToHrs(value),
            width: 130,
        },

        {
            Header: "Actions",
            accessor: "__actions__",
            disableSortBy: true,
            width: 100,
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
                buttons={buttons}
                enableAdvancedFilters={true}
                advancedFilters={advancedFilters}
                setAdvancedFilters={setAdvancedFilters}
            />
        </div>
    );
}
