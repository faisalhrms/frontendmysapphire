import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import { useNavigate } from "react-router-dom";
import { dateSchema } from "@helpers/schema.js";

export const projectCurrency = [
    { value: 'PKR', label: 'Pakistani Rupee (PKR)' },
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'AED', label: 'UAE Dirham (AED)' },
];

const formSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().min(1, "Description is required"),
    status: z.string().min(1, "Status is required"),
    priority: z.string().min(1, "Priority is required"),
    started_at: dateSchema("started_at"),
    ended_at: dateSchema("ended_at", true),
    manager: z.number().min(1, "Manager is required"),
    users: z.array(z.number()).min(1, "At least one member is required"),
    site: z.number().min(1, "Site is required"),
    type: z.number().min(1, "Type is required"),
    estimated_budget: z
        .number({ invalid_type_error: "Budget must be a number" })
        .min(0, "Budget cannot be negative")
        .optional(),
    currency: z.string().optional(),
    attachments: z.array(z.union([z.number(), z.string()])).optional(),
});


export function useCivilProjectForm(editMode = false, projectId = null) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(null);
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            name: "",
            description: "",
            status: "active",
            priority: "medium",
            started_at: null,
            ended_at: null,
            manager: null,
            users: [],
            attachments: [],
            site: null,
            type: null,
            estimated_budget: null,
            currency: "PKR",
        },
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    useEffect(() => {
        if (editMode && projectId) {
            (async () => {
                try {
                    const { data } = await api.get(`/civil/project/${projectId}/`);
                    form.reset(data.data);
                    setFormData(data.data);
                } catch (error) {
                    Notify.error("Failed to load project data.");
                }
            })();
        }
    }, [editMode, projectId]);

    const onSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const url = editMode && projectId ? `/civil/project/${projectId}/` : `/civil/project/`;
            const method = editMode && projectId ? api.put : api.post;

            const { data } = await method(url, values);
            Notify.success(data.message || "Project saved successfully");
            navigate(`/module/civil/project`);
        } catch (error) {
            Notify.error(error.response?.data?.message || "Failed to save project.");
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
