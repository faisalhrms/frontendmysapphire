import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import api from "@config/axiosConfig.js";
import { COURSE_OFFERING_ROUTES } from "@modules/lms/routes.js";
import FormInput from "@components/form/FormInput.jsx";

const formatDateTime = (iso) => (iso ? new Date(iso).toLocaleString() : "—");

const toDateInputValue = (value) => {
    if (!value) return "";
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const Pill = ({ children }) => (
    <span className="inline-flex items-center rounded-full bg-success/10 text-success px-2 py-0.5 text-xs">
        {children}
    </span>
);

const RowItem = ({ label, value }) => (
    <div className="border rounded-xl p-3">
        <div className="text-xs ">{label}</div>
        <div className="text-sm font-medium break-words">{value ?? "—"}</div>
    </div>
);

export default function CourseOfferingView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [row, setRow] = useState(null);
    const [loading, setLoading] = useState(true);
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
        api
            .get(`/lms/course-offerings/${id}/`)
            .then((res) => {
                const data = res?.data?.data ?? res?.data;
                setRow(data);
                setValue("started_at", toDateInputValue(data?.started_at));
                setValue("ended_at", toDateInputValue(data?.ended_at));
            })
            .finally(() => setLoading(false));
    }, [id, setValue]);

    const onDelete = async () => {
        const ok = window.confirm("Delete this offering?");
        if (!ok) return;

        await api.delete(`/lms/course-offerings/${id}/`);
        navigate(COURSE_OFFERING_ROUTES.list);
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (!row) return <div className="p-4">Not found.</div>;

    return (
        <div className="p-4 bg-white mb-4  dark:text-gray-200 dark:bg-bodybg">
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
                        <i className={"ri-edit-line"} />
                    </Link>


                    <Link
                        to={COURSE_OFFERING_ROUTES.list}
                        className="whitespace-nowrap ti-btn ti-btn-secondary-full !py-1 !px-2 !text-[0.75rem]"
                    >
                        Back
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border p-4 space-y-4 dark:text-gray-200 dark:bg-bodybg">
                <div className="flex flex-wrap gap-2">
                    <Pill>ID: {row.id}</Pill>
                    <Pill>Published: {row.is_published ? "Yes" : "No"}</Pill>
                    <Pill>Self Enroll: {row.allow_self_enroll ? "Allowed" : "No"}</Pill>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <RowItem label="Company ID" value={row.company?.id ?? "—"} />
                    <RowItem label="Company Name" value={row.company?.name ?? "—"} />

                    <RowItem label="Course ID" value={row.course?.id ?? "—"} />
                    <RowItem label="Course Title" value={row.course?.title ?? "—"} />

                    <RowItem label="Course Slug" value={row.course?.slug ?? "—"} />
                    <RowItem label="Published" value={row.is_published ? "true" : "false"} />

                    <RowItem
                        label="Allow Self Enroll"
                        value={row.allow_self_enroll ? "true" : "false"}
                    />

                    {/* ✅ use FormInput (date only, no time) */}
                    <div className="border rounded-xl p-3">
                        <div className="text-xs  mb-2">Started At</div>
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
                        <div className="text-xs  mb-2">Ended At</div>
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

                    <RowItem label="Created At" value={formatDateTime(row.created_at)} />
                    <RowItem label="Updated At" value={formatDateTime(row.updated_at)} />
                </div>
            </div>
        </div>
    );
}
