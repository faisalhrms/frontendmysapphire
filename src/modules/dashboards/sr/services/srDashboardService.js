import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const getPersonViewDashboardStats = async () => {
    try {
        const response = await api.get(`/dashboard/person-view/`);
        return response.data.data;
        console.log(`dashboard`,response);
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Failed to get dashboard statistics');
    }
};