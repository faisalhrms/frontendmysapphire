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

export const fetchDataFromAPI = async (dateFrom, dateTo, filters) => {
    try {
        const response = await api.get("salesforce/fetch_drill_down_sfd_es/", {
            params: {
                date_from: dateFrom,
                date_to: dateTo,
                p_type: "missing_in_oms",
                ...filters
            }
        });
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};

export const fetchDataAPI = async (dateFrom, dateTo, filters) => {
    try {
        const response = await api.get(`salesforce/fetch_drill_down_sfd_es/`, {
            params: {
                date_from: dateFrom,
                date_to: dateTo,
                p_type: "orders_with_exceptions",
                ...filters
            }
        });
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};

export const fetchDataAPIProcess = async (dateFrom, dateTo, filters) => {
    try {
        const response = await api.get(`salesforce/fetch_drill_down_sfd_es/`, {
            params: {
                date_from: dateFrom,
                date_to: dateTo,
                p_type: "in_process_with_cc",
                ...filters
            }
        });
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};
export const fetchDataAPICC = async (dateFrom, dateTo, filters) => {
    try {
        const response = await api.get(`salesforce/fetch_drill_down_sfd_es/`, {
            params: {
                date_from: dateFrom,
                date_to: dateTo,
                p_type: "commerce_cloud",
                ...filters
            }
        });
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};

export const fetchDataAPIOMS = async (dateFrom, dateTo, filters) => {
    try {
        console.log(dateFrom, dateTo, filters);
        const response = await api.get(`salesforce/fetch_drill_down_sfd_es/`, {
            params: {
                date_from: dateFrom,
                date_to: dateTo,
                p_type: "total_orders_oms",
                ...filters
            }
        });
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};
export const fetchDataAPIOO = async (dateFrom, dateTo, filters) => {
    try {
        const response = await api.get(`salesforce/fetch_drill_down_sfd_es/`, {
            params: {
                date_from: dateFrom,
                date_to: dateTo,
                p_type: "order_single_fo",
                ...filters
            }
        });
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};
export const fetchDataAPIOMSAA = async (dateFrom, dateTo, filters) => {
    try {
        const response = await api.get(`salesforce/fetch_drill_down_sfd_es/`, {
            params: {
                date_from: dateFrom,
                date_to: dateTo,
                p_type: "order_multiple_fo",
                ...filters
            }
        });
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};
export const fetchDataAPIOMSSS = async (dateFrom, dateTo, filters) => {
    try {
        const response = await api.get(`salesforce/fetch_drill_down_sfd_es/`, {
            params: {
                date_from: dateFrom,
                date_to: dateTo,
                p_type: "cancelled_oms",
                ...filters
            }
        });
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};



