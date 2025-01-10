// services/Service.js
import api from "../../../config/axiosConfig";

export const getAllSignatures = async () => {
  try {
    const response = await api.get("/signatures/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveSignature = async (data) => {
  try {
    const response = await api.post("/signatures/", data);
    return response;
  } catch (error) {
    console.error("Error saving signature:", error);
    throw error;
  }
};

export const getSignature = async (employeeCode) => {
  try {
    const response = await api.get(`/signatures/${employeeCode}/`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching signature:", error);
    throw error;
  }
};

export const getDownloadByEmpCode = async (employeeCode) => {
  try {
    const response = await api.get(`/signatures/download/${employeeCode}`, {
      responseType: "blob",
    });
    if (!response || !response.data) {
      throw new Error("No file data received from the server.");
    }
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    const contentDisposition = response.headers["content-disposition"];
    const fileName = contentDisposition
      ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
      : `signature_${employeeCode}.zip`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading file for employee code:", error);
    throw error;
  }
};

export const getDownloadAllS = async () => {
  try {
    const response = await api.get(`/signatures/download-all`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching discount data:", error);
    throw error;
  }
};

export const getdeleteByEmpCode = async (employee_code) => {
  try {
    const response = await api.delete(`/signatures/delete/${employee_code}/`);
    return response?.data;
  } catch (error) {
    console.error("Error deleting signature:", error);
    throw error;
  }
};

export const updateSignature = async (employee_code, updateData) => {
  try {
    const response = await api.put(`/signatures/update/${employee_code}/`, updateData);
    return response?.data;
  } catch (error) {
    console.error("Error updating signature:", error);
    throw error;
  }
};
