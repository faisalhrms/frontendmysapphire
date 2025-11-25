import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createWeavingParameter = async (payload) => {
  try {
    const res = await api.post("customer-hub/weaving-params/", { weavingParameter: payload });
    Notify.success("Saved");
    return res.data;
  } catch (e) {
    Notify.error(e.response?.data?.message || "Failed to save");
    throw e;
  }
};

export const updateWeavingParameter = async (id, payload) => {
  try {
    const res = await api.put(`customer-hub/weaving-params/${id}/`, { weavingParameter: payload });
    Notify.success("Updated");
    return res.data;
  } catch (e) {
    Notify.error(e.response?.data?.message || "Failed to update");
    throw e;
  }
};

export const getWeavingParameterById = async (id) => {
  const res = await api.get(`customer-hub/weaving-params/${id}/`);
  return res.data;
};

export const exportWeavingParameters = async () => {
  try {
    const res = await api.get("customer-hub/weaving-params/export/", { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = "weaving_parameters.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    Notify.error(e.response?.data?.message || "Failed to download");
  }
};

export const uploadWeavingParameters = async (file) => {
  const form = new FormData();
  form.append("file", file);
  try {
    const res = await api.post("customer-hub/weaving-params/upload/", form, { headers: { "Content-Type": "multipart/form-data" } });
    return res.data;
  } catch (e) {
    Notify.error(e.response?.data?.message || "Failed to upload");
    throw e;
  }
};

export const deleteWeavingParameter = async (id) => {
  try {
    const res = await api.delete(`customer-hub/weaving-params/${id}/`);
    Notify.success("Deleted");
    return res.data;
  } catch (e) {
    Notify.error(e.response?.data?.message || "Failed to delete");
    throw e;
  }
};