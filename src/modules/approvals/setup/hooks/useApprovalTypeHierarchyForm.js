import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
    approval_type: z.coerce.number().min(1, "Approval Type is required"),
    company: z.coerce.number().nullable(),
    department: z.coerce.number().nullable(),
});

export function useApprovalTypeHierarchyForm(editMode = false, approvalTypeId = null) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(null);
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            approval_type: null,
            company: null,
            department: null,
        },
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    useEffect(() => {
        if (editMode && approvalTypeId) {
            (async () => {
                try {
                    const { data } = await api.get(`/approvals/hierarchy/${approvalTypeId}/`);
                    setFormData(data.data)
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
                ? `/approvals/hierarchy/${approvalTypeId}/`
                : `/approvals/hierarchy/`;

            const method = editMode && approvalTypeId ? api.put : api.post;

            const { data } = await method(url, values);
            Notify.success(data.message || "Approval Type saved successfully");
            navigate(`/module/approvals/setups/hierarchy`);
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
        formData
    };
}
