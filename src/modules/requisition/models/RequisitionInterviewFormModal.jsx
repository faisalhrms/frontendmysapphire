// @modules/requisition/components/interviews/RequisitionInterviewFormModal.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@modules/inventory/models/components/Modal.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";

import { requisitionInterviewSchema } from "@modules/requisition/schemas/requisitionInterviewSchema.js";
import { useRequisitionInterviewForm } from "@modules/requisition/hooks/requisitionInterviewHooks.js";
import Notify from "@helpers/toastNotifications.js";
import { RefreshCcw, AlertTriangle } from "lucide-react";
import {useSelector} from "react-redux";

const isoToDateTimeLocal = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
        d.getMinutes()
    )}`;
};

// ✅ Keep it simple: Asia/Karachi is +05:00 (no DST)
const toApiScheduledAt = (datetimeLocal, timezone) => {
    if (!datetimeLocal) return null;
    if (timezone === "Asia/Karachi") return `${datetimeLocal}:00+05:00`;
    return new Date(datetimeLocal).toISOString();
};

const uniq = (arr) => Array.from(new Set((arr || []).filter(Boolean)));

const DEFAULTS = {
    round: "round_1", // ✅ UPDATED DEFAULT
    interview_type: "online",
    scheduled_at_local: "",
    duration_minutes: 30,
    timezone: "Asia/Karachi",
    link_or_location: "",
    interviewer_ids: [], // ✅ MULTI
};

const RequisitionInterviewFormModal = ({
                                           isOpen,
                                           onClose,
                                           requisitionId,
                                           applicationId,
                                           interviewData,
                                           onSuccess,
                                       }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const companyId = useSelector((state) => state?.auth?.user?.employee?.company?.id);
    const isEditMode = Boolean(interviewData?.id);
    const originalScheduledAtRef = useRef("");
    const usersApiUrl = useMemo(() => {
        const base = "/select/users/";
        if (!companyId) return base;
        return `${base}?company_id=${encodeURIComponent(companyId)}`;
    }, [companyId]);
    // ✅ UPDATED: rounds are round_1 ... round_4
    const roundOptions = useMemo(
        () => [
            { value: "round_1", label: "Round 1" },
            { value: "round_2", label: "Round 2" },
            { value: "round_3", label: "Round 3" },
            { value: "round_4", label: "Round 4" },
        ],
        []
    );

    const typeOptions = useMemo(
        () => [
            { value: "online", label: "Online" },
            { value: "onsite", label: "Onsite" },
        ],
        []
    );

    const timezoneOptions = useMemo(() => [{ value: "Asia/Karachi", label: "Asia/Karachi" }], []);

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(requisitionInterviewSchema),
        defaultValues: DEFAULTS,
    });

    const interviewType = useWatch({ control, name: "interview_type" });
    const tz = useWatch({ control, name: "timezone" });
    const scheduledAtLocal = useWatch({ control, name: "scheduled_at_local" });

    const { createInterview, updateInterview } = useRequisitionInterviewForm(requisitionId, applicationId);

    // ✅ Build preselected options from interviewData.panel
    const preselectedInterviewers = useMemo(() => {
        if (!isEditMode) return [];

        const panel = Array.isArray(interviewData?.panel) ? interviewData.panel : [];
        if (panel.length) {
            return panel
                .map((p) => {
                    const u = p?.interviewer || null;
                    const id = p?.interviewer_id ?? u?.id;
                    if (!id) return null;
                    const label = [u?.full_name, u?.email].filter(Boolean).join(" • ") || `User #${id}`;
                    return { value: id, label };
                })
                .filter(Boolean);
        }

        // fallback (older response shape)
        const fallbackId = interviewData?.interviewer_id ?? interviewData?.interviewer?.id ?? null;
        if (!fallbackId) return [];
        const u = interviewData?.interviewer || null;
        const label = [u?.full_name, u?.email].filter(Boolean).join(" • ") || `User #${fallbackId}`;
        return [{ value: fallbackId, label }];
    }, [isEditMode, interviewData]);

    // ✅ Prefill (create vs edit)
    useEffect(() => {
        if (!isOpen) return;

        if (isEditMode) {
            const panel = Array.isArray(interviewData?.panel) ? interviewData.panel : [];
            const panelIds = panel.map((p) => p?.interviewer_id ?? p?.interviewer?.id).filter(Boolean);

            const fallbackId = interviewData?.interviewer_id ?? interviewData?.interviewer?.id ?? null;

            const next = {
                round: interviewData?.round ?? DEFAULTS.round,
                interview_type: interviewData?.interview_type ?? DEFAULTS.interview_type,
                scheduled_at_local: isoToDateTimeLocal(interviewData?.scheduled_at),
                duration_minutes: interviewData?.duration_minutes ?? DEFAULTS.duration_minutes,
                timezone: interviewData?.timezone ?? DEFAULTS.timezone,
                link_or_location: interviewData?.link_or_location ?? "",
                interviewer_ids: uniq(panelIds.length ? panelIds : fallbackId ? [fallbackId] : []), // ✅ MULTI
            };

            originalScheduledAtRef.current = next.scheduled_at_local || "";
            reset(next);
        } else {
            originalScheduledAtRef.current = "";
            reset(DEFAULTS);
        }
    }, [isOpen, isEditMode, interviewData, reset]);

    const isRescheduling =
        isEditMode &&
        Boolean(originalScheduledAtRef.current) &&
        String(scheduledAtLocal || "") !== String(originalScheduledAtRef.current || "");

    const linkPlaceholder = interviewType === "online" ? "Google Meet / Zoom link" : "Office address / Location";

    const onSubmit = async (values) => {
        if (!requisitionId || !applicationId) {
            Notify.error("Missing requisitionId/applicationId");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                round: values.round,
                interview_type: values.interview_type,
                scheduled_at: toApiScheduledAt(values.scheduled_at_local, values.timezone),
                duration_minutes: Number(values.duration_minutes),
                timezone: values.timezone,
                link_or_location: (values.link_or_location || "").trim(),
                interviewer_ids: uniq(values.interviewer_ids || []), // ✅ MULTI
            };

            const res = isEditMode ? await updateInterview(interviewData.id, payload) : await createInterview(payload);

            if (isEditMode) {
                Notify.success(isRescheduling ? "Interview rescheduled successfully." : "Interview updated successfully.");
            } else {
                Notify.success("Interview scheduled successfully.");
            }

            onSuccess?.(res);
            onClose?.();
        } catch (e) {
            Notify.error(e?.response?.data?.message || e?.message || "Failed to save interview.");
        } finally {
            setIsSubmitting(false);
        }
    };

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

    const title = isEditMode ? "Update / Reschedule Interview" : "Schedule Interview";
    const submitText = isEditMode ? (isRescheduling ? "Reschedule Interview" : "Update Interview") : "Schedule Interview";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} width="max-w-4xl">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-12 gap-x-6">
                    <div className="col-span-12">
                        <div className="box">
                            {isEditMode && (
                                <div
                                    className={`mb-4 p-3 rounded-md border ${
                                        isRescheduling ? "bg-amber-50 border-amber-200" : "bg-yellow-50 border-yellow-200"
                                    }`}
                                >
                                    <div className="flex items-start gap-2">
                                        <span className={`${isRescheduling ? "text-amber-700" : "text-yellow-700"} mt-0.5`}>
                                            {isRescheduling ? <AlertTriangle size={16} /> : <RefreshCcw size={16} />}
                                        </span>

                                        <div className="flex-1">
                                            <p
                                                className={`text-sm font-semibold mb-0 ${
                                                    isRescheduling ? "text-amber-900" : "text-yellow-900"
                                                }`}
                                            >
                                                {isRescheduling ? "Reschedule will be applied" : "Updating interview"}
                                            </p>

                                            <p
                                                className={`text-sm mt-1 mb-0 ${
                                                    isRescheduling ? "text-amber-800" : "text-yellow-800"
                                                }`}
                                            >
                                                Changing <span className="font-semibold">Scheduled At</span> will mark this interview as{" "}
                                                <span className="font-semibold">Rescheduled</span>. Other fields will update the existing interview.
                                            </p>
                                        </div>

                                        {isRescheduling && (
                                            <span className="badge !rounded-full bg-warning/10 text-warning">Rescheduling</span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="box-body">
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="xl:col-span-4 col-span-12">
                                        <FormSelect
                                            name="round"
                                            control={control}
                                            errors={errors}
                                            placeholder="Round"
                                            options={roundOptions}
                                            is_required
                                            label="Round"
                                        />
                                    </div>

                                    <div className="xl:col-span-4 col-span-12">
                                        <FormSelect
                                            name="interview_type"
                                            control={control}
                                            errors={errors}
                                            placeholder="Interview Type"
                                            options={typeOptions}
                                            is_required
                                            label="Interview Type"
                                        />
                                    </div>

                                    <div className="xl:col-span-4 col-span-12">
                                        <FormSelect
                                            name="timezone"
                                            control={control}
                                            errors={errors}
                                            placeholder="Timezone"
                                            options={timezoneOptions}
                                            is_required
                                            label="Timezone"
                                        />
                                    </div>

                                    <div className="xl:col-span-6 col-span-12">
                                        <FormInput
                                            type="datetime-local"
                                            name="scheduled_at_local"
                                            control={control}
                                            errors={errors}
                                            placeholder="Scheduled At"
                                            is_required
                                            label="Scheduled At"
                                        />
                                        <p className="text-xs text-[#8c9097] dark:text-white/50 mt-1">
                                            Timezone: <span className="font-semibold">{tz || "—"}</span>
                                        </p>
                                    </div>

                                    <div className="xl:col-span-6 col-span-12">
                                        <FormInput
                                            type="number"
                                            name="duration_minutes"
                                            control={control}
                                            errors={errors}
                                            placeholder="Duration (minutes)"
                                            min="5"
                                            step="5"
                                            is_required
                                            label="Duration (minutes)"
                                        />
                                    </div>

                                    {/* ✅ MULTI interviewers */}
                                    <div className="xl:col-span-12 col-span-12">
                                        <FormAsyncSelect
                                            name="interviewer_ids"
                                            control={control}
                                            errors={errors}
                                            placeholder="Interviewers"
                                            apiUrl={usersApiUrl}                 // ✅ now filtered by company_id
                                            queryKeyBase={`users-${companyId || "all"}`} // ✅ avoids cache collisions
                                            clientSideSearch={false}
                                            is_required={true}
                                            isMulti={true}
                                            closeMenuOnSelect={true}
                                            preselectedOptions={preselectedInterviewers}
                                        />

                                        <p className="text-xs text-[#8c9097] dark:text-white/50 mt-1">
                                            Select one or more interviewers for the panel.
                                        </p>
                                    </div>

                                    <div className="xl:col-span-12 col-span-12">
                                        <FormTextarea
                                            name="link_or_location"
                                            control={control}
                                            errors={errors}
                                            placeholder={linkPlaceholder}
                                            rows={3}
                                            is_required={true}
                                            label={interviewType === "online" ? "Meeting Link" : "Location"}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-dashed sm:flex justify-end gap-3">
                                <button type="button" onClick={onClose} className="ti-btn ti-btn-light ti-btn-wave">
                                    Cancel
                                </button>
                                <FormButton isLoading={isSubmitting} text={submitText} className="ti-btn-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

RequisitionInterviewFormModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    requisitionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    applicationId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    interviewData: PropTypes.object,
    onSuccess: PropTypes.func,
};

export default RequisitionInterviewFormModal;
