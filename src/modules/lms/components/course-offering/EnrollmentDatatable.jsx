import React, { useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import {COURSE_ENROLLMENT_ROUTES, COURSE_OFFERING_ROUTES} from "@modules/lms/routes.js";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { Users } from "lucide-react";
import UserWithAvatar from "@components/UserWithAvatar.jsx";
import {toTitleCase} from "@helpers/formatters.js";
import ProgressBar from "@components/ProgressBar.jsx";
import {formatDate, secToHrs} from "@helpers/dateTime.js";

export default function EnrollmentDatatable({ externalFilters = [] }) {
    const tableRef = useRef(null);
    const [searchParams] = useSearchParams();
    const offeringId = searchParams.get("offering_id");

    const apiUrl = useMemo(() => {
        return offeringId
            ? `/lms/course-enrollments/datatable/?offering_id=${offeringId}`
            : `/lms/course-enrollments/datatable/`;
    }, [offeringId]);

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
            filterKey: 'user__full_name',
            Cell: ({ value }) => <UserWithAvatar user={value} />,
        },
        {
            Header: "Source",
            accessor: "source",
            filterType: 'select',
            filterable: true,
            filterOptions: [
                { label: 'SELF', value: 'self' },
                { label: 'HR', value: 'hr' },
            ],
            Cell: ({value}) => (
                value.toUpperCase()
            ),
            getCellProps: (cellInfo) => {
                return {
                    className: 'bg-slate-200 text-dark',
                }
            },
            width: 120,
        },
        {
            Header: "Status",
            accessor: "status",
            filterType: 'select',
            filterable: true,
            filterOptions: [
                { label: 'Assigned', value: 'assigned' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'Completed', value: 'blocked' }
            ],
            Cell: ({value}) => (
                toTitleCase(value)
            ),
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
                    default:
                        bgClass = "bg-success/10 text-success";
                }

                return {
                    className: `${bgClass}`,
                };
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
                        {/* Stars */}
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
            filterType: 'select',
            filterable: true,
            filterOptions: [
                { value: "not attempted", label: "Not Attempted" },
                { value: "browsing", label: "Browsing" },
                { value: "incomplete", label: "Incomplete" },
                { value: "completed", label: "Completed" },
                { value: "passed", label: "Passed" },
                { value: "failed", label: "Failed" },
            ],

            Cell: ({value}) => (
                toTitleCase(value)
            ),
            width: 150,
        },
        {
            Header: 'Progress',
            accessor: 'progress',
            filterable: false,
            excelColumnType: 'number',
            width: 200,
            Cell: ({row}) => {
                return (
                    <ProgressBar
                        value={row.original.progress}
                        withStatus={false}
                    />
                );
            },
        },
        {
            Header: "Completed At",
            accessor: "completed_at",
            filterable: true,
            filterType: 'datetime',
            Cell: ({ value }) => formatDate(value, 'MMM dd, yyyy - HH:mm'),
            width: 190,
        },
        {
            Header: "Last Activity At",
            accessor: "last_activity_at",
            filterable: true,
            filterType: 'datetime',
            Cell: ({ value }) => formatDate(value, 'MMM dd, yyyy - HH:mm'),
            width: 190,
        },
        { Header: "Score", accessor: "score", width: 110 },
        { Header: "Time Spent", accessor: "total_time_seconds",
            Cell: ({ value }) => secToHrs(value),
            width: 130 },
    ];

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
                enableAdvancedFilters={true}
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
