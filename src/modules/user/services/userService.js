import api from "@config/axiosConfig.js";
import Notify from "../../../helpers/toastNotifications.js";

export const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'deactivated', label: 'Deactivated' }
];
export const emailHost=[
    {value:'d365',label:'D365'},
    {value:'mdaemon',label:'Mdaemon'},
]
export const booleanOptions = [
    { value: true, label: "Yes" },
    { value: false, label: "No" },
];


export const createUser = async (userData) => {
    try {
        const response = await api.post('/users/', userData);
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
        throw Error(error.response?.data?.message || 'An error occurred while updating the user.');
    }
};

export const updateUser = async (id, userData) => {

    try {
        const response = await api.put(`/users/${id}/update/`, userData);
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
        throw new Error(error.response?.data?.message || 'An error occurred while updating the user.');
    }
};
export const updateOtherUser = async (id, userData) => {

    try {
        const response = await api.put(`/users/${id}/other-update/`, userData);
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
        throw new Error(error.response?.data?.message || 'An error occurred while updating the user.');
    }
};


export const getUserById = async (id) => {
    try {
        const response = await api.get(`/users/${id}/detail/`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

export const getOtherUserById = async (id) => {
    try {
        const response = await api.get(`/users/${id}/other-user-detail/`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

export const createOtherUser = async (payload) => {
    try {
        const response = await api.post('/users/other/', payload);
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
        throw Error(error.response?.data?.message || 'An error occurred while creating the user.');
    }
};
