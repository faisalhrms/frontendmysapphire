import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createCompany = async (companyData) => {
  try {
    const response = await api.post("/setups/company/", companyData);
    Notify.success("Successfully Created!");

    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create company");
    throw error;
  }
};

export const getCompanies = async () => {
  try {
    const response = await api.get("/setups/company/datatable/");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch companies");
    throw error;
  }
};

export const getCompanyById = async (id) => {
  try {
    const response = await api.get(`/setups/company/${id}/`);
    console.log(response)
    return response?.data?.data;
  } catch (error) {
    Notify.error(
      error.response?.data?.message || "Failed to fetch company details"
    );
    throw error;
  }
};

export const updateCompany = async (id, companyData) => {
  try {
    const response = await api.put(`/setups/company/${id}/`, companyData);
    Notify.success("Updated Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update company");
    throw error;
  }
};

export const deleteCompanyById = async (id) => {
  try {
    const response = await api.delete(`/setups/company/${id}/`);
    Notify.success("Deleted Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(
      error.response?.data?.message || "Failed to delete company details"
    );
    throw error;
  }
};
