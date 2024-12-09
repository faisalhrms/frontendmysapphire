import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
export const location = [
    { value: 'Gulberg', label: 'Gulberg' },
    { value: 'DHA', label: 'DHA' },
    { value: 'Johar Town', label: 'johar' }
];
export const sub_departments = [
    { value: 'HR', label: 'HR' },
    { value: 'IT', label: 'IT' },
    { value: 'Finance', label: 'Finance' }
];

export const sr_type = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' }
];


export const createServiceRequest=async (payload)=>{
    try {

        const response=await api.post('/service-requests',payload)
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {

        Notify.error(error.response?.data?.message);
        throw(error.response?.data?.message);
    }

}

export const saveServiceRequest=async (id,payload)=>{
    try {

        const response = await api.put(`/service-requests/${id}`,payload)
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
        throw(error.response?.data?.message);
    }
};

export const getServiceRequestById=async (id)=>{
    try {
        const response = await api.get(`/service-requests/${id}`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
}


export const getServiceRequest=async (page, size, s)=>{
try {
    const response=await api.get(`/service-requests/datatable`,{
        params: { skip: (page - 1) * size, limit: size, s },
    })
    return response.data.data;
} catch (error) {
    Notify.error(error.response?.data?.message);
    throw(error.response?.data?.message);
}
};


export const submitServiceRequest = async (id) => {
    try {
        const response = await api.post(`/service-requests/${id}/submit`, { is_submitted: true });
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
        throw error.response?.data?.message;
    }
};
