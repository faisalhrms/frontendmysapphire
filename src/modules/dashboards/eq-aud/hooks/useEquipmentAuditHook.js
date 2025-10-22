import { useState, useEffect, useCallback } from "react";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const useEquipmentAudit = (filters = {}) => {
    const [auditData, setAuditData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAuditData = useCallback(
        async (toast = false) => {
            try {
                setLoading(true);
                setError(null);

                const res = await api.get("/dashboard/equipment-audits/", {
                    params: filters, // company_id, location_id (site)
                });

                if (res.data.status) {
                    setAuditData(res.data.data || {});
                    if (toast) Notify.success("Dashboard refreshed");
                } else {
                    throw new Error(res.data.message || "Failed to fetch data");
                }
            } catch (e) {
                const msg = e?.response?.data?.message || e.message || "Error fetching data";
                setError(msg);
                setAuditData({});
                Notify.error(msg);
            } finally {
                setLoading(false);
            }
        },
        [filters]
    );

    useEffect(() => {
        fetchAuditData(false);
    }, [fetchAuditData]);

    return { auditData, loading, error, refreshData: fetchAuditData };
};
