import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "@config/axiosConfig.js";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { COURSE_ENROLLMENT_ROUTES } from "@modules/lms/routes.js";
import { toast } from "react-toastify";

const isoToLocalInput = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
        d.getMinutes()
    )}`;
};

const localInputToISO = (value) => (value ? new Date(value).toISOString() : null);

const STATUS_OPTIONS = [
    { value: "assigned", label: "Assigned" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
];

const HR_CREATE_ENDPOINT = "/lms/course-enrollments/hr/";
const toId = (v) => (v && typeof v === "object" ? v.value : v);

export default function CourseEnrollmentForm({ showHeader = true, showBackButton = true }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [loading, setLoading] = useState(false);
    const [initial, setInitial] = useState(null);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm({
        defaultValues: {
            offering_id: null,
            user_ids: [],
            status: "assigned",
            completed_at: "",
            score: "",
            total_time_seconds: 0,
        },
    });

    const status = watch("status");
    const completedAt = watch("completed_at");

    useEffect(() => {
        if (!isEdit) return;

        setLoading(true);
        api
            .get(`/lms/course-enrollments/${id}/`)
            .then((res) => {
                const data = res?.data?.data ?? res?.data;
                setInitial(data);

                setValue("status", data?.status ?? "assigned", { shouldDirty: false });
                setValue("completed_at", isoToLocalInput(data?.completed_at), { shouldDirty: false });
                setValue("score", data?.score ?? "", { shouldDirty: false });
                setValue("total_time_seconds", data?.total_time_seconds ?? 0, { shouldDirty: false });

                if (data?.offering?.id) setValue("offering_id", data.offering.id, { shouldDirty: false });
                if (data?.user?.id) setValue("user_ids", [data.user.id], { shouldDirty: false });
            })
            .catch((err) => {
                const msg =
                    err?.response?.data?.message ||
                    (Array.isArray(err?.response?.data?.errors) ? err.response.data.errors[0] : null) ||
                    "Failed to load enrollment.";
                toast.error(msg);
            })
            .finally(() => setLoading(false));
    }, [id, isEdit, setValue]);

    useEffect(() => {
        if (status !== "completed" && completedAt) {
            setValue("completed_at", "", { shouldDirty: true });
            clearErrors("completed_at");
        }
    }, [status, completedAt, setValue, clearErrors]);

    const onSubmit = async (values) => {
        // ✅ EDIT (status/score/time only)
        if (isEdit) {
            const payload = {
                status: values.status,
                score: values.score === "" ? null : Number(values.score),
                total_time_seconds: Number(values.total_time_seconds ?? 0),
            };

            if (values.status === "completed") {
                const iso = localInputToISO(values.completed_at);
                if (iso) payload.completed_at = iso;
            }

            setLoading(true);
            try {
                await api.put(`/lms/course-enrollments/${id}/`, payload);
                toast.success("Enrollment updated successfully.");
                navigate(COURSE_ENROLLMENT_ROUTES.view(id));
            } catch (err) {
                const resp = err?.response?.data;
                const msg =
                    resp?.message ||
                    (Array.isArray(resp?.errors) ? resp.errors[0] : null) ||
                    "Something went wrong.";
                toast.error(msg);

                const fieldErrors = resp?.errors || resp?.data || null;
                if (fieldErrors && typeof fieldErrors === "object") {
                    Object.entries(fieldErrors).forEach(([k, v]) => {
                        const m = Array.isArray(v) ? v[0] : String(v);
                        setError(k, { type: "server", message: m });
                    });
                }
                throw err;
            } finally {
                setLoading(false);
            }
            return;
        }

        // ✅ CREATE (HR only, multi users + score + time)
        const offeringId = Number(toId(values.offering_id));
        if (!offeringId) return setError("offering_id", { type: "required", message: "Offering is required." });

        const userIds = Array.isArray(values.user_ids)
            ? values.user_ids.map((u) => Number(toId(u))).filter(Boolean)
            : [];

        if (!userIds.length) return setError("user_ids", { type: "required", message: "At least one user is required." });

        const createPayload = {
            offering_id: offeringId,
            user_ids: userIds,
            score: values.score === "" ? null : Number(values.score),
            total_time_seconds: Number(values.total_time_seconds ?? 0),
        };

        setLoading(true);
        try {
            const res = await api.post(HR_CREATE_ENDPOINT, createPayload);
            const out = res?.data?.data ?? res?.data;

            // ✅ IMPORTANT: use results[] to show ALL users processed (not single object)
            const createdCount = out?.created_count ?? 0;
            const skippedCount = out?.skipped_count ?? 0;

            const results = Array.isArray(out?.results) ? out.results : [];
            const createdUsers = results.filter((r) => r.created).map((r) => r.user_id);
            const skippedUsers = results.filter((r) => !r.created).map((r) => r.user_id);

            if (skippedCount > 0) {
                toast.info(
                    `Created: ${createdCount}${createdUsers.length ? ` [${createdUsers.join(", ")}]` : ""} | ` +
                    `Skipped: ${skippedCount}${skippedUsers.length ? ` [${skippedUsers.join(", ")}]` : ""}`
                );
            } else {
                toast.success(
                    `Created: ${createdCount}${createdUsers.length ? ` [${createdUsers.join(", ")}]` : ""}`
                );
            }

            // ✅ force list refresh
            navigate(`${COURSE_ENROLLMENT_ROUTES.list}?refresh=${Date.now()}`);
        } catch (err) {
            const resp = err?.response?.data;
            const msg =
                resp?.message ||
                (Array.isArray(resp?.errors) ? resp.errors[0] : null) ||
                "Something went wrong.";
            toast.error(msg);

            const fieldErrors = resp?.errors || resp?.data || null;
            if (fieldErrors && typeof fieldErrors === "object") {
                Object.entries(fieldErrors).forEach(([k, v]) => {
                    const m = Array.isArray(v) ? v[0] : String(v);
                    setError(k, { type: "server", message: m });
                });
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const offeringPreselected = useMemo(() => {
        if (isEdit && initial?.offering?.id) {
            const label = `${initial?.offering?.course?.title ?? "Course"} (${
                initial?.offering?.company?.name ?? "Company"
            })`;
            return [{ value: initial.offering.id, label }];
        }
        return [];
    }, [isEdit, initial]);

    const userPreselected = useMemo(() => {
        if (isEdit && initial?.user?.id) {
            const u = initial.user;
            const label = u?.name || u?.username || u?.email || `User #${u?.id}`;
            return [{ value: u.id, label }];
        }
        return [];
    }, [isEdit, initial]);

    const statusReg = register("status");

    return (
        <div className="p-4 bg-white dark:text-gray-200 dark:bg-bodybg">
            {showHeader ? (
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-xl font-semibold">{isEdit ? "Edit Enrollment" : "Create Enrollment"}</h1>
                        <p className="text-sm text-gray-500">
                            {isEdit ? "Update status, score, and time." : "HR assigns multiple users into a course offering."}
                        </p>
                    </div>

                    {showBackButton && (
                        <Link to={COURSE_ENROLLMENT_ROUTES.list} className="ti-btn ti-btn-primary ">
                            Back
                        </Link>
                    )}
                </div>
            ) : (
                showBackButton && (
                    <div className="flex justify-end mb-4">
                        <Link to={COURSE_ENROLLMENT_ROUTES.list} className="ti-btn ti-btn-primary ">
                            Back
                        </Link>
                    </div>
                )
            )}

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-2xl shadow-sm border p-4 space-y-4 dark:text-gray-200 dark:bg-bodybg"
            >
                <div>
                    <FormAsyncSelect
                        isMulti={false}
                        label={isEdit ? "Course Offering" : "Course Offering *"}
                        name="offering_id"
                        control={control}
                        errors={errors}
                        placeholder="course offering..."
                        preselectedOptions={offeringPreselected}
                        allowSaveNewOption={false}
                        className="w-full"
                        apiUrl={`/select/lms/course-offerings/?published=true&active_now=true`}
                        queryKeyBase={`lms_course_offerings_active`}
                        needObject={false}
                        isDisabled={isEdit}
                        rules={{ required: !isEdit ? "Course Offering is required" : false }}
                    />
                    {errors.offering_id && <p className="text-xs text-red-600 mt-1">{errors.offering_id.message}</p>}
                </div>

                <div>
                    <FormAsyncSelect
                        isMulti={true}
                        label={isEdit ? "Target Users" : "Target Users *"}
                        name="user_ids"
                        control={control}
                        errors={errors}
                        placeholder="Search users..."
                        preselectedOptions={userPreselected}
                        allowSaveNewOption={false}
                        className="w-full"
                        apiUrl={`/select/users`}
                        queryKeyBase={`core_users`}
                        needObject={false}
                        isDisabled={isEdit}
                        rules={{ required: !isEdit ? "At least one user is required" : false }}
                    />
                    {errors.user_ids && <p className="text-xs text-red-600 mt-1">{errors.user_ids.message}</p>}
                </div>

                {/* Status + CompletedAt only in edit */}
                {isEdit && (
                    <>
                        <div>
                            <label className="form-label">Status</label>
                            <select
                                {...statusReg}
                                className="form-control w-full !rounded-sm border"
                                value={status || "assigned"}
                                onChange={(e) => {
                                    statusReg.onChange(e);
                                    setValue("status", e.target.value, { shouldDirty: true });
                                }}
                            >
                                {STATUS_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {status === "completed" && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Completed At (optional)</label>
                                <input
                                    type="datetime-local"
                                    className="w-full border rounded-xl px-3 py-2"
                                    {...register("completed_at")}
                                    value={completedAt || ""}
                                    onChange={(e) => setValue("completed_at", e.target.value, { shouldDirty: true })}
                                />
                                {errors.completed_at && <p className="text-xs text-red-600 mt-1">{errors.completed_at.message}</p>}
                            </div>
                        )}
                    </>
                )}

                {/* ✅ show on BOTH create and edit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className=" form-label ">Score (optional)</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control w-full !rounded-sm border"
                            {...register("score")}
                            value={watch("score") ?? ""}
                            onChange={(e) => setValue("score", e.target.value, { shouldDirty: true })}
                        />
                    </div>

                    <div>
                        <label className="form-label">Total Time (seconds)</label>
                        <input
                            type="number"
                            min="0"
                            className="form-control w-full !rounded-sm border"
                            {...register("total_time_seconds")}
                            value={watch("total_time_seconds") ?? 0}
                            onChange={(e) => setValue("total_time_seconds", Number(e.target.value) || 0, { shouldDirty: true })}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                        type="button"
                        className="ti-btn ti-btn-primary"
                        onClick={() => navigate(COURSE_ENROLLMENT_ROUTES.list)}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md ti-btn-primary-full" disabled={loading}>
                        {loading ? "Saving..." : isEdit ? "Update" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
}