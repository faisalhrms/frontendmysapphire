import api from "@config/axiosConfig.js";
import Notify from "../../../helpers/toastNotifications.js";

export const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'deactivated', label: 'Deactivated' }
];

export const createUser = async (userData) => {
    try {
        const response = await api.post('/users', userData);
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`/users/${id}`, userData);
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
        throw new Error(error.response?.data?.message || 'An error occurred while updating the user.');
    }
};

export const getUserById = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};