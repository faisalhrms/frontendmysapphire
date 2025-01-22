import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createServiceRequest = async (serviceRequestData) => {
  try {
    const response = await api.post("/setups/service-requests/", serviceRequestData);
    Notify.success("Service Request Created Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create Service Request");
    throw error;
  }
};

export const getServiceRequests = async () => {
  try {
    const response = await api.get("/setups/service-requests/datatable/");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch Service Requests");
    throw error;
  }
};

export const getServiceRequestById = async (id) => {
  try {
    const response = await api.get(`/setups/service-requests/${id}/`);
    return response?.data?.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch Service Request details");
    throw error;
  }
};

export const updateServiceRequest = async (id, serviceRequestData) => {
  try {
    const response = await api.get(`/setups/service-requests/${id}/`, serviceRequestData);
    Notify.success("Service Request Updated Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update Service Request");
    throw error;
  }
};


