import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const getPersonViewDashboardStats = async (filters) => {
    try {
        const response = await api.get(`/dashboard/person-view/`, {
            params: filters,
        });
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to get dashboard statistics");
        throw error;
    }
};
export const view_type = [
    {value: 'person_view', label: 'Person View'},
    {value: 'team_view', label: 'Team View'},
];