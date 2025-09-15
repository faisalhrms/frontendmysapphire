// @modules/it_governance/hooks/useWarrantyForm.js
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import warrantySchema from "@modules/it_governance/schema/warrantySchema.js";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import { IT_GOVERNANCE_ROUTES } from "@modules/it_governance/routes.js";
import { useNavigate } from "react-router-dom";

// ---- API helpers ---- //
const createWarranty = async (data) => {
    try {
        const res = await api.post(`/warranties/`, data);
        Notify.success(res.data.message || "Warranty created successfully");
        return res.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to create warranty");
        throw error;
    }
};

const updateWarranty = async (id, data) => {
    try {
        const res = await api.put(`/warranties/${id}/`, data);
        Notify.success(res.data.message || "Warranty updated successfully");
        return res.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to update warranty");
        throw error;
    }
};

const fetchWarrantyById = async (id) => {
    try {
        const res = await api.get(`/warranties/${id}/`);
        return res.data.data;
    } catch (error) {
        Notify.error("Failed to fetch warranty data.");
        return null;
    }
};

// ---- Hook to fetch a single record ---- //
export const useFetchWarrantyById = (id) => {
    const [warrantyData, setWarrantyData] = useState(null);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const data = await fetchWarrantyById(id);
                setWarrantyData(data);
            } catch (err) {
                console.error("FetchWarrantyById error:", err);
            }
        })();
    }, [id]);

    return { warrantyData };
};

// ---- Main form hook ---- //
export const useWarrantyForm = (warrantyData = {}, isEditMode = false, refetch) => {
    const [editId, setEditId] = useState(isEditMode ? warrantyData?.id : null);
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(warrantySchema),
        defaultValues: {
            equipment_and_services: warrantyData.equipment_and_services || "",
            warranty_period: warrantyData.warranty_period || "",
            vendor: warrantyData.vendor || "",
            client: warrantyData.client || "",
            exclusions: warrantyData.exclusions || [],
            service_credits: warrantyData.service_credits || "",
            confidentiality_protocols: warrantyData.confidentiality_protocols || "",
            warranty_ends: warrantyData.warranty_ends ?? 0,
            disputes_resolved: warrantyData.disputes_resolved || "",
            attachment_ids: warrantyData.attachments
                ? warrantyData.attachments.map((a) => a.id)
                : [],
        },
    });

    useEffect(() => {
        if (isEditMode && warrantyData?.id) {
            setEditId(warrantyData.id);
            reset({
                equipment_and_services: warrantyData.equipment_and_services || "",
                warranty_period: warrantyData.warranty_period || "",
                vendor: warrantyData.vendor || "",
                client: warrantyData.client || "",
                exclusions: warrantyData.exclusions || [],
                service_credits: warrantyData.service_credits || "",
                confidentiality_protocols: warrantyData.confidentiality_protocols || "",
                warranty_ends: warrantyData.warranty_ends ?? 0,
                disputes_resolved: warrantyData.disputes_resolved || "",
                attachment_ids: warrantyData.attachments
                    ? warrantyData.attachments.map((a) => a.id)
                    : [],
            });
        }
    }, [warrantyData, isEditMode, reset]);

    const handleWarrantySubmit = useCallback(
        async (data) => {
            const payload = {
                equipment_and_services: data.equipment_and_services,
                warranty_period: data.warranty_period,
                vendor: data.vendor,
                client: data.client,
                exclusions: data.exclusions,
                service_credits: data.service_credits,
                confidentiality_protocols: data.confidentiality_protocols,
                warranty_ends: data.warranty_ends,
                disputes_resolved: data.disputes_resolved,
                attachment_ids: Array.isArray(data.attachment_ids)
                    ? data.attachment_ids
                    : [],
            };

            let res;
            if (editId) {
                res = await updateWarranty(editId, payload);
            } else {
                res = await createWarranty(payload);
            }

            if (res) {
                navigate(IT_GOVERNANCE_ROUTES.WARRANTY.READ.path);
            }

            return res;
        },
        [editId, refetch]
    );

    return {
        control,
        errors,
        isSubmitting,
        handleSubmit,
        handleWarrantySubmit,
        reset,
        setEditId,
    };
};
