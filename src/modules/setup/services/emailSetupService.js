import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const emailSetupTypes = [
    { value: 'offline_store_performance_report', label: 'Offline Store Performance' },
    { value: 'daily_sales_report', label: 'Daily Sales Report' },
    { value: 'comparative_sales_report', label: 'Comparative Sales Report' },
    { value: 'sr_daily_stat_report', label: 'SR Daily Stat Report' },
    { value: 'ai_qc_daily_report', label: 'SappSense QC Report' },
    { value: 'beirholm_trend_monthly_report', label: 'Beirholm Trend Report' },
    { value: 'daily_pulse_report', label: 'Daily Pulse Report' },
];

export const getEmailSetupTypeLabel = (value) => {
    const found = emailSetupTypes.find((item) => item.value === value);
    return found ? found.label : value;
};


export const createEmailSetup = async (emailSetupData) => {
    try {
        const response = await api.post("/setups/email-setups/", emailSetupData);
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to create email setup.");
    }
};

export const updateEmailSetup = async (id, emailSetupData) => {
    try {
        const response = await api.put(`/setups/email-setups/${id}/`, emailSetupData);
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to update email setup.");
    }
};

export const getEmailSetupById = async (id) => {
    try {
        const response = await api.get(`/setups/email-setups/${id}/`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to fetch email setup.");
    }
};
