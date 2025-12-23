import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "@config/axiosConfig.js";
import { COURSE_OFFERING_ROUTES } from "@modules/lms/routes.js";

const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : "—");

const Pill = ({ children }) => (
    <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-2 py-0.5 text-xs">
    {children}
  </span>
);

export default function CourseOfferingView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [row, setRow] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api
            .get(`/lms/course-offerings/${id}/`)
            .then((res) => setRow(res?.data?.data ?? res?.data))
            .finally(() => setLoading(false));
    }, [id]);

    const onDelete = async () => {
        const ok = window.confirm("Delete this offering?");
        if (!ok) return;

        await api.delete(`/lms/course-offerings/${id}/`);
        navigate(COURSE_OFFERING_ROUTES.list);
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (!row) return <div className="p-4">Not found.</div>;

    return (
        <div className="p-4 bg-white ">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-xl font-semibold">Offering #{row.id}</h1>
                    <div className="text-sm text-gray-500">
                        {row.company?.name ?? "—"} • {row.course?.title ?? "—"}
                    </div>
                </div>

                <div className="flex gap-2">
                    <Link
                        to={COURSE_OFFERING_ROUTES.edit(row.id)}
                        className="ti-btn ti-btn-primary ti-btn-sm"
                    >
                        <i className={"ri-edit-line"}/>
                    </Link>



                    <Link
                        to={COURSE_OFFERING_ROUTES.list}
                        className="whitespace-nowrap ti-btn ti-btn-secondary-full !py-1 !px-2 !text-[0.75rem]"
                    >
                        Back
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-4 space-y-3">
                <div className="flex flex-wrap gap-2">
                    <Pill>Published: {row.is_published ? "Yes" : "No"}</Pill>
                    <Pill>Self Enroll: {row.allow_self_enroll ? "Allowed" : "No"}</Pill>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="border rounded-xl p-3">
                        <div className="text-xs text-gray-500">Start</div>
                        <div className="text-sm font-medium">{formatDate(row.start_at)}</div>
                    </div>

                    <div className="border rounded-xl p-3">
                        <div className="text-xs text-gray-500">End</div>
                        <div className="text-sm font-medium">{formatDate(row.end_at)}</div>
                    </div>
                </div>

                <div className="text-xs text-gray-500">
                    Created: {formatDate(row.created_at)} • Updated: {formatDate(row.updated_at)}
                </div>
            </div>
        </div>
    );
}
