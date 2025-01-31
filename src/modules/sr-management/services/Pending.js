import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import {z} from "zod";

export const prioritiesEnum = z.enum(["low", "medium", "high"], {
    errorMap: () => "Priority must be 'low', 'medium', or 'high'",
});

export const priorities = [
    { value: 'low', label: 'Low',sla_hours: 48 },
    { value: 'medium', label: 'Medium',sla_hours: 24 },
    { value: 'high', label: 'High',sla_hours: 8 }
];

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

export const updateTask = async (id, requestData) => {
  try {
    const response = await api.post(`/sr-task/update/${id}`, requestData);
    Notify.success(response.data.message || "Task updated successfully");
    return response.data.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Error updating task");
    throw error;
  }
};

export const updateAttachments = async (id, attachments) => {
  try {
    const response = await api.put(`/service-request/${id}/attachments/`, { attachments });
    Notify.success("Attachments updated successfully");
    return response.data.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Error updating attachments");
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