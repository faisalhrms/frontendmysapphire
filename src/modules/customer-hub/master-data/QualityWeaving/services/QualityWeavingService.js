import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createQualityWeaving = async (payload) => {
  try {
    const res = await api.post("customer-hub/quality-weaving/", { qualityWeaving: payload });
    Notify.success("Saved");
    return res.data;
  } catch (e) {
    Notify.error(e.response?.data?.message || "Failed to save");
    throw e;
  }
};

export const updateQualityWeaving = async (id, payload) => {
  try {
    const res = await api.put(`customer-hub/quality-weaving/${id}/`, { qualityWeaving: payload });
    Notify.success("Updated");
    return res.data;
  } catch (e) {
    Notify.error(e.response?.data?.message || "Failed to update");
    throw e;
  }
};

export const getQualityWeavingById = async (id) => {
  const res = await api.get(`customer-hub/quality-weaving/${id}/`);
  return res.data;
};

export const exportQualityWeaving = async () => {
  try {
    const res = await api.get("customer-hub/quality-weaving/export/", { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "quality_weaving.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    Notify.error(e.response?.data?.message || "Failed to download");
  }
};

export const uploadQualityWeaving = async (file) => {
  const form = new FormData();
  form.append("file", file);
  try {
    const res = await api.post("customer-hub/quality-weaving/upload/", form, { headers: { "Content-Type": "multipart/form-data" } });
    return res.data;
  } catch (e) {
    Notify.error(e.response?.data?.message || "Failed to upload");
    throw e;
  }
};
