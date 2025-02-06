import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const projectStatuses = [
    { value: 'active', label: 'Active' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' }
];

export const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
];

export const createProject = async (payload) => {
    try {
        const response = await api.post('/pms/projects/', payload);

        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
        throw new Error(error.response?.data?.message || 'An error occurred');
    }
};


export const updateProject = async (id, payload) => {
    try {
        const response = await api.put(`/pms/projects/${id}/`, payload);
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
        throw error;
    }
};


export const getProjects = async (page, size, s, workspaces = null, status = null, priority = null) => {
    try {
        const response = await api.get(`/pms/projects/datatable/`, {
            params: { skip: (page - 1) * size, limit: size, s, workspaces: workspaces, status: status, priority: priority },
        });
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};


export const getProjectById = async (id) => {
    try {
        const response = await api.get(`/pms/projects/${id}/`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};


export const getProjectMilestonesWithTasks = async (id) => {
    try {
        const response = await api.get(`/pms/milestones/tasks/${id}/`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Failed to get project milestones with tasks');
    }
};


export const toggleFavouriteProject = async (id, isFavourite) => {
    try {
        const response = await api.post(`/pms/projects/${id}/toggle-favourite/`, {is_favourite: isFavourite});
        Notify.success(response.data.message);
        return response.data.data;
    }catch (error){
        Notify.error(error.response?.data?.message);
        throw new Error(error.response?.data?.message || 'An error occurred');
    }
}

export const uploadProjects = async (formData) => {
    try {
        const response = await api.post(`/pms/projects/upload/`, formData);
        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'An error occurred');
        throw new Error(error.response?.data?.message || 'An error occurred');
    }
};

export const getProjectStats = async (id = null, months = 12) => {
    try {
        const response = await api.get(`/pms/projects/statistics/?${id != null ? `project_id=${id}&` : ''}num_months=${months}`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Failed to get project statistics');
    }
};


export const getProjectDashboardStats = async () => {
    try {
        const response = await api.get(`/dashboard/pms/statistics/`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Failed to get project dashboard statistics');
        throw error
    }
};

export const getProjectMilestoneDashboardStats = async (projectId) => {
    try {
        const response = await api.get(`/dashboard/pms/${projectId}/milestone/statistics/`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Failed to get project dashboard milestone statistics');
        throw error
    }
}

export const getProjectMilestoneTaskDashboardStats = async (milestoneId) => {
    try {
        const response = await api.get(`/dashboard/pms/${milestoneId}/tasks/statistics/`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Failed to get project dashboard milestone tasks statistics');
        throw error
    }
};

export const deleteProject = async (projectId) => {
    try {
        const response = await api.delete(`/pms/projects/${projectId}/delete/`);
        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Failed to delete project');
        throw error
    }
};