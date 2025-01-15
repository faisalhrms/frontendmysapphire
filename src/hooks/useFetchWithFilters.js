import { useQuery } from '@tanstack/react-query';
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import { useMemo } from "react";

/**
 * Clean filters by removing invalid or undefined values.
 * @param {object} filters - The filters object.
 * @returns {object} - A cleaned filters object.
 */
const cleanFilters = (filters) => {
    return Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== null && value !== '')
    );
};

/**
 * Custom Hook for API Fetching with Filters
 * @param {string} endpoint - API endpoint to call.
 * @param {object} filters - Filters to be sent as query parameters.
 * @param {object} queryOptions - Additional options for query customization.
 * @returns {object} - Data, isLoading, error, and refetch function.
 */
export const useFetchWithFilters = (endpoint, filters = {}, queryOptions = {}) => {
    const cleanedFilters = useMemo(() => cleanFilters(filters), [filters]);

    const fetchFunction = async () => {
        const queryString = new URLSearchParams(cleanedFilters).toString();
        const url = queryString ? `${endpoint}?${queryString}` : endpoint;

        try {
            const response = await api.get(url);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    };

    const queryKey = useMemo(() => (endpoint ? [endpoint, cleanedFilters] : null), [endpoint, cleanedFilters]);

    const { data, error, isLoading, refetch } = useQuery({
        queryKey,
        queryFn: fetchFunction,
        enabled: !!queryKey,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        retry: 1,
        onError: (error) => {
            const errorMessage = error.response?.data?.message || 'Failed to fetch data';
            Notify.error(errorMessage);
        },
        ...queryOptions,
    });

    return { data, error, isLoading, refetch };
};
