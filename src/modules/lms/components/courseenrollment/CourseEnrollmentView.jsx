import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import api from "@config/axiosConfig.js";
import { COURSE_ENROLLMENT_ROUTES } from "@modules/lms/routes.js";
import FormInput from "@components/form/FormInput.jsx";

const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : "—");

const toDateInputValue = (value) => {
    if (!value) return "";
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const cleanUserLabel = (u) => {
    if (!u) return "—";
    const n = (u?.name || "").trim();

    const badName = !n || n === "None None" || n === "None" || n.includes("None");
    return (!badName ? n : "") || u?.username || u?.email || `User #${u?.id ?? "—"}`;
};

const yesNo = (v) => (v === true ? "Yes" : v === false ? "No" : "—");

const Pill = ({ children }) => (
    <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 px-2 py-0.5 text-xs">
    {children}
  </span>
);

const SectionCard = ({ label, value }) => (
    <div className="border rounded-xl p-3">
        <div className="text-xs text-gray-500">{label}</div>
        <div className="text-sm font-medium break-words">{value ?? "—"}</div>
    </div>
);

export default function CourseEnrollmentView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [row, setRow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [serverMsg, setServerMsg] = useState("");

    const {
        control,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            started_at: "",
            ended_at: "",
        },
    });

    useEffect(() => {
        setLoading(true);
        setServerMsg("");

        api
            .get(`/lms/course-enrollments/${id}/`)
            .then((res) => {
                const payload = res?.data ?? {};
                const data = payload?.data ?? payload;
                setRow(data);
                if (payload?.message) setServerMsg(payload.message);
                const offering = data?.offering;
                setValue("started_at", toDateInputValue(offering?.started_at));
                setValue("ended_at", toDateInputValue(offering?.ended_at));
            })
            .catch((err) => {
                const payload = err?.response?.data;
                const msg =
                    payload?.message ||
                    (Array.isArray(payload?.errors) ? payload.errors[0] : null) ||
                    "Not found / failed to load.";
                setServerMsg(msg);
                setRow(null);
            })
            .finally(() => setLoading(false));
    }, [id, setValue]);

    const onDelete = async () => {
        const ok = window.confirm("Delete this enrollment?");
        if (!ok) return;

        await api.delete(`/lms/course-enrollments/${id}/`);
        navigate(COURSE_ENROLLMENT_ROUTES.list);
    };

    const u = row?.user;
    const offering = row?.offering;
    const companyName = offering?.company?.name ?? "—";
    const courseTitle = offering?.course?.title ?? "—";
    const courseSlug = offering?.course?.slug ?? "—";
    const userLabel = useMemo(() => cleanUserLabel(u), [u]);

    if (loading) return <div className="p-4">Loading...</div>;

    if (!row) {
        return (
            <div className="p-4 bg-white">
                <div className="mb-3 text-sm text-red-600">{serverMsg || "Not found."}</div>
                <Link to={COURSE_ENROLLMENT_ROUTES.list} className="px-3 py-2 rounded-lg border text-sm hover:bg-gray-50">
                    Back
                </Link>
            </div>
        );
    }

    return (
        <div className="p-4 mb-4 bg-white">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h1 className="text-xl font-semibold">Enrollment #{row?.id}</h1>
                    <div className="text-sm text-gray-500">
                        {companyName} • {courseTitle} • {userLabel}
                    </div>
                    {serverMsg ? <div className="text-xs text-gray-400 mt-1">{serverMsg}</div> : null}
                </div>

                <div className="flex gap-2">
                    <Link
                        to={COURSE_ENROLLMENT_ROUTES.edit(row.id)}
                        className="ti-btn ti-btn-primary ti-btn-sm"
                    >
                        <i className={"ri-edit-line"} />
                    </Link>
                    <Link
                        to={COURSE_ENROLLMENT_ROUTES.list}
                        className="whitespace-nowrap ti-btn ti-btn-secondary-full !py-1 !px-2 !text-[0.75rem]"
                    >
                        Back
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                    <Pill>Source: {row?.source ?? "—"}</Pill>
                    <Pill>Status: {row?.status ?? "—"}</Pill>
                    <Pill>Completed At: {formatDate(row?.completed_at)}</Pill>
                    <Pill>Score: {row?.score ?? "—"}</Pill>
                    <Pill>Time(s): {row?.total_time_seconds ?? 0}</Pill>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <SectionCard label="Offering ID" value={offering?.id ?? "—"} />
                    <SectionCard label="Company" value={`${offering?.company?.name ?? "—"} (ID: ${offering?.company?.id ?? "—"})`} />

                    <SectionCard label="Course" value={`${courseTitle} (ID: ${offering?.course?.id ?? "—"})`} />
                    <SectionCard label="Course Slug" value={courseSlug} />

                    <SectionCard label="Published" value={yesNo(offering?.is_published)} />
                    <SectionCard label="Allow Self Enroll" value={yesNo(offering?.allow_self_enroll)} />
                    <div className="border rounded-xl p-3">
                        <div className="text-xs text-gray-500 mb-2">Started At</div>
                        <FormInput
                            type="date"
                            name="started_at"
                            control={control}
                            errors={errors}
                            label={false}
                            placeholder="Started At"
                            disabled
                            readOnly
                        />
                    </div>

                    <div className="border rounded-xl p-3">
                        <div className="text-xs text-gray-500 mb-2">Ended At</div>
                        <FormInput
                            type="date"
                            name="ended_at"
                            control={control}
                            errors={errors}
                            label={false}
                            placeholder="Ended At"
                            disabled
                            readOnly
                        />
                    </div>

                    <SectionCard label="User" value={userLabel} />
                    <SectionCard label="User Email" value={u?.email ?? "—"} />
                </div>

                <div className="text-xs text-gray-500">
                    Created: {formatDate(row?.created_at)} • Updated: {formatDate(row?.updated_at)}
                </div>
            </div>
        </div>
    );
}
