import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createEquipmentRepair = async (repairData) => {
    try {
        const response = await api.post('/equipment-repairs/', repairData);
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to create repair");
        throw error;
    }
};

export const getEquipmentRepair = async (repairId) => {
    try {
        const response = await api.get(`/equipment-repairs/${repairId}/`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to fetch repair");
        throw error;
    }
};

export const updateEquipmentRepair = async (repairId, repairData) => {
    try {
        const response = await api.put(`/equipment-repairs/${repairId}/`, repairData);
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to update repair");
        throw error;
    }
};

export const getEquipmentRepairs = async (equipmentId) => {
    try {
        const response = await api.get(`/equipment-repairs/?equipment=${equipmentId}`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to fetch repairs");
        throw error;
    }
};

export const deleteEquipmentRepair = async (repairId) => {
    try {
        const response = await api.delete(`/equipment-repairs/${repairId}/`);
        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to delete repair");
        throw error;
    }
};