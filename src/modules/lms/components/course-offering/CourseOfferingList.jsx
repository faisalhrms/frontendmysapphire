import React, { useRef, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import {COURSE_ENROLLMENT_ROUTES, COURSE_OFFERING_ROUTES, LMS_ROUTES} from "@modules/lms/routes.js";
import CourseOfferingAssignModal from "@modules/lms/components/CourseOfferingAssignModal.jsx";
import api from "@config/axiosConfig.js";
import { toast } from "react-toastify";

const HR_CREATE_ENDPOINT = "/lms/course-enrollments/hr/";

const formatDateOnly = (value) => {
    if (!value) return "—";
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function CourseOfferingList({ isActive = true, externalFilters = [] }) {
    if (!isActive) return null;

    const tableRef = useRef(null);
    const navigate = useNavigate();
    const [openAssignModal, setOpenAssignModal] = useState(false);

    const [advancedFilters, setAdvancedFilters] = useState([]);

    const [assignDefaults, setAssignDefaults] = useState({
        offering_id: null,
        user_ids: [],
        score: "",
        total_time_seconds: 0,
    });

    const onCloseModal = () => setOpenAssignModal(false);

    const onOpenModal = (offeringRow) => {
        const offeringId = offeringRow?.id ?? null;

        setAssignDefaults({
            offering_id: offeringId,
            user_ids: [],
            score: "",
            total_time_seconds: 0,
        });

        setOpenAssignModal(true);
    };

    const onOpenEnrollmentDatatable = (offeringId) => {
        navigate(COURSE_ENROLLMENT_ROUTES.datatable(offeringId));
    };

    const onContinue = async ({ offering_id, user_ids, score, total_time_seconds }) => {
        const offeringId = Number(offering_id);
        const userIds = Array.isArray(user_ids) ? user_ids.map(Number).filter(Boolean) : [];

        if (!offeringId) return toast.error("Course Offering is required.");
        if (!userIds.length) return toast.error("At least one user is required.");

        const payload = {
            offering_id: offeringId,
            user_ids: userIds,
            score: score === "" || score === null || score === undefined ? null : Number(score),
            total_time_seconds: Number(total_time_seconds ?? 0),
        };

        try {
            const res = await api.post(HR_CREATE_ENDPOINT, payload);
            const out = res?.data?.data ?? res?.data;

            const createdCount = out?.created_count ?? 0;
            const skippedCount = out?.skipped_count ?? 0;

            if (skippedCount > 0) toast.info(`Created: ${createdCount} | Skipped: ${skippedCount}`);
            else toast.success(`Created: ${createdCount}`);

            onCloseModal();
            navigate(`${COURSE_ENROLLMENT_ROUTES.list}?refresh=${Date.now()}`);
        } catch (err) {
            const resp = err?.response?.data;
            const msg =
                resp?.message ||
                (Array.isArray(resp?.errors) ? resp.errors[0] : null) ||
                "Something went wrong.";
            toast.error(msg);
        }
    };

    const columns = useMemo(
        () => [
            {
                Header: "Company",
                accessor: "company_name",
                filterable: true,
                Cell: ({ value, row }) => value ?? row.original?.company?.name ?? "—",
            },
            {
                Header: "Course",
                accessor: "course_title",
                filterable: true,

                Cell: ({ value, row }) => {
                    const label = value ?? row.original?.course?.title ?? "—";
                    return (
                        <button
                            type="button"
                            className="text-left hover:underline"
                            onClick={() => onOpenModal(row.original)}
                            title="Assign enrollment"
                        >
                            {label}
                        </button>
                    );
                },
            },
            {
                accessor: "is_published",
                Header: "Published",
                filterable: true,
                getCellProps: (cellInfo) => {
                    const value = cellInfo.value;
                    return {
                        className: value ? "bg-success text-white" : "bg-red text-white",
                    };
                },
                Cell: ({ row }) => (
                    <span
                        className={`px-2 py-1 rounded text-xs ${
                            row.original.is_published ? "bg-green-100 text-green-800" : ""
                        }`}
                    >
                        {row.original.is_published ? "Yes" : "No"}
                    </span>
                ),
                width: 120,
            },
            {
                accessor: "allow_self_enroll",
                Header: "Self Enroll",
                getCellProps: (cellInfo) => {
                    const value = cellInfo.value;
                    return {
                        className: value ? "bg-success text-white" : "bg-red text-white",
                    };
                },
                Cell: ({ row }) => (
                    <span
                        className={`px-2 py-1 rounded text-xs ${
                            row.original.allow_self_enroll ? "bg-green-100 text-green-800" : ""
                        }`}
                    >
                        {row.original.allow_self_enroll ? "Allowed" : "No"}
                    </span>
                ),
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
                    const count = Number(row.original?.review_count ?? 0);

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

                            {/* Numbers */}
                            <div className="text-xs font-semibold text-zinc-900">
                                {count > 0 ? (
                                    <>
                                        {rounded} <span className="text-zinc-400 font-normal">({count})</span>
                                    </>
                                ) : (
                                    <span className="text-zinc-400">—</span>
                                )}
                            </div>
                        </div>
                    );
                },
            },
            {
                Header: "Start",
                accessor: "started_at",
                filterable: true,
                Cell: ({ value }) => formatDateOnly(value),
            },
            {
                Header: "End",
                accessor: "ended_at",
                filterable: true,
                Cell: ({ value }) => formatDateOnly(value),
            },
            {
                Header: "Actions",
                accessor: "actions",
                disableSortBy: true,
                width: 260,
                Cell: ({ row }) => {
                    const id = row.original?.id;
                    return (
                        <div className="flex gap-2">
                            <button
                                className="ti-btn ti-btn-secondary ti-btn-sm"
                                onClick={() => navigate(COURSE_OFFERING_ROUTES.view(id))}
                                title="View"
                                type="button"
                            >
                                <i className="ri-eye-line"/>
                            </button>

                            <Link
                                className="ti-btn ti-btn-warning ti-btn-sm"
                                to={`/module/lms/course-offerings/dashboard/${id}`}
                            >
                                <i className="ri-flow-chart"/>
                            </Link>

                            <button
                                className="ti-btn ti-btn-primary ti-btn-sm"
                                onClick={() => navigate(COURSE_OFFERING_ROUTES.edit(id))}
                                title="Edit"
                                type="button"
                            >
                                <i className="ri-edit-line"/>
                            </button>

                            <button
                                className="ti-btn ti-btn-info ti-btn-sm"
                                onClick={() => onOpenModal(row.original)}
                                title="Course Enrollment"
                                type="button"
                            >
                                <i className="ri-user-add-line"/>
                            </button>

                            <button
                                className="ti-btn ti-btn-success ti-btn-sm"
                                onClick={() => onOpenEnrollmentDatatable(id)}
                                title="View Enrollments"
                                type="button"
                            >
                                <i className="ri-team-line"/>
                            </button>
                        </div>
                    );
                },
            },
        ],
        [navigate]
    );

    const buttons = (
        <Link
            to={COURSE_OFFERING_ROUTES.create}
            className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
        >
            + Create Offering
        </Link>
    );

    return (
        <div className="p-4">
            <DataTable
                ref={tableRef}
                apiUrl="/lms/course-offerings/datatable/"
                columns={columns}
                externalFilters={externalFilters}
                buttons={buttons}
                enableAdvancedFilters={true}
                advancedFilters={advancedFilters}
                setAdvancedFilters={setAdvancedFilters}
            />

            <CourseOfferingAssignModal
                open={openAssignModal}
                onClose={onCloseModal}
                onSubmit={onContinue}
                defaultValues={assignDefaults}
            />
        </div>
    );
}
