import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createQuality = async (QualityData) => {
  try {
    const response = await api.post("quality/", QualityData);
    Notify.success("Successfully Created!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create Quality");
    throw error;
  }
};

export const getQualityById = async (id) => {
  try {
    const response = await api.get(`quality/${id}/`);
    return response?.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch Quality details");
    throw error;
  }
};

export const updateQuality = async (id, QualityData) => {
  try {
    const response = await api.put(`quality/${id}/`, QualityData);
    Notify.success("Updated Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update Quality");
    throw error;
  }
};

export const deleteQuality = async (id, QualityData) => {
  try {
    const response = await api.delete(`quality/${id}/`, QualityData);
    Notify.success("Delete Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to Delete Quality");
    throw error;
  }
};

