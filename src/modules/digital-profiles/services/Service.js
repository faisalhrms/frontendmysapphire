import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createDigitalProfiles = async (digitalProfilesData) => {
  try {
    const response = await api.post("digital_profiles/", digitalProfilesData);
    Notify.success("Successfully Created!");

    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create Digital Profiles");
    throw error;
  }
};

export const getDigitalProfiles = async () => {
  try {
    const response = await api.get("digital_profiles/datatable/");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch DigitalProfiles");
    throw error;
  }
};

export const getDigitalProfilesById = async (id) => {
  try {
    const response = await api.get(`digital_profiles/${id}/`);
    console.log(response)
    return response?.data?.data;
  } catch (error) {
    Notify.error(
      error.response?.data?.message || "Failed to fetch DigitalProfiles details"
    );
    throw error;
  }
};

export const updateDigitalProfiles = async (id, digitalProfilesData) => {
  try {
    const response = await api.put(`digital_profiles/${id}/`, digitalProfilesData);
    Notify.success("Updated Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update DigitalProfiles");
    throw error;
  }
};

export const deleteDigitalProfilesById = async (id) => {
  try {
    const response = await api.delete(`digital_profiles/${id}/`);
    Notify.success("Deleted Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(
      error.response?.data?.message || "Failed to delete DigitalProfiles details"
    );
    throw error;
  }
};
