import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const taskStatuses = [
    { value: 'open', label: 'Open' },
    { value: 'not_started', label: 'Not Started' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'half_completed', label: 'Half Completed' },
    { value: 'near_completion', label: 'Near Completion' },
    { value: 'completed', label: 'Completed' },
    { value: 'reopened', label: 'Reopened' },
    { value: 'on_hold', label: 'On Hold' },
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
        const response = await api.post(`/pms/tasks/upload/${milestoneId}/`, formData);
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


export const getTaskWithChild = async (id) => {
    try {
        const response = await api.get(`/pms/tasks/${id}/children/`);
        return response.data.data;
    } catch (error) {
       Notify.error(error.response?.data?.message);
    }
};

export const updateTaskStatus = async (id, status) => {
    try {
        const response = await api.post(`/pms/tasks/${id}/update-status/`, {status: status});
        Notify.success(response.data.message);
        return response.data.data;
    }catch (error){
        Notify.error(error.response?.data?.message);
        throw Error(error.response?.data?.message || 'An error occurred');
    }
}

export const updateOverdueTask = async (id, payload) => {
    try {
        const response = await api.post(`/pms/tasks/${id}/request-overdue-task/`, payload);
        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
        throw Error(error.response?.data?.message || 'An error occurred');
    }
};


export const fetchTasks = async (limit, offset, status = '') => {
    try {
        const url = `/pms/tasks/kanban/?limit=${limit}&offset=${offset}${status ? `&status=${status}` : ''}`;
        const response = await api.get(url);  // Use axios's get method instead of fetch
        return response.data;  // Return the data from the API response
    } catch (error) {
        // Notify on error with a generic error message or the one from the API response
        Notify.error(error.response?.data?.message || 'Failed to fetch tasks');
        throw error; // Rethrow the error so the calling code can handle it
    }
};
