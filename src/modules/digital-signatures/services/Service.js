// services/Service.js
import api from "../../../config/axiosConfig";
import Notify from "@helpers/toastNotifications.js";

export const getAllSignatures = async () => {
  try {
    const response = await api.get("/signatures/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveSignature = async data => {
  try {
    const response = await api.post("/signatures/", data);
    return response;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to save signature. Please try again.";
    throw new Error(message);
  }
};

export const getSignature = async (employeeCode, company_id) => {
  try {
    const response = await api.get(`/signatures/${employeeCode}/`, {
      params: { company_id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching signature:", error);
    throw error;
  }
};


export const getDownloadByEmpCode = async (employeeCode, company_id) => {
  try {
    const response = await api.get(`/signatures/download/${employeeCode}/`, {
      params: { company_id },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${employeeCode}_OutlookSignature.exe`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    const msg = error.response?.data?.error || error.message;
    Notify.error(msg);
    throw error;
  }
};

export const handleDownloadHtml = async (empCode, company_id) => {
  try {
    const response = await api.get(`/signatures/download-htm/${empCode}/`, {
      params: { company_id },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${empCode}_Signature.htm`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    let message = "Failed to download HTML. Please try again.";
    const { response } = error;
    if (response?.data instanceof Blob) {
      try {
        const text = await response.data.text();
        const json = JSON.parse(text);
        if (json.error) message = json.error;
      } catch {}
    } else if (response?.data?.error) {
      message = response.data.error;
    }
    Notify.error(message);
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

export const getdeleteByEmpCode = async (employee_code, company_id) => {
  try {
    const response = await api.delete(`/signatures/delete/${employee_code}/`, {
      params: { company_id },
    });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.message;
    Notify.error(msg);
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
export const getDynamicTemplates = async () => {
  try {
    const response = await api.get("/signatures/dynamic_templates");
    return response.data;
  } catch (error) {
    throw error;
  }
};