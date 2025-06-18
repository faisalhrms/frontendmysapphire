import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";


export const submitCase = async (caseData) => {
    try {
        const response = await api.post('/customer-assist/', caseData);
        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
        throw error;
    }
};



export const getCustomerCase = async (type, value) => {
    try {
        const response = await api.get(`/customer-assist/customer-case/${value}?type=${type}`);
        if (response.data.status) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || "Failed to fetch data");
        }
    } catch (error) {
        Notify.error(error.message || "An error occurred while fetching data");
        throw error;
    }
};

export const updateCustomerCase  = async (id, caseData) => {
    try {
        const response = await api.put(`/customer-assist/${id}/`, caseData);

        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

// Get equipment details by its ID
export const getCustomerCaseById = async (id) => {
    try {
        const response = await api.get(`/customer-assist/${id}/`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};


