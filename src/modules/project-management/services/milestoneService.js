import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";


export const createMilestone = async (project_id, data) => {
    try {
        const response = await api.post(`/pms/milestones/create/${project_id}/`, data);

        Notify.success(response.data.message);
        return response.data;
    } catch (error) {

        Notify.error(error.response?.data?.message);
    }
};


export const updateMilestone = async (milestone_id, milestoneData) => {
    try {
        const response = await api.put(`/pms/milestones/${milestone_id}/`, milestoneData);

        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

export const getMilestoneById = async (id) => {
    try {
        const response = await api.get(`/pms/milestones/${id}/`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

export const uploadMilestones = async (projectId, formData) => {
    try {
        const response = await api.post(`/pms/milestones/upload/${projectId}/`, formData);
        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'An error occurred');
        throw new Error(error.response?.data?.message || 'An error occurred');
    }
};