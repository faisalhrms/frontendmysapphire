import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

/** Create */
export const createRequisition = async (payload, { notify = true } = {}) => {
    try {
        const res = await api.post("/requisition/", payload);
        if (notify) Notify.success(res?.data?.message || "Requisition saved");
        return res?.data?.data ?? res?.data;
    } catch (error) {
        Notify.error(error?.response?.data?.message || "Failed to save requisition");
        throw error;
    }
};

/** Update */
export const updateRequisition = async (id, payload, { notify = true } = {}) => {
    try {
        const res = await api.put(`/requisition/${id}/`, payload);
        if (notify) Notify.success(res?.data?.message || "Requisition updated");
        return res?.data?.data ?? res?.data;
    } catch (error) {
        Notify.error(error?.response?.data?.message || "Failed to update requisition");
        throw error;
    }
};

export const submitRequisitionForApproval = async (id, payload = {}) => {
    try {
        const res = await api.post(`/requisition/${id}/submit/`, payload);
        Notify.success(res?.data?.message || "Submitted for approval");
        return res?.data?.data ?? res?.data;
    } catch (error) {
        Notify.error(error?.response?.data?.message || "Failed to submit for approval");
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
