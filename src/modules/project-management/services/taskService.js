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
    { key: "rejected", label: "Rejected" },
    { key: "under_approval", label: "Under Approval" },
];
export const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
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


export const fetchKanbanTasksAll = async (limit = 5, search = '', filterPriority = '') => {
    try {
        // Only add filterPriority to the URL if it's not empty
        const searchParams = new URLSearchParams({
            limit,
            offset: 0,
            search,
        });

        if (filterPriority) {
            searchParams.append("filterPriority", filterPriority); // Add filterPriority only if it's a valid value
        }

        const response = await api.get(`/pms/tasks/kanban/?${searchParams.toString()}`);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Error fetching Kanban tasks");
        throw error;
    }
};

export const fetchKanbanTasksByStatus = async ({ status, limit = 5, offset = 0, search = '', filterPriority = '' }) => {
    try {
        const searchParams = new URLSearchParams({
            status,
            limit,
            offset,
            search,
        });

        if (filterPriority) {
            searchParams.append("filterPriority", filterPriority); // Add filterPriority only if it's a valid value
        }

        const response = await api.get(`/pms/tasks/kanban/?${searchParams.toString()}`);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Error fetching Kanban tasks");
        throw error;
    }
};
