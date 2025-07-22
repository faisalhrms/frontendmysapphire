import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createUnitCategory = async (UnitCategoryData) => {
  try {
    const response = await api.post("unit/category/", UnitCategoryData);
    Notify.success("Successfully Created!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create Unit Category");
    throw error;
  }
};

export const getUnitCategoryById = async (id) => {
  try {
    const response = await api.get(`unit/category/${id}/`);
    return response?.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch Unit Category details");
    throw error;
  }
};

export const updateUnitCategory = async (id, UnitCategoryData) => {
  try {
    const response = await api.put(`unit/category/${id}/`, UnitCategoryData);
    Notify.success("Updated Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update Unit Category");
    throw error;
  }
};

export const deleteUnitCategory = async (id, UnitCategoryData) => {
  try {
    const response = await api.delete(`unit/category/${id}/`, UnitCategoryData);
    Notify.success("Delete Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to Delete Unit Category");
    throw error;
  }
};

export const businessUnit = [
    {value: 'CR', label: 'Creadore'},
    {value: 'BI', label: 'Beirholm'},
    {value: 'RD', label: 'R&D'},
];

export const categoryType = [
    {value: 'raw_material', label: 'Raw Material'},
    {value: 'unit', label: 'Unit'},
    {value: 'accessories', label: 'Accessories'},
    {value: 'packaging', label: 'Packaging'},
];