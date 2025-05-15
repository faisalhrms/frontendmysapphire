import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const getCompetitorData = async (competitorData) => {
    try {
        const response = await api.post("competitor-analysis/get_analysis/", competitorData);
        return response.data;
    } catch (error) {
        Notify.error(
            error.response?.data?.errors?.detail ||
            error.response?.data?.message ||
            "Failed to fetch"
        );
    }
};

export const downloadReport = async (filters) => {
    try {
        const response = await api.get("/competitor-analysis/download/", {
            params: {
                ...filters
            },
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};