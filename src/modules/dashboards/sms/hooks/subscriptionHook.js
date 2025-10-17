import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from "@config/axiosConfig.js";

/**
 * Custom hook to fetch subscription dashboard analytics
 * @returns {Object} { dashboardData, loading, error, refreshData }
 */
export const useSubscriptionDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Fetch dashboard data from API
     */
    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get('dashboard/subscriptions/analytics/');

            if (response.data) {
                setDashboardData(response.data);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message ||
                err.response?.data?.error ||
                'Failed to fetch dashboard data';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Refresh dashboard data
     */
    const refreshData = useCallback(() => {
        toast.info('Refreshing dashboard...');
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Fetch data on mount
    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return {
        dashboardData,
        loading,
        error,
        refreshData
    };
};

export default useSubscriptionDashboard;