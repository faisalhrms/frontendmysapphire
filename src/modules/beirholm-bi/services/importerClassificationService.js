import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createImporterClassification = async (data) => {
  try {
    const response = await api.post("classification/", data);
    Notify.success("Importer Classification created successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create Importer Classification");
    throw error;
  }
};

export const getImporterClassificationById = async (id) => {
  try {
    const response = await api.get(`classification/${id}/`);
    return response?.data?.data;
  } catch (error) {
    Notify.error(
      error.response?.data?.message || "Failed to fetch Importer Classification details"
    );
    throw error;
  }
};

export const updateImporterClassification = async (id, data) => {
  try {
    const response = await api.put(`classification/${id}/`, data);
    Notify.success("Importer Classification updated successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update Importer Classification");
    throw error;
  }
};
