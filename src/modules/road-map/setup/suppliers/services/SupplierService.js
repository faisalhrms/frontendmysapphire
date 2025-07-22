import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createSupplier = async (SupplierData) => {
  try {
    const response = await api.post("supplier/", SupplierData);
    Notify.success("Successfully Created!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create Supplier");
    throw error;
  }
};

export const getSupplierById = async (id) => {
  try {
    const response = await api.get(`supplier/${id}/`);
    return response?.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch Supplier details");
    throw error;
  }
};

export const updateSupplier = async (id, SupplierData) => {
  try {
    const response = await api.put(`supplier/${id}/`, SupplierData);
    Notify.success("Updated Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update Supplier");
    throw error;
  }
};

export const deleteSupplier = async (id, SupplierData) => {
  try {
    const response = await api.delete(`supplier/${id}/`, SupplierData);
    Notify.success("Delete Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to Delete Supplier");
    throw error;
  }
};

