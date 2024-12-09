import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const getPendingList = async (page, size, s) => {
    try {
        const response = await api.get(`/service-requests/assigned-pending-list`, {
            params: { skip: (page - 1) * size, limit: size, s },
        });
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

export const getInProgressList = async (page, size, s) => {
    try {
        const response = await api.get(`/service-requests/assigned-InProgress-list`, {
            params: { skip: (page - 1) * size, limit: size, s },
        });
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

export const getCompletedList = async (page, size, s) => {
    try {
        const response = await api.get(`/service-requests/assigned-completed-list`, {
            params: { skip: (page - 1) * size, limit: size, s },
        });
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};