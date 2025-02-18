import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const fetchExecutiveSummary = async () => {
    try {
        const response = await api.get("/salesforce/fetch_executive_summary/", {
            "date_from": "2025-01-21",
            "date_to": "2025-02-17"
        });
        // Notify.success("Successfully Fetched Executive Summary!");
        return response.data?.data;
    } catch (error) {
        // Notify.error(error.response?.data?.message || "Failed to fetch Executive Summary");
        throw error;
    }
};
export const fetchPendingOrders = async () => {
    try {
        const response = await api.post("/salesforce/fetch_pending_orders/", {

        });
        // Notify.success("Successfully Fetched Pending Orders!");
        return response.data?.data;
    } catch (error) {
        // Notify.error(error.response?.data?.message || "Failed to fetch Pending Orders");
        throw error;
    }
}