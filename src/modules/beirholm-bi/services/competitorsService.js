import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createCompetitor = async (payload) => {
  try {
    const res = await api.post("/competitors/", payload);
    Notify.success(res.data.message);
    return res.data.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Error creating competitor analysis");
    throw error;
  }
};

export const getCompetitorById = async (id) => {
  try {
    const res = await api.get(`/competitors/${id}/`);
    return res.data.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Error fetching competitor analysis");
    throw error;
  }
};

export const updateCompetitor = async (id, payload) => {
  try {
    const res = await api.put(`/competitors/${id}/`, payload);
    Notify.success(res.data.message);
    return res.data.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Error updating competitor analysis");
    throw error;
  }
};

export const COMPETITOR_TYPES = [
  { label: "International Competitors", value: "International Competitors" },
  { label: "Pakistan Competitors", value: "Pakistan Competitors" },
];