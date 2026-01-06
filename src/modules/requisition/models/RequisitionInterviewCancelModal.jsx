import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from "@modules/inventory/models/components/Modal.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import Notify from "@helpers/toastNotifications.js";

import { requisitionInterviewCancelSchema } from "@modules/requisition/schemas/requisitionInterviewCancelSchema.js";
import { CalendarX, Info } from "lucide-react";
import {useRequisitionInterviewActions} from "../hooks/requisitionInterviewHooks.js";

const DEFAULTS = {
    cancel_reason: "",
};

const RequisitionInterviewCancelModal = ({
                                             isOpen,
                                             onClose,
                                             requisitionId,
                                             applicationId,
                                             interviewData,
                                             onSuccess,
                                         }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { cancelInterview } = useRequisitionInterviewActions(requisitionId, applicationId);

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(requisitionInterviewCancelSchema),
        defaultValues: DEFAULTS,
    });

    useEffect(() => {
        if (!isOpen) return;
        reset(DEFAULTS);
    }, [isOpen, reset]);

    // scroll lock (match your other modals)
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
            const payload = { cancel_reason: values.cancel_reason };

            const res = await cancelInterview(interviewData.id, payload);

            Notify.success("Interview cancelled successfully.");
            onSuccess?.(res);
            onClose?.();
        } catch (e) {
            Notify.error(e?.response?.data?.message || e?.message || "Failed to cancel interview.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Cancel Interview" width="max-w-3xl">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="box">
                    <div className="box-body">
                        {/* top info card */}
                        <div className="mb-4 p-3 !bg-amber-50 border border-amber-200 rounded-md">
                            <div className="flex items-start gap-2">
                <span className="text-amber-700 mt-0.5">
                  <Info size={16} />
                </span>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold mb-0 text-amber-900">Provide a cancellation reason</p>
                                    <p className="text-sm mt-1 mb-0 text-amber-800">
                                        This will mark the interview as cancelled.
                                    </p>
                                </div>
                                <span className="text-amber-700">
                  <CalendarX size={16} />
                </span>
                            </div>
                        </div>

                        <FormTextarea
                            name="cancel_reason"
                            control={control}
                            errors={errors}
                            placeholder="Candidate requested reschedule next week..."
                            rows={4}
                            is_required={true}
                            label="Cancel Reason"
                        />
                    </div>

                    <div className="px-6 py-4 border-t border-dashed sm:flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="ti-btn ti-btn-light ti-btn-wave">
                            Close
                        </button>
                        <FormButton isLoading={isSubmitting} text="Cancel Interview" className="ti-btn-danger" />
                    </div>
                </div>
            </form>
        </Modal>
    );
};

RequisitionInterviewCancelModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    requisitionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    applicationId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    interviewData: PropTypes.object.isRequired,
    onSuccess: PropTypes.func,
};

export default RequisitionInterviewCancelModal;
