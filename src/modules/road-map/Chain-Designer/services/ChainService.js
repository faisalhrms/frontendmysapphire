import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import {downloadFile} from "@modules/beirholm-bi/services/DataSanitizeService.js";

export const createChain = async (chainData) => {
  try {
    const response = await api.post("chain/", chainData);
    Notify.success("Successfully Created!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create chain ");
    throw error;
  }
};

export const getChainById = async (id) => {
  try {
    const response = await api.get(`chain/${id}/`);
    return response?.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch chain  details");
    throw error;
  }
};

export const updateChain = async (id, chainData) => {
  try {
    const response = await api.put(`chain/${id}/`, chainData);
    Notify.success("Updated Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update chain ");
    throw error;
  }
};

export const deleteChain = async (id, chainData) => {
  try {
    const response = await api.delete(`chain/${id}/`, chainData);
    Notify.success("Delete Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to Delete chain ");
    throw error;
  }
};

export const downloadChainSample = async () => {
    const url = `/chain/download-sample-file/`;
    await downloadFile(url, "sample_file.xlsx");
};
