import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "@config/axiosConfig.js";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { COURSE_OFFERING_ROUTES } from "@modules/lms/routes.js";
import FormInput from "@components/form/FormInput.jsx";
import { toast } from "react-toastify";

const isoToLocalInput = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export default function CourseOfferingForm({
                                               showHeader = true,
                                               showBackButton = true,
                                           }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const isEdit = !!id;


    const preselectedCourseId = location?.state?.preselectedCourseId;

    const user = null;
    const isSuperuser = !!user?.is_superuser;

    const [loading, setLoading] = useState(false);
    const [initial, setInitial] = useState(null);

    const {
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm({
        defaultValues: {
            company_id: null,
            course_id: null,
            is_published: false,
            started_at: "",
            ended_at: "",
            allow_self_enroll: true,
        },
    });

    const startAt = watch("started_at");
    const endAt = watch("ended_at");

    // ✅ If create (not edit) and we have course from modal => set it
    useEffect(() => {
        if (isEdit) return;
        if (!preselectedCourseId) return;
        setValue("course_id", preselectedCourseId);
    }, [isEdit, preselectedCourseId, setValue]);

    // ✅ load edit data
    useEffect(() => {
        if (!isEdit) return;

        setLoading(true);
        api
            .get(`/lms/course-offerings/${id}/`)
            .then((res) => {
                const data = res?.data?.data ?? res?.data;
                setInitial(data);

                setValue("is_published", !!data.is_published);
                setValue("allow_self_enroll", !!data.allow_self_enroll);

                setValue("started_at", isoToLocalInput(data.started_at));
                setValue("ended_at", isoToLocalInput(data.ended_at));

                if (data?.course?.id) setValue("course_id", data.course.id);
                if (data?.company?.id) setValue("company_id", data.company.id);
            })
            .catch((err) => {
                const msg =
                    err?.response?.data?.message ||
                    (Array.isArray(err?.response?.data?.errors)
                        ? err.response.data.errors[0]
                        : null) ||
                    "Failed to load offering.";

                toast.error(msg);
            })
            .finally(() => setLoading(false));
    }, [id, isEdit, setValue]);

    // ✅ validate start/end
    useEffect(() => {
        if (!startAt || !endAt) return clearErrors("ended_at");

        const s = new Date(startAt);
        const e = new Date(endAt);

        if (e < s) {
            setError("ended_at", {
                type: "validate",
                message: "End date must be greater than or equal to start date.",
            });
        } else {
            clearErrors("ended_at");
        }
    }, [startAt, endAt, setError, clearErrors]);

    const onSubmit = async (values) => {
        const payload = {
            ...(isSuperuser && values.company_id ? { company_id: values.company_id } : {}),
            course_id: values.course_id,
            is_published: !!values.is_published,
            started_at: values.started_at ? values.started_at : null,
            ended_at: values.ended_at ? values.ended_at : null,
            allow_self_enroll: !!values.allow_self_enroll,
        };

        if (!payload.started_at) delete payload.started_at;
        if (!payload.ended_at) delete payload.ended_at;

        setLoading(true);
        try {
            if (isEdit) {
                await api.put(`/lms/course-offerings/${id}/`, payload);
                toast.success("Offering updated successfully.");
                navigate(COURSE_OFFERING_ROUTES.view(id));
            } else {
                const res = await api.post(`/lms/course-offerings/`, payload);
                const created = res?.data?.data ?? res?.data;
                toast.success("Offering created successfully.");
                navigate(COURSE_OFFERING_ROUTES.view(created.id));
            }
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                (Array.isArray(err?.response?.data?.errors)
                    ? err.response.data.errors[0]
                    : null) ||
                "Something went wrong.";

            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            {showHeader ? (
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-xl font-semibold">
                            {isEdit ? "Edit Offering" : "Create Offering"}
                        </h1>
                        <p className="text-sm text-gray-500">
                            Set publish rules, dates, and self-enroll access.
                        </p>
                    </div>

                    {showBackButton && (
                        <Link to={COURSE_OFFERING_ROUTES.list} className="ti-btn ti-btn-primary">
                            Back
                        </Link>
                    )}
                </div>
            ) : (
                showBackButton && (
                    <div className="flex justify-end mb-4">
                        <Link to={COURSE_OFFERING_ROUTES.list} className="ti-btn ti-btn-primary">
                            Back
                        </Link>
                    </div>
                )
            )}

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white rounded-2xl shadow-sm border p-4 space-y-4 dark:text-gray-200 dark:bg-bodybg"
            >
                {isSuperuser && (
                    <div>
                        <FormAsyncSelect
                            isMulti={false}
                            label="Company"
                            name="company_id"
                            control={control}
                            errors={errors}
                            placeholder="Search company..."
                            preselectedOptions={
                                initial?.company
                                    ? [{ value: initial.company.id, label: initial.company.name }]
                                    : []
                            }
                            allowSaveNewOption={false}
                            className="w-full"
                            apiUrl={`/select/core/companies/`}
                            queryKeyBase={`core_companies`}
                            needObject={false}
                            rules={{ required: false }}
                        />
                        {errors.company_id && (
                            <p className="text-xs text-red-600 mt-1">{errors.company_id.message}</p>
                        )}
                    </div>
                )}

                {/* ✅ ONE ROW: Course + Start + End */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Course */}
                    <div>
                        <FormAsyncSelect
                            isMulti={false}
                            label="Course *"
                            name="course_id"
                            control={control}
                            errors={errors}
                            placeholder="select a course"
                            preselectedOptions={
                                initial?.course
                                    ? [
                                        {
                                            value: initial.course.id,
                                            label: initial.course.title ?? `Course #${initial.course.id}`,
                                        },
                                    ]
                                    : preselectedCourseId
                                        ? [
                                            {
                                                value: preselectedCourseId,
                                                label: `Course #${preselectedCourseId}`,
                                            },
                                        ]
                                        : []
                            }
                            allowSaveNewOption={false}
                            className="w-full"
                            apiUrl={`/select/lms/courses/`}
                            queryKeyBase={`lms_courses_exclude_offered`}
                            isDisabled={isEdit}
                            needObject={false}
                            rules={{ required: "Please select a course" }}
                        />
                        {errors.course_id && (
                            <p className="text-xs text-red-600 mt-1">{errors.course_id.message}</p>
                        )}
                    </div>

                    {/* Start At */}
                    <div>
                        <FormInput
                            type="date"
                            name="started_at"
                            control={control}
                            errors={errors}
                            label={true}
                            placeholder="Start At"
                        />
                    </div>

                    {/* End At */}
                    <div>
                        <FormInput
                            type="date"
                            name="ended_at"
                            control={control}
                            errors={errors}
                            label={true}
                            placeholder="End At"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <label className="form-control w-full !rounded-sm border">
                        <input
                            type="checkbox"
                            className="h-4 w-4 mt-4 mr-2"
                            checked={!!watch("is_published")}
                            onChange={(e) => setValue("is_published", e.target.checked)}
                        />
                        <div>
                            <div className="text-sm font-medium">Published</div>
                            <div className="text-xs text-gray-500">Visible/available to users.</div>
                        </div>
                    </label>

                    <label className="form-control w-full !rounded-sm border">
                        <input
                            type="checkbox"
                            className="h-4 w-4 mt-4 mr-2"
                            checked={!!watch("allow_self_enroll")}
                            onChange={(e) => setValue("allow_self_enroll", e.target.checked)}
                        />
                        <div>
                            <div className="text-sm font-medium">Allow Self Enroll</div>
                            <div className="text-xs text-gray-500">Users can enroll themselves.</div>
                        </div>
                    </label>
                </div>

                {/* ✅ End date validation message (if you want explicit under row) */}
                {errors.ended_at && (
                    <p className="text-xs text-red-600 -mt-2">{errors.ended_at.message}</p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                        type="button"
                        className="ti-btn ti-btn-primary"
                        onClick={() => navigate(COURSE_OFFERING_ROUTES.list)}
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
