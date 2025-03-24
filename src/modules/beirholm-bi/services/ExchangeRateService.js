import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createExchangeRate = async (exchangeRatesData) => {
  try {
    const response = await api.post("exchange/rate/", exchangeRatesData);
    Notify.success("Successfully Created!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create Exchange Rate");
    throw error;
  }
};

export const getExchangeRateById = async (id) => {
  try {
    const response = await api.get(`exchange/rate/${id}/`);
    return response?.data?.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch Exchange Rate details");
    throw error;
  }
};

export const updateExchangeRate = async (id, exchangeRateData) => {
  try {
    const response = await api.put(`exchange/rate/${id}/`, exchangeRateData);
    Notify.success("Updated Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update Exchange Rate");
    throw error;
  }
};
