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
