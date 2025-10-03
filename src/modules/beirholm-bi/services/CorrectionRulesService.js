import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createErrorCorrection = async (payload) => {
  try {
    const response = await api.post("error/correction/rule/", payload);
    Notify.success("Successfully Created!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create Error Correction");
    throw error;
  }
};

export const getErrorCorrection = async () => {
  try {
    return await api.get("error/correction/rule/datatable/");
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch Error Correction");
    throw error;
  }
};

export const getErrorCorrectionById = async (id) => {
  try {
    const response = await api.get(`error/correction/rule/${id}/`);
    return response?.data?.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch Error Correction details");
    throw error;
  }
};

export const updateErrorCorrection = async (id, payload) => {
  try {
    const response = await api.put(`error/correction/rule/${id}/`, payload);
    Notify.success("Updated Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update Error Correction");
    throw error;
  }
};

export const deleteErrorCorrectionById = async (id) => {
  try {
    const response = await api.delete(`error/correction/rule/${id}/`);
    Notify.success("Deleted Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to delete Error Correction");
    throw error;
  }
};

export const getParentErrors = async (fieldDefinitionId) => {
  try {
    return await api.get(`error/correction/rule/parent-errors/?field_definition_id=${fieldDefinitionId}`);
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch parent errors");
    throw error;
  }
};
export const downloadErrorCorrection = async () => {
  try {
    const response = await api.get("error/correction/rule/download/", { responseType: "blob" });
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to download Error Correction");
    throw error;
  }
};

export const downloadCorrectionTemplate = async () => {
  try {
    const { data } = await api.get("error/correction/rule/template/download/", { responseType: "blob" });
    return data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to download template");
    throw error;
  }
};

export const uploadCorrectionUpdates = async (file) => {
  try {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post("error/correction/rule/upload-updates/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data?.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to upload updates");
    throw error;
  }
};

export const getUploadUpdatesStatus = async (jobId) => {
  try {
    const { data } = await api.get(`error/correction/rule/upload-updates/status/${jobId}/`);
    return data?.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch update status");
    throw error;
  }
};

export const getActiveUploadUpdatesJob = async () => {
  try {
    const { data } = await api.get("error/correction/rule/upload-updates/active/");
    return data?.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch active job");
    throw error;
  }
};