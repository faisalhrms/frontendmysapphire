import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js"; // Import showAlert action


export const createMilestone = async (project_id, data) => {
    try {
        const response = await api.post(`/milestones/${project_id}`, data);

        Notify.success(response.data.message);
        return response.data;
    } catch (error) {

        Notify.error(error.response?.data?.message);
    }
};


export const updateMilestone = async (milestone_id, milestoneData) => {
    try {
        const response = await api.put(`/milestones/${milestone_id}`, milestoneData);

        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

export const getMilestones = async (page, size, s) => {
    try {
        const response = await api.get(`/milestones/datatable`, {
            params: { skip: (page - 1) * size, limit: size, s },
        });
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};


export const getMilestoneById = async (id) => {
    try {
        const response = await api.get(`/milestones/${id}`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

export const uploadMilestones = async (projectId, formData) => {
    try {
        const response = await api.post(`milestones/${projectId}/upload`, formData);
        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'An error occurred');
        throw new Error(error.response?.data?.message || 'An error occurred');
    }
};