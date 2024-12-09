import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const getTaskApprovals = async (page, size) => {
    try {
        const response = await api.get(`/approvals/task`, {
            params: {skip: (page - 1) * size, limit: size},
        });
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

export const updateTaskApproval = async (approval_id, data) => {
    try {
        const response = await api.put(`/approvals/task/${approval_id}`, data);

        Notify.success(response.data.message);
        return response.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};