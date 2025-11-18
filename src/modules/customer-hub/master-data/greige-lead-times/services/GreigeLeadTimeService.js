import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createGreigeLeadTime = async (payload) => {
  try {
    const res = await api.post("customer-hub/greige-lead-times/", { leadTime: payload });
    Notify.success("Saved");
    return res.data;
  } catch (e) {
    Notify.error(e.response?.data?.message || "Failed to save");
    throw e;
  }
};

export const updateGreigeLeadTime = async (id, payload) => {
  try {
    const res = await api.put(`customer-hub/greige-lead-times/${id}/`, { leadTime: payload });
    Notify.success("Updated");
    return res.data;
  } catch (e) {
    Notify.error(e.response?.data?.message || "Failed to update");
    throw e;
  }
};

export const getGreigeLeadTimeById = async (id) => {
  try {
    const res = await api.get(`customer-hub/greige-lead-times/${id}/`);
    return res.data;
  } catch (e) {
    Notify.error(e.response?.data?.message || "Failed to fetch");
    throw e;
  }
};

export const exportGreigeLeadTimes = async (params = {}) => {
  const res = await api.get("customer-hub/greige-lead-times/export/", { params, responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "greige_lead_times.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const uploadGreigeLeadTimes = async (file, params = {}) => {
  const fd = new FormData();
  fd.append("file", file);
  if (params.vendor_no) fd.append("vendor_no", params.vendor_no);
  if (params.quality_code) fd.append("quality_code", params.quality_code);
  const res = await api.post("customer-hub/greige-lead-times/bulk-upload/", fd, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data;
};
