import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createCustomerItem = async (payload) => {
  try {
    const res = await api.post("customer-hub/customer-items/", { item: payload });
    Notify.success("Saved");
    return res.data;
  } catch (e) {
    Notify.error(e.response?.data?.message || "Failed to save");
    throw e;
  }
};

export const updateCustomerItem = async (id, payload) => {
  try {
    const res = await api.put(`customer-hub/customer-items/${id}/`, { item: payload });
    Notify.success("Updated");
    return res.data;
  } catch (e) {
    Notify.error(e.response?.data?.message || "Failed to update");
    throw e;
  }
};

export const getCustomerItemById = async (id) => {
  try {
    const res = await api.get(`customer-hub/customer-items/${id}/`);
    return res.data;
  } catch (e) {
    Notify.error(e.response?.data?.message || "Failed to fetch");
    throw e;
  }
};

export const downloadCustomerItemsTemplate = async () => {
  const res = await api.get("customer-hub/customer-items/template/", { responseType: "blob" });
  const blob = new Blob([res.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "customer_items_template.xlsx");
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const uploadCustomerItems = async (file) => {
  const fd = new FormData();
  fd.append("file", file);
  const res = await api.post("customer-hub/customer-items/bulk-upload/", fd, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data;
};

export const deleteCustomerItem = async (id) => {
  try {
    const res = await api.delete(`customer-hub/customer-items/${id}/`);
    Notify.success("Deleted");
    return res.data;
  } catch (e) {
    Notify.error(e.response?.data?.message || "Failed to delete");
    throw e;
  }
};