import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import { useNavigate } from "react-router-dom";

const itemSchema = z.object({
    item: z.number().min(1, "Item is required"),
    quantity: z.number().min(1, "Quantity must be greater than 0"),
    rate: z.number().min(0.01, "Rate must be greater than 0"),
});

const formSchema = z.object({
    project: z.coerce.number().min(1, "Project is required"),
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    version: z.number().min(1).default(1),
    is_finalized: z.boolean().default(false),
    attachments: z.array(z.number()).optional(),
    items: z.array(itemSchema).min(1, "At least one item is required"),
});

export function useCivilBoqForm(editMode = false, boqId = null) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(false);
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            project: "",
            title: "",
            description: "",
            version: 1,
            is_finalized: false,
            attachments: [],
            items: [],
        },
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    const { control, formState, handleSubmit, watch, setValue, reset } = form;

    useEffect(() => {
        if (editMode && boqId) {
            (async () => {
                try {
                    const { data } = await api.get(`/civil/boq/${boqId}/`);
                    reset(data.data);
                    setFormData(data.data);
                } catch (error) {
                    Notify.error("Failed to load BOQ data.");
                }
            })();
        }
    }, [editMode, boqId, reset]);

    const onSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const url = editMode && boqId ? `/civil/boq/${boqId}/` : `/civil/boq/`;
            const method = editMode && boqId ? api.put : api.post;

            const { data } = await method(url, values);
            Notify.success(data.message || "BOQ saved successfully");
            navigate(`/module/civil/boq`);
        } catch (error) {
            Notify.error(error.response?.data?.message || "Failed to save BOQ.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        control,
        errors: formState.errors,
        handleSubmit,
        onSubmit,
        isSubmitting,
        formData,
        watch,
        setValue,
    };
}
