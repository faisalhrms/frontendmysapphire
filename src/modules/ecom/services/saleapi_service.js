import api from "@config/axiosConfig.js";


// export const fetchExecutiveSummary = async (filters) => {
//     try {
//         const response = await api.get(`/salesforce/fetch_executive_summary/?date_to=${filters?.date_to}&date_from=${filters?.date_from}`);
//         return response.data?.data || {};
//     } catch (error) {
//         console.error("Error fetching executive summary:", error);
//         throw error;
//     }
// };
export const fetchExecutiveSummary = async (filters) => {
    try {

        const response = await api.get("/salesforce/fetch_executive_summary/", {
            params: {
                date_to: filters?.date_to,
                date_from: filters?.date_from,
            },
        });
        return response.data?.data || {};
    } catch (error) {
        console.error("Error fetching executive summary:", error);
        throw error;
    }
};

export const fetchPendingOrders = async (filters) => {
    try {
        const response = await api.post("/salesforce/fetch_pending_orders/", {}); // Sending an empty body if required
        return response.data?.data || [];
    } catch (error) {
        console.error("Error fetching pending orders:", error);
        throw error;
    }
};

export const fetchPendingOrdersLib = async (filters) => {
    try {
        const response = await api.post("/salesforce/fetch_pending_orders_lib/", {}); // Sending an empty body if required
        return response.data?.data || [];
    } catch (error) {
        console.error("Error fetching pending orders library:", error);
        throw error;
    }
};

export const fetchSalesforceData = async (dateFrom, dateTo, filters = {}, p_type) => {
    try {
        if (!dateFrom || !dateTo || !p_type) {
            console.error("Missing required parameters:", { dateFrom, dateTo, p_type });
            throw new Error("Missing required parameters for API request.");
        }

        const response = await api.get("/salesforce/fetch_drill_down_sfd_es/", {
            params: {
                date_from: dateFrom,
                date_to: dateTo,
                p_type,
                ...filters,
            },
        });
        return response.data?.data || [];
    } catch (error) {
        console.error("Error fetching Salesforce data:", error);
        throw error;
    }
};




export const commerce_cloud = async (filters) => {
    try {
        console.log(filters);
        const response = await api.get(`salesforce/fetch_drill_down_sfd_es/`, {
            params: {
                date_from: filters?.dateFrom,
                date_to: filters?.dateTo,
                p_type: "commerce_cloud",
            }
        });
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};

export const total_orders_oms = async (filters) => {
    try {
        const response = await api.get(`salesforce/fetch_drill_down_sfd_es/`, {
            params: {
                date_from: filters?.dateFrom,
                date_to: filters?.dateTo,
                p_type: "total_orders_oms",
            }
        });
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};
export const single_fo = async (filters) => {
    try {
        const response = await api.get(`salesforce/fetch_drill_down_sfd_es/`, {
            params: {
                date_from: filters?.dateFrom,
                date_to: filters?.dateTo,
                p_type: "order_single_fo",
            }
        });
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};
export const multiple_fo = async (filters) => {
    try {
        const response = await api.get(`salesforce/fetch_drill_down_sfd_es/`, {
            params: {
                date_from: filters?.dateFrom,
                date_to: filters?.dateTo,
                p_type: "order_multiple_fo",
            }
        });
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};
export const cancelled = async (filters) => {
    try {
        const response = await api.get(`salesforce/fetch_drill_down_sfd_es/`, {
            params: {
                date_from: filters?.dateFrom,
                date_to: filters?.dateTo,
                p_type: "cancelled_oms",
            }
        });
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};
export const ipc = async (filters) => {
    try {
        const response = await api.get(`salesforce/fetch_drill_down_sfd_es/`, {
            params: {
                date_from: filters?.dateFrom,
                date_to: filters?.dateTo,
                p_type: "in_process_with_cc",
            }
        });
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};

export const owe = async (filters) => {
    try {
        const response = await api.get(`salesforce/fetch_drill_down_sfd_es/`, {
            params: {
                date_from: filters?.dateFrom,
                date_to: filters?.dateTo,
                p_type: "orders_with_exceptions",
            }
        });
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};

export const oms = async ( filters) => {
    try {
        const response = await api.get(`salesforce/fetch_drill_down_sfd_es/`, {
            params: {
                date_from: filters?.dateFrom,
                date_to: filters?.dateTo,
                p_type: "missing_in_oms",
            }
        });
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};
