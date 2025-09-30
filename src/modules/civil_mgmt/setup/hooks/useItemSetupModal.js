import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

const itemSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    category: z.number({ invalid_type_error: "Category is required" }),
    unit: z.number({ invalid_type_error: "Unit is required" }),
});

const createItem = async (data) => {
    try {
        const response = await api.post(`/civil/item/`, data);
        Notify.success(response.data.message || "Item created successfully");
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to create item");
        return null;
    }
};

const updateItem = async (id, data) => {
    try {
        const response = await api.put(`/civil/item/${id}/`, data);
        Notify.success(response.data.message || "Item updated successfully");
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to update item");
        return null;
    }
};

const fetchItemById = async (id) => {
    try {
        const response = await api.get(`/civil/item/${id}/`);
        return response.data.data;
    } catch (error) {
        Notify.error("Failed to fetch item data.");
        return null;
    }
};

export const useItemSetupModal = (refetch) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editId, setEditId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState(null);

    const form = useForm({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            name: "",
            description: "",
            category: null,
            unit: null,
        },
        mode: "onChange",
    });

    const openModal = async (id = null, edit = false) => {
        setEditId(id);
        setIsEditMode(edit);

        if (id && edit) {
            const fetchedData = await fetchItemById(id);
            if (fetchedData) {
                setFormData(fetchedData);
                form.reset(fetchedData);

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
                res = await updateItem(editId, data);
            } else {
                res = await createItem(data);
            }

            if (res) {
                closeModal();
                if (refetch) refetch();
            }
        } catch (error) {
            Notify.error(error.response?.data?.message || "Failed to save site.");
        }finally {
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
