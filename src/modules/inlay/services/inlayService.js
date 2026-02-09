// src/modules/inlay/services/inlayService.js

import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

const unwrap = (axiosResp) => axiosResp?.data?.data ?? axiosResp?.data ?? null;

export const createInlay = async (payload) => {
    const res = await api.post("/inlay/inlays/", payload);
    return unwrap(res);
};

export const updateInlay = async (id, payload) => {
    const res = await api.put(`/inlay/inlays/${id}/`, payload);
    return unwrap(res);
};

export const getInlay = async (id) => {
    const res = await api.get(`/inlay/inlays/${id}/`);
    return unwrap(res);
};

export const uploadInlay = async (formData) => {
    try {
        const response = await api.post(`/inlay/inlays/upload/`, formData);
        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'An error occurred');
        throw new Error(error.response?.data?.message || 'An error occurred');
    }
};