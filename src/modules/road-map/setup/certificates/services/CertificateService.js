import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createCertificate = async (CertificateData) => {
  try {
    const response = await api.post("certificate/", CertificateData);
    Notify.success("Successfully Created!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to create Certificate");
    throw error;
  }
};

export const getCertificateById = async (id) => {
  try {
    const response = await api.get(`certificate/${id}/`);
    return response?.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to fetch Certificate details");
    throw error;
  }
};

export const updateCertificate = async (id, CertificateData) => {
  try {
    const response = await api.put(`certificate/${id}/`, CertificateData);
    Notify.success("Updated Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to update Certificate");
    throw error;
  }
};

export const deleteCertificate = async (id, CertificateData) => {
  try {
    const response = await api.delete(`certificate/${id}/`, CertificateData);
    Notify.success("Delete Successfully!");
    return response.data;
  } catch (error) {
    Notify.error(error.response?.data?.message || "Failed to Delete Certificate");
    throw error;
  }
};

