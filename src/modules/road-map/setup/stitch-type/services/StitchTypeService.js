import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createStitchType = async (StitchTypeData) => {
  try {
    const response = await api.post("stitch/type/", StitchTypeData);
    Notify.success("Successfully Created!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create Stitch Type");
    throw error;
  }
};

export const getStitchTypeById = async (id) => {
  try {
    const response = await api.get(`stitch/type/${id}/`);
    return response?.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch Stitch Type details");
    throw error;
  }
};

export const updateStitchType = async (id, StitchTypeData) => {
  try {
    const response = await api.put(`stitch/type/${id}/`, StitchTypeData);
    Notify.success("Updated Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update Stitch Type");
    throw error;
  }
};

export const deleteStitchType = async (id, StitchTypeData) => {
  try {
    const response = await api.delete(`stitch/type/${id}/`, StitchTypeData);
    Notify.success("Delete Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to Delete Stitch Type");
    throw error;
  }
};

