
import { useState, useEffect, useCallback } from "react";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const useEquipmentAudit = () => {
    const [auditData, setAuditData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAuditData = useCallback(async (showNotification = false) => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get("/dashboard/equipment-audits/");

            if (response.data.status) {
                setAuditData(response.data.data || {});

                if (showNotification) {
                    Notify.success("Dashboard refreshed successfully");
                }
            } else {
                throw new Error(response.data.message || "Failed to fetch data");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.message ||
                "Error fetching equipment audit data";

            setError(errorMessage);
            Notify.error(errorMessage);
            setAuditData({});
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial data fetch
    useEffect(() => {
        fetchAuditData(false);
    }, [fetchAuditData]);

    // Refresh function with notification
    const refreshData = useCallback(() => {
        fetchAuditData(true);
    }, [fetchAuditData]);

    return {
        auditData,
        loading,
        error,
        refreshData
    };
};