import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createUnit = async (UnitData) => {
  try {
    const response = await api.post("unit/", UnitData);
    Notify.success("Successfully Created!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create Unit ");
    throw error;
  }
};

export const getUnitById = async (id) => {
  try {
    const response = await api.get(`unit/${id}/`);
    return response?.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch Unit  details");
    throw error;
  }
};

export const updateUnit = async (id, UnitData) => {
  try {
    const response = await api.put(`unit/${id}/`, UnitData);
    Notify.success("Updated Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update Unit ");
    throw error;
  }
};

export const deleteUnit = async (id, UnitData) => {
  try {
    const response = await api.delete(`unit/${id}/`, UnitData);
    Notify.success("Delete Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to Delete Unit ");
    throw error;
  }
};

