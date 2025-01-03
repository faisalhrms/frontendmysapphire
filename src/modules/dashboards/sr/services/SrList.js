import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const serviceRequestData = async (filters = {}) => {
  try {
    const response = await api.get('/dashboard/sr-status-counts/', { params: filters });
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Error fetching service request data");
    throw error;
  }
};

export const downloadServiceRequestReport = async (filters = {}) => {
    try {
        const response = await api.get('/dashboard/sr-report/', {
            params: filters,
            responseType: 'blob',
        });
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Error downloading service request report");
        throw error;
    }
};
