import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createProduct = async (ProductData) => {
  try {
    const response = await api.post("product/", ProductData);
    Notify.success("Successfully Created!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create Product");
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await api.get(`product/${id}/`);
    return response?.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch Product details");
    throw error;
  }
};

export const updateProduct = async (id, ProductData) => {
  try {
    const response = await api.put(`product/${id}/`, ProductData);
    Notify.success("Updated Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update Product");
    throw error;
  }
};

export const deleteProduct = async (id, ProductData) => {
  try {
    const response = await api.delete(`product/${id}/`, ProductData);
    Notify.success("Delete Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to Delete Product");
    throw error;
  }
};

