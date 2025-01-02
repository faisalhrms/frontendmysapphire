import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const taskStatuses = [
    { value: 'open', label: 'open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];


export const createTask = async (milestone_id, data) => {
    try {
        const response = await api.post(`/pms/tasks/create/${milestone_id}/`, data);
        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};


export const updateTask = async (id, taskData) => {
    try {
        const response = await api.put(`/pms/tasks/${id}/`, taskData);

        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

export const uploadTasks = async (milestoneId, formData) => {
    try {
        const response = await api.post(`tasks/${milestoneId}/upload`, formData);
        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'An error occurred');
        throw new Error(error.response?.data?.message || 'An error occurred');
    }
};


export const getTaskById = async (id) => {
    try {
        const response = await api.get(`/pms/tasks/${id}/`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};
export const getTaskDiscussions = async (taskId) => {
    try {
        const response = await api.get(`/projects/1/discussions`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Failed to get project discussions');
    }
};

export const storeTaskDiscussion = async (taskId, payload) => {
    try {
        const response = await api.post(`/projects/1/discussions`, payload);

        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
        throw error
    }
};



export const getTaskWithChild = async (id) => {
    try {
        const response = await api.get(`/pms/tasks/${id}/children/`);
        return response.data.data;
    } catch (error) {
       Notify.error(error.response?.data?.message);
    }
};
