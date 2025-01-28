import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createSrType = async (srTypeData) => {
  try {
    const response = await api.post("/setups/sr-types/", srTypeData);
    Notify.success("Sr Type Created Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create Sr Type");
    throw error;
  }
};

export const getSrTypes = async () => {
  try {
    const response = await api.get("/setups/sr-types/datatable/");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch Sr Types");
    throw error;
  }
};

export const getSrTypeById = async (id) => {
  try {
    const response = await api.get(`/setups/sr-types/${id}/`);
    return response?.data?.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch Sr Type details");
    throw error;
  }
};

export const updateSrType = async (id, srTypeData) => {
  try {

    const response = await api.get(`/setups/sr-types/${id}/`, srTypeData);
    Notify.success("Sr Type Updated Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update Sr Type");
    throw error;
  }
};
