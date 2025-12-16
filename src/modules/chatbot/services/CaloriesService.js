import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createCaloriesChatSession = async () => {
  try {
    const response = await api.post("chatkit/calories/session/");
    return response.data;
  } catch (error) {
    Notify.error(
      error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Failed to start calorie coach",
    );
    throw error;
  }
};

export const getCalorieProfile = async () => {
  try {
    const res = await api.get("calories/profile/");
    return res.data;
  } catch (error) {
    Notify.error(
      error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to load calorie profile",
    );
    throw error;
  }
};

export const updateCalorieProfile = async payload => {
  try {
    const res = await api.patch("calories/profile/", payload);
    Notify.success("Calorie profile updated");
    return res.data;
  } catch (error) {
    Notify.error(
      error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to update calorie profile",
    );
    throw error;
  }
};

export const getCalorieDaySummary = async dateIso => {
  try {
    const response = await api.get("calories/entries/", {
      params: dateIso ? { date: dateIso } : {},
    });
    return response.data;
  } catch (error) {
    Notify.error(
      error?.response?.data?.errors?.detail ||
        error?.response?.data?.message ||
        "Failed to load calorie summary",
    );
  }
};

export const createCalorieEntry = async payload => {
  try {
    const response = await api.post("calories/entries/", payload);
    return response.data;
  } catch (error) {
    Notify.error(
      error?.response?.data?.errors?.detail ||
        error?.response?.data?.message ||
        "Failed to add entry",
    );
    throw error;
  }
};

export const updateCalorieEntry = async (id, payload) => {
  try {
    const response = await api.patch(`calories/entries/${id}/`, payload);
    return response.data;
  } catch (error) {
    Notify.error(
      error?.response?.data?.errors?.detail ||
        error?.response?.data?.message ||
        "Failed to update entry",
    );
    throw error;
  }
};

export const deleteCalorieEntry = async id => {
  try {
    await api.delete(`calories/entries/${id}/`);
    return true;
  } catch (error) {
    Notify.error(
      error?.response?.data?.errors?.detail ||
        error?.response?.data?.message ||
        "Failed to delete entry",
    );
  }
};

export const deleteCalorieEntryByMessageId = async messageId => {
  try {
    await api.delete(`calories/entries/by_message_id/?message_id=${encodeURIComponent(messageId)}`)
    return true;
  } catch (error) {
    Notify.error(
      error?.response?.data?.errors?.detail ||
        error?.response?.data?.message ||
        "Failed to delete entry",
    );
  }
};