import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dateSchema } from "@helpers/schema.js";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

const yearSetupSchema = z.object({
    year: z.string().min(4, "Year is required"),
    type: z.enum(["objective", "appraisal"]),
    started_at: dateSchema().optional().nullable(),
    ended_at: dateSchema().optional().nullable(),
});

const create = async (data) => {
    try {
        const response = await api.post(`/hrms/setups/year/`, data);
        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

const update = async (id, data) => {
    try {
        const response = await api.put(`/hrms/setups/year/${id}/`, data);
        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

const fetchById = async (id) => {
    try {
        const response = await api.get(`/hrms/setups/year/${id}/`);
        return response.data.data;
    } catch (error) {
        Notify.error("Failed to fetch year setup data.");
        return null;
    }
};

export const useYearSetupModal = (refetch) => {
    const [editId, setEditId] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(yearSetupSchema),
        defaultValues: {
            year: "",
            type: "objective",
            started_at: undefined,
            ended_at: undefined,
        },
    });

    const openModal = async (id = null, isEdit = false) => {
        setEditId(id);
        setIsEditMode(isEdit);

        let formValues = {
            year: new Date().getFullYear().toString(),
            type: "objective",
            started_at: undefined,
            ended_at: undefined,
        };

        if (id && isEdit) {
            const fetchedData = await fetchById(id);
            if (fetchedData) {
                formValues = {
                    ...fetchedData,
                    started_at: fetchedData.started_at || undefined,
                    ended_at: fetchedData.ended_at || undefined,
                };
            }
        }

        reset(formValues);

        const modal = document.getElementById("yearSetupModal");
        if (modal) {
            window.HSOverlay.open(modal);
        }
    };

    const closeModal = () => {
        const modal = document.getElementById("yearSetupModal");
        if (modal) {
            window.HSOverlay.close(modal);
        }
        reset();
        setEditId(null);
        setIsEditMode(false);
    };

    const onSubmit = async (data) => {
        try {
            let res = null;
            if (editId) {
                res = await update(editId, data);
            } else {
                res = await create(data);
            }

            if (res) {
                closeModal();
                if (refetch) refetch();
            }
        } catch (err) {
            console.error("Submit error:", err);
        }
    };

    return {
        openModal,
        closeModal,
        control,
        errors,
        isSubmitting,
        handleSubmit,
        onSubmit,
        isEditMode,
    };
};
