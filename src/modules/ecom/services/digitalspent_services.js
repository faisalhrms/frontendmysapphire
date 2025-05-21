import api from "@config/axiosConfig.js";

export const fetchdigitalspent = async (filters) => {

    try {
        const response = await api.get(
            `digital_spent/fetch_objective_wise_summary/?till_date=${filters}`
        );
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};
