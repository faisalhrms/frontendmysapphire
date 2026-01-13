// @modules/requisition/components/interviews/RequisitionInterviewCompleteModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@modules/inventory/models/components/Modal.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormButton from "@components/form/FormButton.jsx";
import Notify from "@helpers/toastNotifications.js";

import { requisitionInterviewCompleteSchema } from "@modules/requisition/schemas/requisitionInterviewCompleteSchema.js";
import { Info, ClipboardCheck, Star } from "lucide-react";
import { useRequisitionInterviewActions } from "../hooks/requisitionInterviewHooks.js";

const DEFAULTS = {
    communication: 0,
    cultural_fit: 0,
    technical_expertise: 0,
    functional_expertise: 0,
    leadership: 0,
    recommendation: "recommended",
    remarks: "",
};

/**
 * Star rating with half-steps (0.5 increments)
 * - Click left half => n - 0.5
 * - Click right half => n
 */
const StarRating = ({ value = 0, onChange, disabled = false, size = 22 }) => {
    const v = Number(value || 0);

    const setVal = (next) => {
        if (disabled) return;
        const clamped = Math.max(0, Math.min(5, Number(next)));
        // keep .0/.5 only
        const rounded = Math.round(clamped * 2) / 2;
        onChange?.(rounded);
    };

    return (
        <div className="inline-flex items-center gap-1 select-none">
            {[1, 2, 3, 4, 5].map((i) => {
                const fill = Math.max(0, Math.min(1, v - (i - 1))); // 0..1
                const fillPct = `${fill * 100}%`;

                return (
                    <div key={i} className="relative inline-flex" style={{ width: size, height: size }}>
                        {/* base outline */}
                        <Star
                            size={size}
                            className={`text-gray-300 ${disabled ? "opacity-60" : ""}`}
                            strokeWidth={2}
                        />

                        {/* filled overlay (partial allowed) */}
                        <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: fillPct }}
                        >
                            <Star
                                size={size}
                                className={`${disabled ? "opacity-60" : ""} text-amber-500`}
                                fill="currentColor"
                                stroke="currentColor"
                                strokeWidth={2}
                            />
                        </div>

                        {/* left half click */}
                        <button
                            type="button"
                            className="absolute left-0 top-0 h-full w-1/2 cursor-pointer"
                            disabled={disabled}
                            onClick={() => setVal(i - 0.5)}
                            aria-label={`Set rating to ${i - 0.5}`}
                        />

                        {/* right half click */}
                        <button
                            type="button"
                            className="absolute right-0 top-0 h-full w-1/2 cursor-pointer"
                            disabled={disabled}
                            onClick={() => setVal(i)}
                            aria-label={`Set rating to ${i}`}
                        />
                    </div>
                );
            })}

            {/* numeric hint */}
            <span className="ms-2 text-sm text-gray-600 dark:text-white/50">
        {v.toFixed(1)}
      </span>

            {/* reset */}
            {!disabled && (
                <button
                    type="button"
                    className="ms-2 text-xs text-primary underline"
                    onClick={() => setVal(0)}
                >
                    Reset
                </button>
            )}
        </div>
    );
};

const StarRatingField = ({ control, name, label, errors, required = true }) => {
    const err = errors?.[name]?.message;

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                <label className="form-label mb-1">
                    {label} {required ? <span className="text-danger">*</span> : null}
                </label>
            </div>

            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <StarRating
                        value={field.value}
                        onChange={(val) => field.onChange(val)}
                    />
                )}
            />

            {err ? <p className="text-danger text-xs mt-1">{err}</p> : null}
        </div>
    );
};

