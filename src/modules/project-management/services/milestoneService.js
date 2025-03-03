import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const launches = [
    { value: 'previous_two_months', label: 'Previous two months' },
    { value: 'previous_month', label: 'Previous month' },
    { value: 'previous_two_weeks', label: 'Previous two weeks' },
    { value: 'previous_week', label: 'Previous week' },
    { value: 'this_week', label: 'This week' },
    { value: 'this_month', label: 'This month' },
    { value: 'next_week', label: 'Next week' },
    { value: 'next_month', label: 'Next month' },
    { value: 'next_two_weeks', label: 'Next two weeks' },
    { value: 'next_two_months', label: 'Next two months' },
];



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