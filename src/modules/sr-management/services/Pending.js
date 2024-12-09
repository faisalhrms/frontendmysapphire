import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const pendingStatuses = [
  { value: 'available', label: 'Available' },
  { value: 'in_use', label: 'In Use' },
  { value: 'maintenance', label: 'Maintenance' },
];

export const fetchPendingRequests = async () => {
  try {
    const response = await api.get('/service-requests/pending-requests');
    return response.data.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Error fetching pending requests");
  }
};

export const createPendingRequest = async (requestData) => {
  try {
    const response = await api.post('/service-requests', requestData);
    Notify.success(response.data.message || "Pending request created successfully");
    return response.data.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Error creating pending request");
  }
};

export const createTask = async (id, requestData) => {
  console.log("Sending request data:", requestData);
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
    const response = await api.get(`/service-requests/${id}`);
    return response.data.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Error fetching service request");
  }
};

export const getTaskById = async (id) => {
  try {
    const response = await api.get(`/sr-task/${id}`);
    return response.data.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Error fetching service request");
  }
};

