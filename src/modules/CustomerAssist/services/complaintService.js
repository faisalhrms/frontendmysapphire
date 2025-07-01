import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createStoreComplaint = async (complaintData) => {
    console.log(complaintData);
    try {
        const response = await api.post('/complaints/store', complaintData);
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

export const createOnlineComplaint = async (complaintData) => {
    console.log(complaintData);
    try {
        const response = await api.post('/complaints/online', complaintData);
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};