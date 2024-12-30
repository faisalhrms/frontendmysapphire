import api from "./axiosConfig.js";

export const saveSignature = async (data) => {
    console.table(data)
  try {
    const response = await api.post("/signatures/", data);
    return response;
  } catch (error) {
    console.error("Error fetching discount data:", error);
  }
};



export const getSignature = async (data) => {
    console.table(data)
  try {
    const response = await api.get(`/signatures/${data}/`);
    console.log(response);
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching discount data:", error);
  }
};


