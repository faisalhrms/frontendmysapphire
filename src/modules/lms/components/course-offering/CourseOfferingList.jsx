import React, { useRef, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import { COURSE_ENROLLMENT_ROUTES, COURSE_OFFERING_ROUTES } from "@modules/lms/routes.js";
import CourseOfferingAssignModal from "@modules/lms/components/CourseOfferingAssignModal.jsx";
import api from "@config/axiosConfig.js";
import { toast } from "react-toastify";

const HR_CREATE_ENDPOINT = "/lms/course-enrollments/hr/";

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

export default function CourseOfferingList({ externalFilters = [] }) {
    const tableRef = useRef(null);
    const navigate = useNavigate();
    const [openAssignModal, setOpenAssignModal] = useState(false);

    const onOpenModal = () => setOpenAssignModal(true);
    const onCloseModal = () => setOpenAssignModal(false);

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
            { Header: "ID", accessor: "id", width: 80 },
            {
                Header: "Company",
                accessor: "company.name",
                Cell: ({ value, row }) => value ?? row.original?.company?.name ?? "—",
            },
            {
                Header: "Course",
                accessor: "course.title",
                Cell: ({ value, row }) => value ?? row.original?.course?.title ?? "—",
            },
            {
                accessor: "is_published",
                Header: "Published",
                getCellProps: (cellInfo) => {
                    const value = cellInfo.value;
                    return {
                        className: value ? "bg-success text-white" : "bg-red text-white",
                    };
                },
                Cell: ({ row }) => (
                    <span
                        className={`px-2 py-1 rounded text-xs ${
                            row.original.is_published
                                ? "bg-green-100 text-green-800"
                                : ""
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
                            row.original.allow_self_enroll
                                ? "bg-green-100 text-green-800"
                                : ""
                        }`}
                    >
      {row.original.allow_self_enroll ? "Allowed" : "No"}
    </span>
                ),
                width: 140,
            },

            { Header: "Start", accessor: "started_at", Cell: ({ value }) => formatDateOnly(value) },
            { Header: "End", accessor: "ended_at", Cell: ({ value }) => formatDateOnly(value) },
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
                                onClick={onOpenModal}
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
                title="Course Offerings"
                buttons={buttons}
            />

            <CourseOfferingAssignModal
                open={openAssignModal}
                onClose={onCloseModal}
                onSubmit={onContinue}
            />
        </div>
    );
}
