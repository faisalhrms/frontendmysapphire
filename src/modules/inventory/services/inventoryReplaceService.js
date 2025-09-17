// @modules/inventory/services/inventoryReplaceService.js
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createEquipmentReplace = async (payload) => {
    try {
        const res = await api.post('/equipment-replacements/', payload);
        Notify.success(res.data.message);
        return res.data.data;
    } catch (err) {
        Notify.error(err.response?.data?.message || "Failed to create replacement");
        throw err;
    }
};

export const updateEquipmentReplace = async (id, payload) => {
    try {
        const res = await api.put(`/equipment-replacements/${id}/`, payload);
        Notify.success(res.data.message);
        return res.data.data;
    } catch (err) {
        Notify.error(err.response?.data?.message || "Failed to update replacement");
        throw err;
    }
};

export const getEquipmentReplace = async (id) => {
    const res = await api.get(`/equipment-replacements/${id}/`);
    return res.data.data;
};
