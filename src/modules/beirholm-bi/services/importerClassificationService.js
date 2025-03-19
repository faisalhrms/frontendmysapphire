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

export const uploadImporterClassificationExcel = async (formData) => {
  try {
    const response = await api.post("classification/upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    Notify.success("Importer Classification uploaded successfully!");
    return response.data;
  } catch (error) {
    Notify.error(
      error.response?.data?.message || "Failed to upload Importer Classification"
    );
    throw error;
  }
};

export const downloadImporterClassificationSample = async () => {
  try {
    const response = await api.get("classification/download-sample/", { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "importer_classification_sample.xlsx");
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to download sample file");
    throw error;
  }
};