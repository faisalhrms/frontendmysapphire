import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createDyesMethod = async (DyesMethodData) => {
  try {
    const response = await api.post("dyes/method/", DyesMethodData);
    Notify.success("Successfully Created!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create Dyes Method");
    throw error;
  }
};

export const getDyesMethodById = async (id) => {
  try {
    const response = await api.get(`dyes/method/${id}/`);
    return response?.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch Dyes Method details");
    throw error;
  }
};

export const updateDyesMethod = async (id, DyesMethodData) => {
  try {
    const response = await api.put(`dyes/method/${id}/`, DyesMethodData);
    Notify.success("Updated Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update Dyes Method");
    throw error;
  }
};

export const deleteDyesMethod = async (id, DyesMethodData) => {
  try {
    const response = await api.delete(`dyes/method/${id}/`, DyesMethodData);
    Notify.success("Delete Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to Delete Dyes Method");
    throw error;
  }
};

