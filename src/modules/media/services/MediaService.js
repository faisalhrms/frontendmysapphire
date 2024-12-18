import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const uploadMediaFiles = async (files) => {
    const formData = new FormData();
    Array.from(files).forEach((file, index) => {
        formData.append('files', file);
    });
    try {
        const response = await api.post('/media/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

export const getMediaFiles = async (page, size, s, t) => {
    try {
        const response = await api.get(`/media/datatable/`, {
            params: { skip: (page - 1) * size, limit: size, s, t },
        });
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

export const getMediaFileById = async (id) => {
    try {
        const response = await api.get(`/projects/${id}/`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response.data?.data?.message);
    }
};