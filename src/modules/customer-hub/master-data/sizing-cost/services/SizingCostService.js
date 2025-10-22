import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createSizing = async (payload) => {
  try {
    const { data } = await api.post("customer-hub/sizing-cost/", { sizingCostRule: payload });
    Notify.success("Sizing Cost saved");
    return data;
  } catch (e) {
    Notify.error(e?.response?.data?.message || "Failed to save");
    throw e;
  }
};

export const updateSizing = async (id, payload) => {
  try {
    const { data } = await api.put(`customer-hub/sizing-cost/${id}/`, { sizingCostRule: payload });
    Notify.success("Sizing Cost updated");
    return data;
  } catch (e) {
    Notify.error(e?.response?.data?.message || "Failed to update");
    throw e;
  }
};

export const getSizingById = async (id) => {
  const { data } = await api.get(`customer-hub/sizing-cost/${id}/`);
  return data;
};

export const deleteSizing = async (id) => {
  try {
    await api.delete(`customer-hub/sizing-cost/${id}/`);
    Notify.success("Sizing Cost deleted");
    return true;
  } catch (e) {
    Notify.error(e?.response?.data?.message || "Failed to delete");
    throw e;
  }
};

export const resolveSizingCost = async (warp_count) => {
  const { data } = await api.get("customer-hub/sizing-cost/resolve/", { params: { warp_count } });
  return data;
};
