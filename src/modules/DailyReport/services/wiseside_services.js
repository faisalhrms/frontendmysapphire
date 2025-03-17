import api from "@config/axiosConfig.js";


export const fetchStoreWiseSaleData = async (p_date, filters) => {
    try {
        const response = await api.get("/reporting/fetch_store_wise_sale_data/", {
            params: {
                p_date: p_date,
                ...filters
            }
        });

        return response.data?.data;
    } catch (error) {
        console.error("Error fetching executive summary:", error);
        throw error;
    }
};
