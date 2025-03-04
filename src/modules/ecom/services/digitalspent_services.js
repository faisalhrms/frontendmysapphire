import api from "@config/axiosConfig.js";

export const fetchdigitalspent = async (data) => {
    try {
        const tillDate = data?.till_date || new Date().toISOString().split("T")[0];
        const response = await api.get(
            `digital_spent/fetch_objective_wise_summary/?till_date=${tillDate}`
        );
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};
