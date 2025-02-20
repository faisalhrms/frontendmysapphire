import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const fetchExecutiveSummary = async () => {
    try {
        const response = await api.get("/salesforce/fetch_executive_summary/");
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
export const FetchPendingOrderLib = async () => {
    try {
        const response = await api.post("/salesforce/fetch_pending_orders_lib/", {

        });
        // Notify.success("Successfully Fetched Pending Orders!");
        return response.data?.data;
    } catch (error) {
        // Notify.error(error.response?.data?.message || "Failed to fetch Pending Orders");
        throw error;
    }
}

export const fetchDataFromAPI = async () => {
    try {
        const response = await api.get("salesforce/fetch_drill_down_sfd_es/?date_from=2025-01-21&date_to=2025-02-18&p_type=missing_in_oms", {

        });
        // Notify.success("Successfully Fetched Pending Orders!");
        return response.data?.data;
    } catch (error) {
        // Notify.error(error.response?.data?.message || "Failed to fetch Pending Orders");
        throw error;
    }
}

export const fetchDataAPI = async () => {
    try {
        const response = await api.get("salesforce/fetch_drill_down_sfd_es/?date_from=2025-01-21&date_to=2025-02-18&p_type=orders_with_exceptions", {

        });
        // Notify.success("Successfully Fetched Pending Orders!");
        return response.data?.data;
    } catch (error) {
        // Notify.error(error.response?.data?.message || "Failed to fetch Pending Orders");
        throw error;
    }
}


