import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import applicationUniverseSchema from "@modules/it_governance/schema/applicationUniverseSchema.js";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import { IT_GOVERNANCE_ROUTES } from "@modules/it_governance/routes.js";
import { useNavigate } from "react-router-dom";

// ---------- API helpers ---------- //
const createApplication = async (data) => {
    try {
        const response = await api.post(`/application-universe/`, data);
        Notify.success(response.data.message || "Application created successfully");
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to create application");
        throw error;
    }
};

const updateApplication = async (id, data) => {
    try {
        const response = await api.put(`/application-universe/${id}/`, data);
        Notify.success(response.data.message || "Application updated successfully");
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to update application");
        throw error;
    }
};

const fetchApplicationById = async (id) => {
    try {
        const response = await api.get(`/application-universe/${id}/`);
        return response.data.data;
    } catch (error) {
        Notify.error("Failed to fetch Application data.");
        return null;
    }
};

// ---------- Hook for fetching a single record ---------- //
export const useFetchApplicationById = (id) => {
    const [appData, setAppData] = useState(null);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const data = await fetchApplicationById(id);
                setAppData(data);
            } catch (err) {
                console.error("FetchApplicationById error:", err);
            }
        })();
    }, [id]);

    return { appData };
};

// ---------- Main form hook ---------- //
export const useApplicationUniverseForm = (appData = {}, isEditMode = false, refetch) => {
    const [editId, setEditId] = useState(isEditMode ? appData?.id : null);
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(applicationUniverseSchema),
        defaultValues: {
            application_name: appData.application_name || "",
            application_ownership: appData.application_ownership || "",
            application_versions: appData.application_versions || "",
            application_type: appData.application_type || "",
            backend_database: appData.backend_database || "",
            platform: appData.platform || "",
            integrations: appData.integrations || "",
            attachment_ids: appData.attachments
                ? appData.attachments.map((a) => a.id)
                : [],
        },
    });

    useEffect(() => {
        if (isEditMode && appData?.id) {
            setEditId(appData.id);
            reset({
                application_name: appData.application_name || "",
                application_ownership: appData.application_ownership || "",
                application_versions: appData.application_versions || "",
                application_type: appData.application_type || "",
                backend_database: appData.backend_database || "",
                platform: appData.platform || "",
                integrations: appData.integrations || "",
                attachment_ids: appData.attachments
                    ? appData.attachments.map((a) => a.id)
                    : [],
            });
        }
    }, [appData, isEditMode, reset]);

    const handleApplicationSubmit = useCallback(
        async (data) => {
            try {
                const payload = {
                    application_name: data.application_name,
                    application_ownership: data.application_ownership,
                    application_versions: data.application_versions,
                    application_type: data.application_type,
                    backend_database: data.backend_database,
                    platform: data.platform,
                    integrations: data.integrations,
                    attachment_ids: Array.isArray(data.attachment_ids)
                        ? data.attachment_ids
                        : [],
                };

                let res;
                if (editId) {
                    res = await updateApplication(editId, payload);
                } else {
                    res = await createApplication(payload);
                }

                if (res) {
                    navigate(IT_GOVERNANCE_ROUTES.APPLICATION_UNIVERSE.READ.path);
                }

                return res;
            } catch (err) {
                console.error("Application submit error:", err);
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
        handleApplicationSubmit,
        reset,
        setEditId,
    };
};
