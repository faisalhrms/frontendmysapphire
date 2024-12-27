import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const updateUserProfile = async (userData) => {
    try {
        const response = await api.put('/users/edit-profile/', userData);
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};
