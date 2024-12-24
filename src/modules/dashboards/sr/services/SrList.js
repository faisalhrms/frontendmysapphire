import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const serviceRequestData = async () => {
  try {
    const response = await api.get('/dashboard/sr-status-counts/');
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Error fetching service request data");
    throw error;
  }
};

export const downloadServiceRequestReport = async () => {
    try {
        const response = await api.get('/dashboard/sr-report/', {
            responseType: 'blob', // Important for file download
        });
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Error downloading service request report");
        throw error;
    }
};