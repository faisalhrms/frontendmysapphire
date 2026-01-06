// src/modules/requisition/services/jobDescService.js
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

/**
 * Create JD
 */
export const createJobDesc = async (payload) => {
    try {
        const res = await api.post("/job-descriptions/", payload);
        // assuming { message, data }
        Notify.success(res?.data?.message || "Job Description created");
        return res?.data?.data ?? res?.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to create Job Description");
        throw error;
    }
};

/**
 * Update JD
 */
export const updateJobDesc = async (jobDescId, payload) => {
    try {
        const res = await api.put(`/job-descriptions/${jobDescId}/`, payload);
        Notify.success(res?.data?.message || "Job Description updated");
        return res?.data?.data ?? res?.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to update Job Description");
        throw error;
    }
};

/**
 * Get single JD
 */
export const getJobDesc = async (jobDescId) => {
    try {
        const res = await api.get(`/job-descriptions/${jobDescId}/`);
        return res?.data?.data ?? res?.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to fetch Job Description");
        throw error;
    }
};
