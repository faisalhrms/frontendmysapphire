import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
export const getUrpCards=async ()=>{
    try {
        const response=await api.get('dashboard/urp/statistics/')
        return response.data.data;
    }
    catch (error) {
        Notify.error(error.response?.message || 'Error fetching subscription summary');
        throw error;
    }
}