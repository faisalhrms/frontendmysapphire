// useEquipmentAuditHook.js

import { useState, useEffect } from "react";
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const useEquipmentAudit = () => {
    const [auditData, setAuditData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuditData = async () => {
            try {
                const response = await api.get("/dashboard/equipment-audits/");
                setAuditData(response.data.data || []);
            } catch (error) {
                Notify.error(
                    error.response?.data?.message ||
                    "Error fetching equipment audit data"
                );
                setAuditData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAuditData();
    }, []);

    return { auditData, loading };
};
