import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import { useNavigate } from "react-router-dom";
import { dateSchema } from "@helpers/schema.js";

export const boqTenderStatuses = [
        { value: "draft", label: "Draft" },
        { value: "open", label: "Open" },
        { value: "awarded", label: "Awarded" },
        { value: "cancelled", label: "Cancelled" },
];


const formSchema = z.object({
    boq: z.coerce.number().min(1, "BOQ is required"),
    title: z.string().min(1, "Tender title is required"),
    description: z.string().optional(),
    started_at: dateSchema("started_at"),
    ended_at: dateSchema("ended_at"),
    status: z.enum(["draft", "open"]),
    vendors: z.array(z.union([z.number(), z.string()])).min(1, "At least one vendor is required"),
    attachments: z.array(z.union([z.number(), z.string()])).optional(),
});

export function useCivilBoqTenderForm(editMode = false, tenderId = null) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(null);
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            boq: null,
            title: "",
            description: "",
            started_at: null,
            ended_at: null,
            status: "draft",
            vendors: [],
            attachments: [],
        },
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    useEffect(() => {
        if (editMode && tenderId) {
            (async () => {
                try {
                    const { data } = await api.get(`/civil/boq-tenders/${tenderId}/`);
                    form.reset(data.data);
                    setFormData(data.data);
                } catch (error) {
                    Notify.error("Failed to load tender data.");
                }
            })();
        }
    }, [editMode, tenderId]);

    const onSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const url = editMode && tenderId
                ? `/civil/boq-tenders/${tenderId}/`
                : `/civil/boq-tenders/`;
            const method = editMode && tenderId ? api.put : api.post;

            const { data } = await method(url, values);
            Notify.success(data.message || "Tender saved successfully");
            // navigate(`/module/civil/tenders`);
        } catch (error) {
            Notify.error(error.response?.data?.message || "Failed to save tender.");
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
        formData,
    };
}
