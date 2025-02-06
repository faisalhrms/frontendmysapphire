
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const localfyobInt = async (fyobData) => {
    try {
        const response = await api.post("/ecom/fetch_fyob_local/", {"as_on_date": "2025-02-03"});
        Notify.success("Successfully Created FYOB Local!");
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to create FYOB Local");
        throw error;
    }
};
export const createFyobInt = async (fyobData) => {
    try {
        const response = await api.post("/ecom/fetch_fyob_int/", {"as_on_date": "2025-02-03"});
        Notify.success("Successfully Created FYOB International!");
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Failed to create FYOB International");
        throw error;
    }
};



