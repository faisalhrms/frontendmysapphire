import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import itGovernSchema from "@modules/it_governance/schema/itGovernSchema.js";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import { IT_GOVERNANCE_ROUTES } from "@modules/it_governance/routes.js";
import { useNavigate } from "react-router-dom";

/**
 * Helpers to convert between UI (number+unit) and backend DurationField format.
 * - Days: "D 00:00:00" (e.g. "1 00:00:00")
 * - Hours: "HH:00:00" (e.g. "48:00:00")
 * - Minutes: "H:MM:00" (converted to hours:minutes -> "1:30:00")
 */
const formatDuration = (valueNumber, unit) => {
    const n = Number(valueNumber) || 0;
    if (unit === "days") {
        return `${Math.floor(n)} 00:00:00`;
    }
    if (unit === "hours") {
        return `${Math.floor(n)}:00:00`;
    }
    // minutes
    const totalMinutes = Math.floor(n);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}:${String(minutes).padStart(2, "0")}:00`;
};

const parseDurationToNumberUnit = (raw) => {
    if (!raw) return { value: "", unit: "hours" };

    if (typeof raw === "string" && raw.includes(" ")) {
        const parts = raw.split(" ");
        const days = parseInt(parts[0], 10) || 0;
        return { value: days, unit: "days" };
    }

    const parts = String(raw).split(":").map((p) => parseInt(p, 10) || 0);
    if (parts.length >= 2) {
        const hours = parts[0];
        const minutes = parts[1];
        const totalMinutes = hours * 60 + minutes;
        if (totalMinutes < 60) {
            return { value: totalMinutes, unit: "minutes" };
        }
        return { value: hours, unit: "hours" };
    }
    return { value: raw, unit: "hours" };
};

// ---------------- API calls ---------------- //
const createSla = async (data) => {
    try {
        const response = await api.post(`/service-level-agreements/`, data);
        Notify.success(response.data.message || "Created successfully");
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to create SLA");
        throw error;
    }
};

const updateSla = async (id, data) => {
    try {
        const response = await api.put(`/service-level-agreements/${id}/`, data);
        Notify.success(response.data.message || "Updated successfully");
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to update SLA");
        throw error;
    }
};

const fetchSlaById = async (id) => {
    try {
        const response = await api.get(`/service-level-agreements/${id}/`);
        // your backend wraps data under response.data.data
        return response.data.data;
    } catch (error) {
        Notify.error("Failed to fetch SLA data.");
        return null;
    }
};

// ---------------- Hooks ---------------- //

export const useFetchSlaById = (id) => {
    const [slaData, setSlaData] = useState(null);

    useEffect(() => {
        if (!id) return;
        const fetch = async () => {
            try {
                const data = await fetchSlaById(id);
                setSlaData(data);
            } catch (err) {
                console.error("FetchSlaById error:", err);
            }
        };
        fetch();
    }, [id]);

    return { slaData };
};

export const useServiceLevelAgreementForm = (slaData = {}, isEditMode = false, refetch) => {
    const [editId, setEditId] = useState(isEditMode ? slaData?.id : null);
    const navigate = useNavigate();

    const parsedResp = parseDurationToNumberUnit(slaData?.response_time);
    const parsedResol = parseDurationToNumberUnit(slaData?.resolution_time);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(itGovernSchema),
        defaultValues: {
            vendor_name: slaData.vendor_name || "",
            address: slaData.address || "",
            phone: slaData.phone || "",
            responsibilities: slaData.responsibilities || "",
            services_provided: slaData.services_provided || "",
            key_metric_id: slaData?.key_metric?.id || null,
            support_hours: slaData.support_hours || "",
            duration: slaData.duration || "",
            penalties: slaData.penalties || "",
            confidentiality_requirement: slaData.confidentiality_requirement || "",
            termination_notice_period: slaData.termination_notice_period ?? "",
            priority: slaData.priority || "medium",
            response_value: parsedResp.value || "",
            response_unit: parsedResp.unit || "hours",
            resolution_value: parsedResol.value || "",
            resolution_unit: parsedResol.unit || "hours",
            review_frequency: slaData.review_frequency || null,
            dispute_resolution: slaData.dispute_resolution || "",
            exit_clause_reference: slaData.exit_clause_reference || "",
            exit_conditions: slaData.exit_conditions || "",
            exit_obligations: slaData.exit_obligations || "",
            early_exit_penalty: slaData.early_exit_penalty || "",
            exclusions: Array.isArray(slaData.exclusions) ? slaData.exclusions : (typeof slaData.exclusions === "string" && slaData.exclusions.length ? slaData.exclusions.split(",").map(s=>s.trim()) : []),
            attachment_ids: slaData.attachments ? slaData.attachments.map(a => a.id) : [],
        },
    });

    useEffect(() => {
        // update editId if slaData passed later
        if (isEditMode && slaData?.id) {
            setEditId(slaData.id);
            // reset form when slaData arrives (edit)
            reset({
                vendor_name: slaData.vendor_name || "",
                address: slaData.address || "",
                phone: slaData.phone || "",
                responsibilities: slaData.responsibilities || "",
                services_provided: slaData.services_provided || "",
                key_metric_id: slaData?.key_metric?.id || null,
                support_hours: slaData.support_hours || "",
                duration: slaData.duration || "",
                penalties: slaData.penalties || "",
                confidentiality_requirement: slaData.confidentiality_requirement || "",
                termination_notice_period: slaData.termination_notice_period ?? "",
                priority: slaData.priority || "medium",
                response_value: parsedResp.value || "",
                response_unit: parsedResp.unit || "hours",
                resolution_value: parsedResol.value || "",
                resolution_unit: parsedResol.unit || "hours",
                review_frequency: slaData.review_frequency || null,
                dispute_resolution: slaData.dispute_resolution || "",
                exit_clause_reference: slaData.exit_clause_reference || "",
                exit_conditions: slaData.exit_conditions || "",
                exit_obligations: slaData.exit_obligations || "",
                early_exit_penalty: slaData.early_exit_penalty || "",
                exclusions: Array.isArray(slaData.exclusions) ? slaData.exclusions : (typeof slaData.exclusions === "string" && slaData.exclusions.length ? slaData.exclusions.split(",").map(s=>s.trim()) : []),
                attachment_ids: slaData.attachments ? slaData.attachments.map(a => a.id) : [],
            });
        }
    }, [slaData, isEditMode, reset]);

    const handleSlaSubmit = useCallback(
        async (data) => {
            try {
                const payload = {
                    vendor_name: data.vendor_name,
                    address: data.address,
                    phone: data.phone,
                    responsibilities: data.responsibilities,
                    services_provided: data.services_provided,
                    key_metric_id: data.key_metric_id || null,
                    support_hours: data.support_hours,
                    duration: data.duration,
                    penalties: data.penalties,
                    confidentiality_requirement: data.confidentiality_requirement,
                    termination_notice_period: data.termination_notice_period || null,
                    priority: data.priority,
                    response_time: formatDuration(data.response_value, data.response_unit),
                    resolution_time: formatDuration(data.resolution_value, data.resolution_unit),
                    review_frequency: data.review_frequency || null,
                    dispute_resolution: data.dispute_resolution,
                    exit_clause_reference: data.exit_clause_reference,
                    exit_conditions: data.exit_conditions,
                    exit_obligations: data.exit_obligations,
                    early_exit_penalty: data.early_exit_penalty,
                    exclusions: Array.isArray(data.exclusions) ? data.exclusions : [],
                    attachment_ids: Array.isArray(data.attachment_ids) ? data.attachment_ids : [],
                };

                let res;
                if (editId) {
                    res = await updateSla(editId, payload);
                } else {
                    res = await createSla(payload);
                }

                if (res) {
                    // redirect to listing page - make sure ITGOV_ROUTES.READ exists in your routes file
                    navigate(IT_GOVERNANCE_ROUTES.READ.path);
                }

                return res;
            } catch (err) {
                console.error("SLA submit error:", err);
                throw err;
            }
        },
        [editId, refetch]
    );

    return {
        control,
        errors,
        isSubmitting,
        handleSubmit,
        handleSlaSubmit,
        reset,
        setEditId,
    };
};
