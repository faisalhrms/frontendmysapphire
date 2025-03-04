import api from "@config/axiosConfig.js";

export const fetch404ErrorSummary = async (data) => {
    try {
        const dateFrom = data?.date_from || new Date().toISOString().split("T")[0];
        const dateTo = data?.date_to || new Date().toISOString().split("T")[0];

        const response = await api.get(
            `/ecom/analytics/fetch_404_error_summary/?date_from=${dateFrom}&date_to=${dateTo}`
        );
        console.log(response);
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};
export const fetch404ErrorDetails = async (date) => {
    try {
        const response = await api.get(`/ecom/analytics/fetch_404_error_details/?p_date=${date}`);
        return response.data?.data;
    } catch (error) {
        throw error;
    }
};