const RequisitionInterviewCompleteModal = ({
                                               isOpen,
                                               onClose,
                                               requisitionId,
                                               applicationId,
                                               interviewData,
                                               onSuccess,
                                           }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const recommendationOptions = useMemo(
        () => [
            { value: "recommended", label: "Recommended" },
            { value: "not_recommended", label: "Not Recommended" },
        ],
        []
    );

    const { completeInterview } = useRequisitionInterviewActions(requisitionId, applicationId);

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(requisitionInterviewCompleteSchema),
        defaultValues: DEFAULTS,
    });

    const watched = useWatch({ control });
    const overallPreview = useMemo(() => {
        const vals = [
            Number(watched?.communication ?? 0),
            Number(watched?.cultural_fit ?? 0),
            Number(watched?.technical_expertise ?? 0),
            Number(watched?.functional_expertise ?? 0),
            Number(watched?.leadership ?? 0),
        ];
        const avg = vals.reduce((a, b) => a + b, 0) / 5;
        return Number.isFinite(avg) ? (Math.round(avg * 100) / 100).toFixed(2) : "0.00";
    }, [
        watched?.communication,
        watched?.cultural_fit,
        watched?.technical_expertise,
        watched?.functional_expertise,
        watched?.leadership,
    ]);

    useEffect(() => {
        if (!isOpen) return;
        reset(DEFAULTS);
    }, [isOpen, reset]);

    // scroll lock
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.width = "100%";
        } else {
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        }
        return () => {
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const onSubmit = async (values) => {
        if (!requisitionId || !applicationId || !interviewData?.id) {
            Notify.error("Missing requisition/application/interview id");
            return;
        }

        setIsSubmitting(true);
        try {
            // ✅ New backend payload (flat)
            const payload = {
                communication: Number(values.communication),
                cultural_fit: Number(values.cultural_fit),
                technical_expertise: Number(values.technical_expertise),
                functional_expertise: Number(values.functional_expertise),
                leadership: Number(values.leadership),
                recommendation: values.recommendation,
                remarks: values.remarks || "",
            };

            const res = await completeInterview(interviewData.id, payload);

            Notify.success("Feedback submitted successfully.");
            onSuccess?.(res);
            onClose?.();
        } catch (e) {
            Notify.error(e?.response?.data?.message || e?.message || "Failed to submit feedback.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Complete Interview" width="max-w-4xl">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="box flex flex-col max-h-[calc(100vh-12rem)]">
                    {/* SCROLL AREA */}
                    <div className="box-body flex-1 overflow-y-auto">
                        {/* info card */}
                        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                            <div className="flex items-start gap-2">
                <span className="text-amber-700 mt-0.5">
                  <Info size={16} />
                </span>

                                <div className="flex-1">
                                    <p className="text-sm font-semibold mb-0 text-amber-800">
                                        Submit structured interview feedback
                                    </p>
                                    <p className="text-sm mt-1 mb-0 text-amber-800">
                                        Use star ratings (supports half stars). Below is the Overall rating.
                                    </p>

                                    <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-amber-200">
                                        <span className="text-xs font-semibold text-amber-800">Overall (Preview)</span>
                                        <span className="text-xs text-amber-900">{overallPreview}</span>
                                    </div>
                                </div>

                                <span className="text-amber-700 mt-0.5">
                  <ClipboardCheck size={16} />
                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-4">
                            {/* Stars */}
                            <div className="xl:col-span-6 col-span-12">
                                <StarRatingField
                                    control={control}
                                    name="communication"
                                    label="Communication"
                                    errors={errors}
                                />
                            </div>

                            <div className="xl:col-span-6 col-span-12">
                                <StarRatingField
                                    control={control}
                                    name="cultural_fit"
                                    label="Cultural Fit"
                                    errors={errors}
                                />
                            </div>

                            <div className="xl:col-span-6 col-span-12">
                                <StarRatingField
                                    control={control}
                                    name="technical_expertise"
                                    label="Technical Expertise"
                                    errors={errors}
                                />
                            </div>

                            <div className="xl:col-span-6 col-span-12">
                                <StarRatingField
                                    control={control}
                                    name="functional_expertise"
                                    label="Functional Expertise"
                                    errors={errors}
                                />
                            </div>

                            <div className="xl:col-span-6 col-span-12">
                                <StarRatingField
                                    control={control}
                                    name="leadership"
                                    label="Leadership"
                                    errors={errors}
                                />
                            </div>

                            {/* Recommendation */}
                            <div className="xl:col-span-6 col-span-12">
                                <FormSelect
                                    name="recommendation"
                                    control={control}
                                    errors={errors}
                                    placeholder="Select recommendation"
                                    options={recommendationOptions}
                                    is_required={true}
                                    label="Recommendation"
                                />
                            </div>

                            {/* Remarks */}
                            <div className="col-span-12">
                                <FormTextarea
                                    name="remarks"
                                    control={control}
                                    errors={errors}
                                    placeholder="Write remarks (optional)"
                                    rows={3}
                                    label="Remarks"
                                />
                            </div>
                        </div>
                    </div>

                    {/* FIXED FOOTER */}
                    <div className="shrink-0 px-6 py-4 border-t border-dashed sm:flex justify-end gap-3 bg-white dark:bg-bodybg">
                        <button type="button" onClick={onClose} className="ti-btn ti-btn-light ti-btn-wave">
                            Cancel
                        </button>
                        <FormButton isLoading={isSubmitting} text="Submit Feedback" className="ti-btn-success" />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

RequisitionInterviewCompleteModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    requisitionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    applicationId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    interviewData: PropTypes.object.isRequired,
    onSuccess: PropTypes.func,
};

export default RequisitionInterviewCompleteModal;
