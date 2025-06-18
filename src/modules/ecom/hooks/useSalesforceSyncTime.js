import { useQuery } from '@tanstack/react-query';
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";

/**
 * Custom Hook to fetch Salesforce sync time with React Query.
 *
 * @param {string} endpoint - The API endpoint (default: '/salesforce/fetch_sync_time_cc/').
 * @param {string} syncType - Sync type query param (default: 'main').
 * @param {string} method - HTTP method ('get' or 'post', default: 'post').
 * @returns {object} - syncTime, errorMessage, isLoading, refetch
 */
const useSalesForceSyncTime = (endpoint = '/salesforce/fetch_sync_time_cc/', syncType = 'main', method = 'post') => {
    const queryKey = ['salesforce-sync-time', endpoint, syncType, method];

    const fetchSyncTime = async () => {
        const url = `${endpoint}?sync_type=${syncType}`;
        const response = method === 'post' ? await api.post(url) : await api.get(url);
        return response.data.data.show_sync_time;
    };

    const {
        data: syncTime,
        error,
        isLoading,
        refetch,
    } = useQuery({
        queryKey,
        queryFn: fetchSyncTime,
        staleTime: 0,
        retry: 1,
        keepPreviousData: true,
        refetchOnWindowFocus: true,
        onError: (error) => {
            let message = '';
            if (error.response) {
                if (error.response.status === 404) {
                    message = "The data was last updated on Feb 25, 2025 - 04:15 PM";
                } else {
                    message = `Error fetching sync time: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
                }
            } else if (error.request) {
                message = "No response from the server. Please check your connection.";
            } else {
                message = `Error: ${error.message}`;
            }
            Notify.error(message);
        },
    });

    const errorMessage = error?.response?.status === 404
        ? "The data was last updated on Feb 25, 2025 - 04:15 PM"
        : error?.response?.data?.message || error?.message || '';

    return { syncTime, errorMessage, isLoading, refetch };
};

export default useSalesForceSyncTime;
