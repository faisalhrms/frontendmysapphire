import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import { useNavigate } from "react-router-dom";
import {dateSchema} from "@helpers/schema.js";

const formSchema = z.object({
    name: z.string().min(1, "Site name is required"),
    address: z.string().min(1, "Address is required"),
    latitude: z.union([z.number(), z.string()]).refine(
        (val) => val !== "" && val !== null && val !== undefined,
        { message: "Latitude is required" }
    ),
    longitude: z.union([z.number(), z.string()]).refine(
        (val) => val !== "" && val !== null && val !== undefined,
        { message: "Longitude is required" }
    ),
    ended_at: dateSchema('ended_at', true),
});

export function useSiteForm(editMode = false, siteId = null) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            name: "",
            address: "",
            latitude: "",
            longitude: "",
            ended_at: "",
        },
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    useEffect(() => {
        if (editMode && siteId) {
            (async () => {
                try {
                    const { data } = await api.get(`/civil/site/${siteId}/`);
                    form.reset(data.data);
                } catch (error) {
                    Notify.error("Failed to load site data.");
                }
            })();
        }
    }, [editMode, siteId]);

    const onSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const url = editMode && siteId ? `/civil/site/${siteId}/` : `/civil/site/`;
            const method = editMode && siteId ? api.put : api.post;

            const { data } = await method(url, values);
            Notify.success(data.message || "Site saved successfully");
            navigate(`/module/civil/site`);
        } catch (error) {
            Notify.error(error.response?.data?.message || "Failed to save site.");
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
