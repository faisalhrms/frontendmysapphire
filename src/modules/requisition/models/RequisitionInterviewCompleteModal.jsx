// @modules/requisition/components/interviews/RequisitionInterviewCompleteModal.jsx
import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@modules/inventory/models/components/Modal.jsx";
import FormInput from "@components/form/FormInput.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import FormButton from "@components/form/FormButton.jsx";
import Notify from "@helpers/toastNotifications.js";

import { requisitionInterviewCompleteSchema } from "@modules/requisition/schemas/requisitionInterviewCompleteSchema.js";
import { Info, PlusCircle, Trash2, ClipboardCheck } from "lucide-react";
import { useRequisitionInterviewActions } from "../hooks/requisitionInterviewHooks.js";

const DEFAULTS = {
    interviewer_rating: 0,
    interviewer_notes: "",
    outcome: "pass",
    feedback_items: [{ key: "communication", score: 0 }],
    feedback_notes: "",
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

    const outcomeOptions = useMemo(
        () => [
            { value: "pass", label: "Pass" },
            { value: "fail", label: "Fail" },
            { value: "hold", label: "Hold" },
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

    const { fields, append, remove } = useFieldArray({
        control,
        name: "feedback_items",
    });

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
            // ✅ Build rubric (new API format)
            const rubric = {};
            (values.feedback_items || []).forEach((it) => {
                const k = String(it?.key || "").trim();
                if (!k) return;
                rubric[k] = Number(it?.score ?? 0);
            });

            // ✅ feedback payload must be: { rubric: {...} }
            const feedback = { rubric };
            const note = String(values.feedback_notes || "").trim();
            if (note) feedback.notes = note; // (optional) safe extra info if backend ignores/accepts

            const payload = {
                interviewer_rating: Number(values.interviewer_rating),
                interviewer_notes: values.interviewer_notes || "",
                outcome: values.outcome,
                feedback,
            };

            const res = await completeInterview(interviewData.id, payload);

            Notify.success("Interview completed successfully.");
            onSuccess?.(res);
            onClose?.();
        } catch (e) {
            Notify.error(e?.response?.data?.message || e?.message || "Failed to complete interview.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Complete Interview" width="max-w-4xl">
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* ✅ fixed height container + scrollable body + fixed footer */}
                <div className="box flex flex-col max-h-[calc(100vh-12rem)]">
                    {/* ✅ SCROLL AREA */}
                    <div className="box-body flex-1 overflow-y-auto">
                        {/* info card */}
                        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                            <div className="flex items-start gap-2">
                                <span className="text-amber-700 mt-0.5">
                                    <Info size={16} />
                                </span>

                                <div className="flex-1">
                                    <p className="text-sm font-semibold mb-0 text-amber-800">
                                        Add interview rating and remarks
                                    </p>
                                    <p className="text-sm mt-1 mb-0 text-amber-800">
                                        Add scoring items (this will be sent as <span className="font-semibold">feedback.rubric</span>).
                                    </p>
                                </div>

                                <span className="text-amber-700 mt-0.5">
                                    <ClipboardCheck size={16} />
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-12 gap-4">
                            {/* rating */}
                            <div className="xl:col-span-6 col-span-12">
                                <FormInput
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    max="5"
                                    name="interviewer_rating"
                                    control={control}
                                    errors={errors}
                                    placeholder="Rating"
                                    is_required={true}
                                    label="Interviewer Rating (0-5)"
                                />
                            </div>

                            {/* outcome */}
                            <div className="xl:col-span-6 col-span-12">
                                <FormSelect
                                    name="outcome"
                                    control={control}
                                    errors={errors}
                                    placeholder="Outcome"
                                    options={outcomeOptions}
                                    is_required={true}
                                    label="Outcome"
                                />
                            </div>

                            {/* notes */}
                            <div className="col-span-12">
                                <FormTextarea
                                    name="interviewer_notes"
                                    control={control}
                                    errors={errors}
                                    placeholder="Write Remarks"
                                    rows={3}
                                    label="Interviewer Notes"
                                />
                            </div>

                            {/* scoring */}
                            <div className="col-span-12">
                                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                                    <p className="font-semibold mb-0">Rubric Scoring</p>

                                    <button
                                        type="button"
                                        className="ti-btn ti-btn-secondary ti-btn-md ti-btn-wave whitespace-nowrap"
                                        onClick={() => append({ key: "", score: 0 })}
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            <PlusCircle size={16} />
                                            Add Score
                                        </span>
                                    </button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                Criteria
                                            </th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                Score (0-5)
                                            </th>
                                            <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                                Action
                                            </th>
                                        </tr>
                                        </thead>

                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {fields.map((f, idx) => (
                                            <tr key={f.id}>
                                                <td className="px-3 py-2 align-top">
                                                    <FormInput
                                                        label={false}
                                                        name={`feedback_items.${idx}.key`}
                                                        control={control}
                                                        errors={errors}
                                                        placeholder="e.g. React"
                                                        className="w-full"
                                                    />
                                                </td>

                                                <td className="px-3 py-2 align-top">
                                                    <FormInput
                                                        label={false}
                                                        type="number"
                                                        min="0"
                                                        max="5"
                                                        step="0.5"
                                                        name={`feedback_items.${idx}.score`}
                                                        control={control}
                                                        errors={errors}
                                                        placeholder="0 - 5"
                                                        className="w-full max-w-[160px]"
                                                    />
                                                </td>

                                                <td className="px-3 py-2 text-right align-top">
                                                    <button
                                                        type="button"
                                                        className="ti-btn ti-btn-danger ti-btn-sm ti-btn-wave !px-2.5 !py-2"
                                                        title="Remove"
                                                        onClick={() => remove(idx)}
                                                        disabled={fields.length === 1}
                                                    >
                                                            <span className="inline-flex items-center justify-center">
                                                                <Trash2 size={16} />
                                                            </span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-3">
                                    <FormTextarea
                                        name="feedback_notes"
                                        control={control}
                                        errors={errors}
                                        placeholder='FeedBack'
                                        rows={2}
                                        label="Additional Note"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ✅ FIXED FOOTER (no scroll) */}
                    <div className="shrink-0 px-6 py-4 border-t border-dashed sm:flex justify-end gap-3 bg-white dark:bg-bodybg">
                        <button type="button" onClick={onClose} className="ti-btn ti-btn-light ti-btn-wave">
                            Cancel
                        </button>
                        <FormButton isLoading={isSubmitting} text="Complete Interview" className="ti-btn-success" />
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
