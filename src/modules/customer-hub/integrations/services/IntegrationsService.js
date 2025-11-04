import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const listChannels = async (params = {}) => {
  const res = await api.get("customer-hub/integrations/channels/", { params });
  return res.data?.data || res.data;
};

export const testChannel = async (id) => {
  const res = await api.post(`customer-hub/integrations/channels/${id}/test-connection/`);
  return res.data?.data || res.data;
};

export const ingestAgreementsApi = async (payload) => {
  const res = await api.post("customer-hub/integrations/agreements/ingest/", payload);
  Notify.success("Submitted");
  return res.data?.data || res.data;
};

export const downloadAgreementsTemplate = async () => {
  window.open("customer-hub/integrations/agreements/template/", "_self");
};

export const uploadAgreementsExcel = async (file, { channel_id }) => {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("channel_id", channel_id);
  const res = await api.post("customer-hub/integrations/agreements/upload/", fd, { headers: { "Content-Type": "multipart/form-data" } });
  Notify.success("Uploaded");
  return res.data?.data || res.data;
};

export const saveChannel = async (payload) => {
  const res = await api.post("customer-hub/integrations/channels/", payload);
  Notify.success("Saved");
  return res.data?.data || res.data;
};

export const manualFetchEmails = async (payload) => {
  const res = await api.post("customer-hub/manual-fetch-emails/", payload);
  return res.data?.data || res.data;
};

export const reprocessEmails = async (payload) => {
  const res = await api.post("customer-hub/reprocess-emails/", payload);
  return res.data?.data || res.data;
};

