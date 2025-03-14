import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createPattern = async (payload) => {
  try {
    const response = await api.post("error/correction/pattern/", payload);
    Notify.success("Successfully Created!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create Error Pattern");
    throw error;
  }
};

export const getErrorPattern = async () => {
  try {
    return await api.get("error/correction/pattern/datatable/");
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch Error Pattern");
    throw error;
  }
};

export const getErrorPatternById = async (id) => {
  try {
    const response = await api.get(`error/correction/pattern/${id}/`);
    return response?.data?.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch Error Pattern details");
    throw error;
  }
};

export const updatePattern = async (id, payload) => {
  try {
    const response = await api.put(`error/correction/pattern/${id}/`, payload);
    Notify.success("Updated Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update Error Pattern");
    throw error;
  }
};

export const deletePatternById = async (id) => {
  try {
    const response = await api.delete(`error/correction/pattern/${id}/`);
    Notify.success("Deleted Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to delete Error Pattern");
    throw error;
  }
};

export const getParentPattern = async (fieldDefinitionId) => {
  try {
    return await api.get(`error/correction/pattern/parent-errors/?=${fieldDefinitionId}`);
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch parent Pattern");
    throw error;
  }
};
