import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const createApplicant = async (applicantData) => {
    try {
        const response = await api.post('/recruitment/applicants/', applicantData);

        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

// Update an existing equipment
export const updateApplicant = async (id, applicantData) => {
    try {
        const response = await api.put(`/recruitment/applicants/${id}/`, applicantData);

        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

// Get equipment details by its ID
export const getApplicantById = async (id) => {
    try {
        const response = await api.get(`/recruitment/applicants/${id}/`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};
