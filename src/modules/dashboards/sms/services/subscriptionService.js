// subscriptionService.js

import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

export const getSubscriptionSummary = async () => {
    try {
        const response = await api.get('/subscriptions/summary');
        return response.data.data; // Assuming data is in response.data.data
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Error fetching subscription summary');
        throw error;
    }
};

export const getActiveAndPendingSubscriptions = async () => {
    try {
        const response = await api.get('/subscriptions/active-pending');
        return response.data.data; // Assuming data is in response.data.data
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Error fetching active and pending subscriptions');
        throw error;
    }
};

export const getChartData = async () => {
    try {
        const response = await api.get('/subscriptions/charts');
        return response.data.data; // Assuming data is in response.data.data
    } catch (error) {
        Notify.error(error.response?.data?.message || 'Error fetching chart data');
        throw error;
    }
};