import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";


export const projectDrawingTypes = [
    { value: 'architectural', label: 'Architectural' },
    { value: 'structural', label: 'Structural' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'mechanical', label: 'Mechanical' },
    { value: 'layout', label: 'Layout' },
    { value: 'other', label: 'Other' },
];

const drawingSchema = z.object({
    project: z.number({ invalid_type_error: "Project is required" }),
    title: z.string().min(1, "Title is required"),
    type: z.string().min(1, "Drawing type is required"),
    description: z.string().min(1, "Description is required"),
    files: z.array(z.number()).min(1, "At least one file is required"),
});

const createDrawing = async (data) => {
    try {
        const response = await api.post(`/civil/project-drawing/`, data);
        Notify.success(response.data.message || "Drawing created successfully");
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to create drawing");
        return null;
    }
};

const updateDrawing = async (id, data) => {
    try {
        const response = await api.put(`/civil/project-drawing/${id}/`, data);
        Notify.success(response.data.message || "Drawing updated successfully");
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to update drawing");
        return null;
    }
};

const fetchDrawingById = async (id) => {
    try {
        const response = await api.get(`/civil/project-drawing/${id}/`);
        return response.data.data;
    } catch (error) {
        Notify.error("Failed to fetch drawing data.");
        return null;
    }
};

export const useCivilProjectDrawingModal = (refetch) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState(null);

    const form = useForm({
        resolver: zodResolver(drawingSchema),
        defaultValues: {
            project: null,
            title: "",
            type: "",
            description: "",
            files: [],
        },
        mode: "onChange",
    });

    const openModal = async (id = null, edit = false) => {
        setEditId(id);
        setIsEditMode(edit);

        if (id && edit) {
            const fetchedData = await fetchDrawingById(id);
            if (fetchedData) {
                setFormData(fetchedData);

                form.reset({
                    project: fetchedData.project,
                    title: fetchedData.title,
                    type: fetchedData.type,
                    description: fetchedData.description,
                    files: fetchedData.files || [],
                });
            }
        }

        const modal = document.getElementById("itemModal");
        if (modal) window.HSOverlay.open(modal);
    };

    const closeModal = () => {
        const modal = document.getElementById("itemModal");
        if (modal) window.HSOverlay.close(modal);
        form.reset();
        setEditId(null);
        setIsEditMode(false);
        setFormData(null);
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            let res;
            if (editId) {
                res = await updateDrawing(editId, data);
            } else {
                res = await createDrawing(data);
            }

            if (res) {
                closeModal();
                if (refetch) refetch();
            }
        } catch (error) {
            Notify.error(error.response?.data?.message || "Failed to save drawing.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        openModal,
        closeModal,
        control: form.control,
        errors: form.formState.errors,
        isSubmitting,
        handleSubmit: form.handleSubmit,
        onSubmit,
        isEditMode,
        formData,
    };
};
