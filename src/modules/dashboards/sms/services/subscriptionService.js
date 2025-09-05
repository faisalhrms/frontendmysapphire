// subscriptionService.js

import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const getSubscriptionSummary = async () => {
    try {
        const response = await api.get('/dashboard/subscriptions/summary/');
        console.log(`summary`,response);
        return response.data.data;// Assuming data is in response.data.data
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Error fetching subscription summary');
        throw error;
    }
};

export const getActiveAndPendingSubscriptions = async () => {
    try {
        const response = await api.get('/dashboard/subscriptions/active-pending/');
        console.log(`active pending`,response);
        return response.data.data; // Assuming data is in response.data.data

    } catch (error) {
        Notify.error(error.response?.data?.message || 'Error fetching active and pending subscriptions');
        throw error;
    }
};

export const getChartData = async () => {
    try {
        const response = await api.get('/dashboard/subscriptions/charts/');
        console.log(`charts`,response);
        return response.data.data; // Assuming data is in response.data.data
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Error fetching chart data');
        throw error;
    }
};

export const getMonthlySpend = async () => {
    try {
        const response = await api.get("/dashboard/subscriptions/monthly-spend/");
        console.log("monthly spend", response);
        return response.data.data;
    } catch (error) {
        Notify.error(error.response?.data?.message || "Error fetching monthly spend data");
        throw error;
    }
};

export const getCountByDepartment = async () => {
    try {
        const response = await api.get("/dashboard/subscriptions/count-by-department/");
        console.log("count by department", response);
        return response.data.data; // API returns data inside `data`
    } catch (error) {
        Notify.error(error.response?.data?.message || "Error fetching count by department");
        throw error;
    }
};

export const getCountByVendor = async () => {
    try {
        const response = await api.get("/dashboard/subscriptions/count-by-vendor/");
        console.log("count by vendor", response);
        return response.data.data; // API returns inside `data`
    } catch (error) {
        Notify.error(error.response?.data?.message || "Error fetching count by vendor");
        throw error;
    }
};
export const getUpcomingRenewals = async (days = 10) => {
    try {
        const response = await api.get(`/dashboard/subscriptions/upcoming-renewals/?days=${days}`);
        console.log("upcoming renewals", response);
        return response.data.data; // Assuming response follows { data: [...] }
    } catch (error) {
        Notify.error(error.response?.data?.message || "Error fetching upcoming renewals");
        throw error;
    }
};