import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const fetchCertificateAlerts = async (filters = {}) => {
  try {
    const response = await api.get("/chain/certificate-alerts/", {
      params: filters
    });
    return response.data;
  } catch (error) {
    Notify.error(
      error.response?.data?.message || "Error fetching certificate alerts"
    );
    throw error;
  }
};
