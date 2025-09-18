import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
    code: z.string().min(1, "Code is required"),
    label: z.string().min(1, "Label is required"),
    description: z.string().optional(),

    detail_page_url: z.string().min(1, "Detail page URL is required"),
    approval_page_url: z.string().optional(),

    notify_requester: z.boolean(),
    notify_on_all_actions: z.boolean(),

    sla_hours: z.union([z.number(), z.null()]).optional(),
    escalation_type: z.enum(["none", "next_level", "custom"]),

    reminder_enabled: z.boolean(),
    reminder_interval_hours: z.union([z.number(), z.null()]).optional(),
    reminder_max_days: z.union([z.number(), z.null()]).optional(),

    is_active: z.boolean(),
});

export function useApprovalTypeForm(editMode = false, approvalTypeId = null) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            code: "",
            label: "",
            description: "",
            detail_page_url: "",
            approval_page_url: "",
            notify_requester: true,
            notify_on_all_actions: false,
            sla_hours: null,
            escalation_type: "none",
            reminder_enabled: false,
            reminder_interval_hours: null,
            reminder_max_days: null,
            is_active: true,
        },
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    useEffect(() => {
        if (editMode && approvalTypeId) {
            (async () => {
                try {
                    const { data } = await api.get(`/approvals/type/${approvalTypeId}/`);
                    form.reset(data.data);
                } catch (error) {
                    Notify.error("Failed to load Approval Type.");
                }
            })();
        }
    }, [editMode, approvalTypeId]);

    const onSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const url = editMode && approvalTypeId
                ? `/approvals/type/${approvalTypeId}/`
                : `/approvals/type/`;

            const method = editMode && approvalTypeId ? api.put : api.post;

            const { data } = await method(url, values);
            Notify.success(data.message || "Approval Type saved successfully");
            navigate(`/module/approvals/setups/type`);
        } catch (error) {
            Notify.error(error.response?.data?.message || "Failed to save Approval Type.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        control: form.control,
        handleSubmit: form.handleSubmit,
        errors: form.formState.errors,
        isSubmitting,
        onSubmit,
    };
}
