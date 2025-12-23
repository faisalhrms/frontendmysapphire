// import React, { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import api from "@config/axiosConfig.js";
// import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
// import { COURSE_ENROLLMENT_ROUTES } from "@modules/lms/routes.js";
//
// const isoToLocalInput = (iso) => {
//     if (!iso) return "";
//     const d = new Date(iso);
//     const pad = (n) => String(n).padStart(2, "0");
//     return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
//         d.getHours()
//     )}:${pad(d.getMinutes())}`;
// };
//
// const localInputToISO = (value) => (value ? new Date(value).toISOString() : null);
//
// const STATUS_OPTIONS = [
//     { value: "assigned", label: "Assigned" },
//     { value: "in_progress", label: "In Progress" },
//     { value: "completed", label: "Completed" },
// ];
//
// const SOURCE_OPTIONS = [
//     { value: "self", label: "Self" },
//     { value: "hr", label: "HR" },
// ];
//
// const toId = (v) => (v && typeof v === "object" ? v.value : v);
//
//
// const CREATE_ENDPOINTS = {
//     self: "/lms/course-enrollments/self/",
//     hr: "/lms/course-enrollments/hr/",
// };
//
// export default function CourseEnrollmentForm() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const isEdit = !!id;
//
//     const [loading, setLoading] = useState(false);
//     const [initial, setInitial] = useState(null);
//
//     const {
//         register,
//         handleSubmit,
//         control,
//         setValue,
//         watch,
//         formState: { errors },
//         setError,
//         clearErrors,
//     } = useForm({
//         defaultValues: {
//             offering_id: null,
//             source: "self",
//             user_id: null,
//             status: "assigned",
//             completed_at: "",
//             score: "",
//             total_time_seconds: 0,
//         },
//     });
//
//     const source = watch("source");
//     const status = watch("status");
//     const completedAt = watch("completed_at");
//
//     // Load for edit
//     useEffect(() => {
//         if (!isEdit) return;
//
//         setLoading(true);
//         api
//             .get(`/lms/course-enrollments/${id}/`)
//             .then((res) => {
//                 const data = res?.data?.data ?? res?.data;
//                 setInitial(data);
//
//                 setValue("source", data?.source ?? "self", { shouldDirty: false });
//                 setValue("status", data?.status ?? "assigned", { shouldDirty: false });
//                 setValue("completed_at", isoToLocalInput(data?.completed_at), { shouldDirty: false });
//                 setValue("score", data?.score ?? "", { shouldDirty: false });
//                 setValue("total_time_seconds", data?.total_time_seconds ?? 0, { shouldDirty: false });
//
//                 if (data?.offering?.id) setValue("offering_id", data.offering.id, { shouldDirty: false });
//                 if (data?.user?.id) setValue("user_id", data.user.id, { shouldDirty: false });
//             })
//             .finally(() => setLoading(false));
//     }, [id, isEdit, setValue]);
//
//     // If status changed away from completed, clear completed_at
//     useEffect(() => {
//         if (status !== "completed" && completedAt) {
//             setValue("completed_at", "", { shouldDirty: true });
//             clearErrors("completed_at");
//         }
//     }, [status, completedAt, setValue, clearErrors]);
//
//     const onSubmit = async (values) => {
//
//         if (isEdit) {
//             const payload = {
//                 status: values.status,
//                 score: values.score === "" ? null : Number(values.score),
//                 total_time_seconds: Number(values.total_time_seconds ?? 0),
//             };
//
//             if (values.status === "completed") {
//                 const iso = localInputToISO(values.completed_at);
//                 if (iso) payload.completed_at = iso;
//             }
//
//             setLoading(true);
//             try {
//                 await api.put(`/lms/course-enrollments/${id}/`, payload);
//                 navigate(COURSE_ENROLLMENT_ROUTES.view(id));
//             } catch (err) {
//                 const resp = err?.response?.data;
//                 const fieldErrors = resp?.errors || resp?.data || null;
//                 if (fieldErrors && typeof fieldErrors === "object") {
//                     Object.entries(fieldErrors).forEach(([k, v]) => {
//                         const msg = Array.isArray(v) ? v[0] : String(v);
//                         setError(k, { type: "server", message: msg });
//                     });
//                 }
//                 throw err;
//             } finally {
//                 setLoading(false);
//             }
//             return;
//         }
//
//
//         const offeringId = Number(toId(values.offering_id));
//         if (!offeringId) {
//             return setError("offering_id", { type: "required", message: "Offering is required." });
//         }
//
//         if (values.source === "hr") {
//             const userId = Number(toId(values.user_id));
//             if (!userId) {
//                 return setError("user_id", { type: "required", message: "User is required when source is HR." });
//             }
//         }
//
//         const endpoint = CREATE_ENDPOINTS[values.source] || CREATE_ENDPOINTS.self;
//
//         const createPayload =
//             values.source === "hr"
//                 ? { offering_id: offeringId, user_id: Number(toId(values.user_id)) }
//                 : { offering_id: offeringId };
//
//         setLoading(true);
//         try {
//             // ✅ MUST be POST (not GET)
//             const res = await api.post(endpoint, createPayload);
//             const created = res?.data?.data ?? res?.data;
//             navigate(COURSE_ENROLLMENT_ROUTES.view(created.id));
//         } catch (err) {
//             const resp = err?.response?.data;
//             const fieldErrors = resp?.errors || resp?.data || null;
//             if (fieldErrors && typeof fieldErrors === "object") {
//                 Object.entries(fieldErrors).forEach(([k, v]) => {
//                     const msg = Array.isArray(v) ? v[0] : String(v);
//                     setError(k, { type: "server", message: msg });
//                 });
//             }
//             throw err;
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const offeringPreselected = useMemo(() => {
//         if (isEdit && initial?.offering?.id) {
//             const label = `${initial?.offering?.course?.title ?? "Course"} (${
//                 initial?.offering?.company?.name ?? "Company"
//             })`;
//             return [{ value: initial.offering.id, label }];
//         }
//         return [];
//     }, [isEdit, initial]);
//
//     const userPreselected = useMemo(() => {
//         if (isEdit && initial?.user?.id) {
//             const u = initial.user;
//             const label = u?.name || u?.username || u?.email || `User #${u?.id}`;
//             return [{ value: initial.user.id, label }];
//         }
//         return [];
//     }, [isEdit, initial]);
//
//     const sourceReg = register("source", { required: "Source is required" });
//     const statusReg = register("status");
//
//     return (
//         <div className="p-4">
//             <div className="flex items-center justify-between mb-4">
//                 <div>
//                     <h1 className="text-xl font-semibold">{isEdit ? "Edit Enrollment" : "Create Enrollment"}</h1>
//                     <p className="text-sm text-gray-500">
//                         {isEdit ? "Update status, score, and time only." : "Create enrollment (self or HR)."}
//                     </p>
//                 </div>
//
//                 <Link
//                     to={COURSE_ENROLLMENT_ROUTES.list}
//                     className="ti-btn ti-btn-primary "
//                 >
//                     Back
//                 </Link>
//             </div>
//
//             <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm border p-4 space-y-4">
//                 <div>
//                     <FormAsyncSelect
//                         isMulti={false}
//                         label={isEdit ? "Course Offering" : "Course Offering *"}
//                         name="offering_id"
//                         control={control}
//                         errors={errors}
//                         placeholder="course offering..."
//                         preselectedOptions={offeringPreselected}
//                         allowSaveNewOption={false}
//                         className="w-full"
//                         apiUrl={`/select/lms/course-offerings/`}
//                         queryKeyBase={`lms_course_offerings`}
//                         needObject={false}
//                         isDisabled={isEdit}
//                         rules={{
//                             required: !isEdit ? "Course Offering is required" : false,
//                         }}
//                     />
//                     {errors.offering_id && <p className="text-xs text-red-600 mt-1">{errors.offering_id.message}</p>}
//                 </div>
//
//                 <div>
//                     <label className="form-label">Source *</label>
//                     <select
//                         {...sourceReg}
//                         className="form-control w-full !rounded-sm border  "
//                         value={source || "self"}
//                         disabled={isEdit}
//                         onChange={(e) => {
//                             sourceReg.onChange(e);
//
//                             const v = e.target.value;
//                             setValue("source", v, { shouldDirty: true, shouldValidate: true });
//
//                             if (v !== "hr") {
//                                 setValue("user_id", null, { shouldDirty: true, shouldValidate: true });
//                                 clearErrors("user_id");
//                             }
//                         }}
//                     >
//                         {SOURCE_OPTIONS.map((o) => (
//                             <option key={o.value} value={o.value}>
//                                 {o.label}
//                             </option>
//                         ))}
//                     </select>
//                     {errors.source && <p className="text-xs text-red-600 mt-1">{errors.source.message}</p>}
//                 </div>
//
//                 {source === "hr" && (
//                     <div>
//                         <FormAsyncSelect
//                             isMulti={false}
//                             label={isEdit ? "Target User" : "Target User *"}
//                             name="user_id"
//                             control={control}
//                             errors={errors}
//                             placeholder="Search user..."
//                             preselectedOptions={userPreselected}
//                             allowSaveNewOption={false}
//                             className="w-full"
//                             apiUrl={`/select/users`}
//                             queryKeyBase={`core_users`}
//                             needObject={false}
//                             isDisabled={isEdit}
//                             rules={{
//                                 required: source === "hr" && !isEdit ? "User is required for HR enrollment" : false,
//                             }}
//                         />
//                         {errors.user_id && <p className="text-xs text-red-600 mt-1">{errors.user_id.message}</p>}
//                     </div>
//                 )}
//
//                 <div>
//                     <label className="form-label">Status</label>
//                     <select
//                         {...statusReg}
//                         className="form-control w-full !rounded-sm border  "
//                         value={status || "assigned"}
//                         onChange={(e) => {
//                             statusReg.onChange(e);
//                             setValue("status", e.target.value, { shouldDirty: true });
//                         }}
//                     >
//                         {STATUS_OPTIONS.map((o) => (
//                             <option key={o.value} value={o.value}>
//                                 {o.label}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//
//                 {status === "completed" && (
//                     <div>
//                         <label className="block text-sm font-medium mb-1">Completed At (optional)</label>
//                         <input
//                             type="datetime-local"
//                             className="w-full border rounded-xl px-3 py-2"
//                             {...register("completed_at")}
//                             value={completedAt || ""}
//                             onChange={(e) => setValue("completed_at", e.target.value, { shouldDirty: true })}
//                         />
//                         {errors.completed_at && (
//                             <p className="text-xs text-red-600 mt-1">{errors.completed_at.message}</p>
//                         )}
//                     </div>
//                 )}
//
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     <div>
//                         <label className=" form-label ">Score (optional)</label>
//                         <input
//                             type="number"
//                             step="0.01"
//                             className="form-control w-full !rounded-sm border"
//                             {...register("score")}
//                             value={watch("score") ?? ""}
//                             onChange={(e) => setValue("score", e.target.value, { shouldDirty: true })}
//                         />
//                     </div>
//
//                     <div>
//                         <label className="form-label">Total Time (seconds)</label>
//                         <input
//                             type="number"
//                             min="0"
//                             className="form-control w-full !rounded-sm border  "
//                             {...register("total_time_seconds")}
//                             value={watch("total_time_seconds") ?? 0}
//                             onChange={(e) =>
//                                 setValue("total_time_seconds", Number(e.target.value) || 0, { shouldDirty: true })
//                             }
//                         />
//                     </div>
//                 </div>
//
//                 <div className="flex items-center justify-end gap-2 pt-2">
//                     <button
//                         type="button"
//                         className="ti-btn ti-btn-primary"
//                         onClick={() => navigate(COURSE_ENROLLMENT_ROUTES.list)}
//                         disabled={loading}
//                     >
//                         Cancel
//                     </button>
//
//                     <button
//                         type="submit"
//                         className="px-4 py-2 text-sm font-medium rounded-md ti-btn-primary-full"
//                         disabled={loading}
//                     >
//                         {loading ? "Saving..." : isEdit ? "Update" : "Create"}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "@config/axiosConfig.js";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { COURSE_ENROLLMENT_ROUTES } from "@modules/lms/routes.js";

const isoToLocalInput = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
        d.getHours()
    )}:${pad(d.getMinutes())}`;
};

const localInputToISO = (value) => (value ? new Date(value).toISOString() : null);

const STATUS_OPTIONS = [
    { value: "assigned", label: "Assigned" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
];

const SOURCE_OPTIONS = [
    { value: "self", label: "Self" },
    { value: "hr", label: "HR" },
];

const toId = (v) => (v && typeof v === "object" ? v.value : v);

const CREATE_ENDPOINTS = {
    self: "/lms/course-enrollments/self/",
    hr: "/lms/course-enrollments/hr/",
};

export default function CourseEnrollmentForm({
                                                 showHeader = true,
                                                 showBackButton = true,
                                             }) {
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
            source: "self",
            user_id: null,
            status: "assigned",
            completed_at: "",
            score: "",
            total_time_seconds: 0,
        },
    });

    const source = watch("source");
    const status = watch("status");
    const completedAt = watch("completed_at");

    // Load for edit
    useEffect(() => {
        if (!isEdit) return;

        setLoading(true);
        api
            .get(`/lms/course-enrollments/${id}/`)
            .then((res) => {
                const data = res?.data?.data ?? res?.data;
                setInitial(data);

                setValue("source", data?.source ?? "self", { shouldDirty: false });
                setValue("status", data?.status ?? "assigned", { shouldDirty: false });
                setValue("completed_at", isoToLocalInput(data?.completed_at), { shouldDirty: false });
                setValue("score", data?.score ?? "", { shouldDirty: false });
                setValue("total_time_seconds", data?.total_time_seconds ?? 0, { shouldDirty: false });

                if (data?.offering?.id) setValue("offering_id", data.offering.id, { shouldDirty: false });
                if (data?.user?.id) setValue("user_id", data.user.id, { shouldDirty: false });
            })
            .finally(() => setLoading(false));
    }, [id, isEdit, setValue]);

    // If status changed away from completed, clear completed_at
    useEffect(() => {
        if (status !== "completed" && completedAt) {
            setValue("completed_at", "", { shouldDirty: true });
            clearErrors("completed_at");
        }
    }, [status, completedAt, setValue, clearErrors]);

    const onSubmit = async (values) => {
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
                navigate(COURSE_ENROLLMENT_ROUTES.view(id));
            } catch (err) {
                const resp = err?.response?.data;
                const fieldErrors = resp?.errors || resp?.data || null;
                if (fieldErrors && typeof fieldErrors === "object") {
                    Object.entries(fieldErrors).forEach(([k, v]) => {
                        const msg = Array.isArray(v) ? v[0] : String(v);
                        setError(k, { type: "server", message: msg });
                    });
                }
                throw err;
            } finally {
                setLoading(false);
            }
            return;
        }

        const offeringId = Number(toId(values.offering_id));
        if (!offeringId) {
            return setError("offering_id", { type: "required", message: "Offering is required." });
        }

        if (values.source === "hr") {
            const userId = Number(toId(values.user_id));
            if (!userId) {
                return setError("user_id", { type: "required", message: "User is required when source is HR." });
            }
        }

        const endpoint = CREATE_ENDPOINTS[values.source] || CREATE_ENDPOINTS.self;

        const createPayload =
            values.source === "hr"
                ? { offering_id: offeringId, user_id: Number(toId(values.user_id)) }
                : { offering_id: offeringId };

        setLoading(true);
        try {
            const res = await api.post(endpoint, createPayload);
            const created = res?.data?.data ?? res?.data;
            navigate(COURSE_ENROLLMENT_ROUTES.view(created.id));
        } catch (err) {
            const resp = err?.response?.data;
            const fieldErrors = resp?.errors || resp?.data || null;
            if (fieldErrors && typeof fieldErrors === "object") {
                Object.entries(fieldErrors).forEach(([k, v]) => {
                    const msg = Array.isArray(v) ? v[0] : String(v);
                    setError(k, { type: "server", message: msg });
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
            return [{ value: initial.user.id, label }];
        }
        return [];
    }, [isEdit, initial]);

    const sourceReg = register("source", { required: "Source is required" });
    const statusReg = register("status");

    return (
        <div className="p-4 bg-white">
            {showHeader ? (
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-xl font-semibold">{isEdit ? "Edit Enrollment" : "Create Enrollment"}</h1>
                        <p className="text-sm text-gray-500">
                            {isEdit ? "Update status, score, and time only." : "Create enrollment (self or HR)."}
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

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm border p-4 space-y-4">
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
                        apiUrl={`/select/lms/course-offerings/`}
                        queryKeyBase={`lms_course_offerings`}
                        needObject={false}
                        isDisabled={isEdit}
                        rules={{
                            required: !isEdit ? "Course Offering is required" : false,
                        }}
                    />
                    {errors.offering_id && <p className="text-xs text-red-600 mt-1">{errors.offering_id.message}</p>}
                </div>

                <div>
                    <label className="form-label">Source *</label>
                    <select
                        {...sourceReg}
                        className="form-control w-full !rounded-sm border  "
                        value={source || "self"}
                        disabled={isEdit}
                        onChange={(e) => {
                            sourceReg.onChange(e);

                            const v = e.target.value;
                            setValue("source", v, { shouldDirty: true, shouldValidate: true });

                            if (v !== "hr") {
                                setValue("user_id", null, { shouldDirty: true, shouldValidate: true });
                                clearErrors("user_id");
                            }
                        }}
                    >
                        {SOURCE_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </select>
                    {errors.source && <p className="text-xs text-red-600 mt-1">{errors.source.message}</p>}
                </div>

                {source === "hr" && (
                    <div>
                        <FormAsyncSelect
                            isMulti={false}
                            label={isEdit ? "Target User" : "Target User *"}
                            name="user_id"
                            control={control}
                            errors={errors}
                            placeholder="Search user..."
                            preselectedOptions={userPreselected}
                            allowSaveNewOption={false}
                            className="w-full"
                            apiUrl={`/select/users`}
                            queryKeyBase={`core_users`}
                            needObject={false}
                            isDisabled={isEdit}
                            rules={{
                                required: source === "hr" && !isEdit ? "User is required for HR enrollment" : false,
                            }}
                        />
                        {errors.user_id && <p className="text-xs text-red-600 mt-1">{errors.user_id.message}</p>}
                    </div>
                )}

                <div>
                    <label className="form-label">Status</label>
                    <select
                        {...statusReg}
                        className="form-control w-full !rounded-sm border  "
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
                        {errors.completed_at && (
                            <p className="text-xs text-red-600 mt-1">{errors.completed_at.message}</p>
                        )}
                    </div>
                )}

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
                            className="form-control w-full !rounded-sm border  "
                            {...register("total_time_seconds")}
                            value={watch("total_time_seconds") ?? 0}
                            onChange={(e) =>
                                setValue("total_time_seconds", Number(e.target.value) || 0, { shouldDirty: true })
                            }
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

                    <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium rounded-md ti-btn-primary-full"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : isEdit ? "Update" : "Create"}
                    </button>
                </div>
            </form>
        </div>
    );
}
