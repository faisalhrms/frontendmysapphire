import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createTask = async (id, requestData) => {
  try {
    const response = await api.post(`/sr-task/${id}`, requestData);
    Notify.success(response.data.message || "Task created successfully");
    return response.data.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Error creating task");
  }
};

export const getServiceRequestById = async (id) => {
  try {
    const response = await api.get(`/service-request/${id}/`);
    return response.data.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Error fetching service request");
  }
};

export const getTaskById = async (id) => {
  try {
    const response = await api.get(`/sr-task/${id}/`);
    return response.data.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Error fetching service request");
  }
};

export const closeServiceRequest = async (id) => {
  try {
    const response = await api.post(`/service-request/cancel/`, { id });
    Notify.success(response.data.message || "Service request closed successfully");
    return response.data.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Error closing service request");
    throw error;
  }
};

export const updateServiceRequest = async (id, requestData) => {
    try {
        const response = await api.put(`/service-request/${id}/update/`, requestData);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Error updating service request");
        throw error;
    }
};