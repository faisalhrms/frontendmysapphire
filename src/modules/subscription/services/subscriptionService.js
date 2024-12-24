import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const currencies =[
    {value: 'USD', label: 'USD'},
    {value: 'PKR', label: 'PKR'},
    {value: 'GBP', label: 'GBP'},
    {value: 'EUR', label: 'EUR'}
];

export const subscriptionStatuses = [
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "canceled", label: "Canceled" },
];


export const subscriptionTypes = [
    {value: 'paid', label: 'Paid'},
    {value: 'free', label: 'Free'}
];

export const reminderDays =[
    {value: 7, label: '7 Days'},
    {value: 14, label: '14 Days'},
    {value: 30, label: '30 Days'},
];

export const paymentCycle =[
    {value: 'monthly', label: 'Monthly'},
    {value: 'quarterly', label: 'Quarterly'},
    {value: 'yearly', label: 'Yearly'},
];

export const paymentStatus=[
    {value: 'paid', label: 'Paid'},
    {value: 'unpaid', label: 'Unpaid'},


]
export const paymentMethod=[
    {value: 'card', label: 'Card'},
    {value: 'cash', label: 'Cash'},
    {value: 'online', label: 'Online'},

]

export const createSubscription = async (subscriptionData) => {
    try {
        const response = await api.post('/subscriptions/', subscriptionData);
        Notify.success(response.data.message);
        return response.data.data;
    }
    catch (error) {
        Notify.error(error.response?.data?.message);
    }
};

export const updateSubscription = async (id, subscriptionData) => {
    console.log("Form Data Submitted:", subscriptionData.status);
    try {
        const response = await api.put(`/subscriptions/${id}/`, subscriptionData);
        Notify.success(response.data.message);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);

    }
}

export const getSubscriptionById = async (id) => {
    try {
        const response = await api.get(`/subscriptions/${id}/`);
        return response.data;

    } catch (error) {
        Notify.error(error.response?.data?.message);
    }
}

export const getFilteredSubscriptions = async (filterType, searchQuery, skip = 0, limit = 10) => {
    try {
        const params = new URLSearchParams();
        if (filterType) params.append("filter", filterType);
        if (searchQuery) params.append("s", searchQuery);
        params.append("skip", skip);
        params.append("limit", limit);

        const response = await api.get(`/subscriptions/datatable?${params.toString()}`);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message);
        throw error;
    }
};
export const renewSubscription = async (id, data) => {
    try {
        const response = await api.post(`/transactions/${id}/renew/`, data);
        Notify.success("Subscription renewed successfully");
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Error renewing subscription');
        throw error;
    }
};