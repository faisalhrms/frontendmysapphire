import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createProcessMethod = async (ProcessMethodData) => {
  try {
    const response = await api.post("process/method/", ProcessMethodData);
    Notify.success("Successfully Created!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create ProcessMethod");
    throw error;
  }
};

export const getProcessMethodById = async (id) => {
  try {
    const response = await api.get(`process/method/${id}/`);
    return response?.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch ProcessMethod details");
    throw error;
  }
};

export const updateProcessMethod = async (id, ProcessMethodData) => {
  try {
    const response = await api.put(`process/method/${id}/`, ProcessMethodData);
    Notify.success("Updated Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update ProcessMethod");
    throw error;
  }
};

export const deleteProcessMethod = async (id, ProcessMethodData) => {
  try {
    const response = await api.delete(`process/method/${id}/`, ProcessMethodData);
    Notify.success("Delete Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to Delete ProcessMethod");
    throw error;
  }
};

