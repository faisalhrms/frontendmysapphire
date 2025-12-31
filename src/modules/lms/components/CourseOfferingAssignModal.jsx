import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";

export default function CourseOfferingAssignModal({
                                                      open,
                                                      onClose,
                                                      onSubmit, // ✅ parent must pass this
                                                      defaultValues = {
                                                          offering_id: null,
                                                          user_ids: [],
                                                          score: "",
                                                          total_time_seconds: 0,
                                                      },
                                                  }) {
    const {
        handleSubmit,
        control,
        register,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues,
    });

    // ✅ IMPORTANT: reset only ONCE when modal opens
    const didInitRef = useRef(false);

    useEffect(() => {
        if (open && !didInitRef.current) {
            didInitRef.current = true;
            reset({
                offering_id: defaultValues?.offering_id ?? null,
                user_ids: Array.isArray(defaultValues?.user_ids) ? defaultValues.user_ids : [],
                score: defaultValues?.score ?? "",
                total_time_seconds: Number(defaultValues?.total_time_seconds ?? 0),
            });
        }
        if (!open) {
            didInitRef.current = false; // reset flag when modal closes
        }
    }, [open, reset]); // ✅ removed defaultValues from deps

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-3xl rounded-2xl bg-white p-4 shadow-lg dark:bg-bodybg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Assign Course enrollment</h2>
                    <button className="ti-btn ti-btn-light ti-btn-sm" onClick={onClose} type="button">
                        <i className="ri-close-line" />
                    </button>
                </div>

                {/* ✅ IMPORTANT: onSubmit must exist */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <FormAsyncSelect
                            isMulti={false}
                            label="Course Offering *"
                            name="offering_id"
                            control={control}
                            errors={errors}
                            placeholder="course offering..."
                            allowSaveNewOption={false}
                            className="w-full"
                            apiUrl={`/select/lms/course-offerings/?published=true&active_now=true`}
                            queryKeyBase="lms_course_offerings_active"
                            needObject={false}
                            rules={{ required: "Course Offering is required" }}
                        />
                        {errors.offering_id && (
                            <p className="text-xs text-red-600 mt-1">{errors.offering_id.message}</p>
                        )}
                    </div>

                    <div>
                        <FormAsyncSelect
                            isMulti={true}
                            label="Target Users *"
                            name="user_ids"
                            control={control}
                            errors={errors}
                            placeholder="Search users..."
                            allowSaveNewOption={false}
                            className="w-full"
                            apiUrl={`/select/users`}
                            queryKeyBase="core_users"
                            needObject={false}
                            rules={{ required: "At least one user is required" }}
                        />
                        {errors.user_ids && (
                            <p className="text-xs text-red-600 mt-1">{errors.user_ids.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="form-label">Score (optional)</label>
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
                                onChange={(e) =>
                                    setValue("total_time_seconds", Number(e.target.value) || 0, { shouldDirty: true })
                                }
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3">
                        <button type="button" className="ti-btn ti-btn-light" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="ti-btn ti-btn-primary-full">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
