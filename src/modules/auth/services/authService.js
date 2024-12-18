import api from "@config/axiosConfig.js";

export const fetchPermissions = async () => {
    try {
        const response = await api.get('/auth/permissions/');
        return response.data.data;
    }catch (error){
        throw new Error(error.response?.data?.message || 'An error occurred');
    }
};