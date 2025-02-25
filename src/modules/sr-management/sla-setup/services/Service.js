import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createSLA = async (digitalProfilesData) => {
  try {
    const response = await api.post("sr_sla/", digitalProfilesData);
    Notify.success("Successfully Created!");

    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create Digital Profiles");
    throw error;
  }
};

export const getSLA = async () => {
  try {
    const response = await api.get("sr_sla/datatable/");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch DigitalProfiles");
    throw error;
  }
};

export const getSLAById = async (id) => {
  try {
    const response = await api.get(`sr_sla/${id}/`);
    console.log(response)
    return response?.data?.data;
  } catch (error) {
    Notify.error(
      error.response?.data?.message || "Failed to fetch DigitalProfiles details"
    );
    throw error;
  }
};

export const updateSLA = async (id, digitalProfilesData) => {
  try {
    const response = await api.put(`sr_sla/${id}/`, digitalProfilesData);
    Notify.success("Updated Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update DigitalProfiles");
    throw error;
  }
};

export const deleteSLAById = async (id) => {
  try {
    const response = await api.delete(`sr_sla/${id}/`);
    Notify.success("Deleted Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(
      error.response?.data?.message || "Failed to delete DigitalProfiles details"
    );
    throw error;
  }
};
