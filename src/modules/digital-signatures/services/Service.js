import api from "../../../config/axiosConfig";

export const saveSignature = async (data) => {
  console.table(data);
  try {
    const response = await api.post("/signatures/", data);
    return response;
  } catch (error) {
    console.error("Error fetching discount data:", error);
  }
};

export const getSignature = async (data) => {
  console.table(data);
  try {
    const response = await api.get(`/signatures/${data}/`);
    console.log(response);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching discount data:", error);
  }
};

export const getSignatureByEmpCode = async (employeeCode) => {
  console.table(employeeCode);
  try {
    const response = await api.get(`/signatures/${employeeCode}`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching discount data:", error);
  }
};


export const getDownloadByEmpCode = async (employeeCode) => {
  try {
    const response = await api.get(`/signatures/download/${employeeCode}`); 
    return response?.data;
  } catch (error) {
    console.error("Error fetching discount data:", error);
  }
};


export const getDownloadAllS = async () => {
  try {
    const response = await api.get(`/signatures/download-all`); 
    return response?.data;
  } catch (error) {
    console.error("Error fetching discount data:", error);
  }
};
