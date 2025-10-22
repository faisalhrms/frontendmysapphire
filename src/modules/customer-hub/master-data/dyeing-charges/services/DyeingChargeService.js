import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createDyeingCharge = async (payload) => {
  try {
    const res = await api.post("customer-hub/dyeing-charges/", { dyeingCharge: payload });
    Notify.success("Saved");
    return res.data;
  } catch (e) {
    Notify.error(e.response?.data?.message || "Failed to save");
    throw e;
  }
};

export const updateDyeingCharge = async (id, payload) => {
  try {
    const res = await api.put(`customer-hub/dyeing-charges/${id}/`, { dyeingCharge: payload });
    Notify.success("Updated");
    return res.data;
  } catch (e) {
    Notify.error(e.response?.data?.message || "Failed to update");
    throw e;
  }
};

export const getDyeingChargeById = async (id) => {
  try {
    const res = await api.get(`customer-hub/dyeing-charges/${id}/`);
    return res.data;
  } catch (e) {
    Notify.error(e.response?.data?.message || "Failed to fetch");
    throw e;
  }
};

export const exportDyeingCharges = async (params = {}) => {
  const res = await api.get("customer-hub/dyeing-charges/export/", { params, responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "dyeing_charges.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const uploadDyeingCharges = async (file, params = {}) => {
  const fd = new FormData();
  fd.append("file", file);
  if (params.quality_code) fd.append("quality_code", params.quality_code);
  if (params.effective_date) fd.append("effective_date", params.effective_date);
  const res = await api.post("customer-hub/dyeing-charges/bulk-upload/", fd, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data;
};
