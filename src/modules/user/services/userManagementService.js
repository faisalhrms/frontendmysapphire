// userManagementService.js

import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

// Fetch user list
export const getUsers = async (page, size, search = "") => {
    try {
        const response = await api.get('/employee-details/list/', {
            params: {
                skip: (page - 1) * size,
                limit: size,
                s: search
            }
        });
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Error fetching users');
        throw error;
    }
};
export const createUser = async (userData) => {
    try {
        const response = await api.post('/employee-details/create/', userData);

        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

// Update an existing user
export const updateUser = async (id, userData) => {
    try {
        const response = await api.post(`/employee-details/${id}/update/`, userData);

        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

export const getUserManagementById = async (id) => {
    try {
        const response = await api.get(`/employee-details/${id}/detail/`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};
