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
