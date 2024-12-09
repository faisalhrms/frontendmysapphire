import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const users =[
    {value: 'rehab', label: 'Rehab'},
    {value: 'bilal', label: 'Bilal'},
    {value: 'salman', label: 'Salman'},
];


export const createHierarchy = async (hierarchyData) => {
    try {
        const response = await api.post('/hierarchy', hierarchyData);
        Notify.success(response.data.message);
        return response.data.data;
    }
    catch (error) {
        Notify.error(error.response?.data?.message);
    }
};


