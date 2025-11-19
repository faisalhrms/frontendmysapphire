import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

/** Create */
export const createRequisition = async (payload) => {
    try {
        const res = await api.post("/requisition/", payload);
        Notify.success(res?.data?.message || "Requisition created");
        return res?.data?.data ?? res?.data;
    } catch (error) {
        Notify.error(error?.response?.data?.message || "Failed to create requisition");
        throw error;
    }
};

/** Update (partial) */
export const updateRequisition = async (id, payload) => {
    try {
        const res = await api.put(`/requisition/${id}/`, payload);
        Notify.success(res?.data?.message || "Requisition updated");
        return res?.data?.data ?? res?.data;
    } catch (error) {
        Notify.error(error?.response?.data?.message || "Failed to update requisition");
        throw error;
    }
};

/** Get single */
export const getRequisition = async (id) => {
    try {
        const res = await api.get(`/requisition/${id}/`);
        return res?.data?.data ?? res?.data;
    } catch (error) {
        Notify.error(error?.response?.data?.message || "Failed to fetch requisition");
        throw error;
    }
};
