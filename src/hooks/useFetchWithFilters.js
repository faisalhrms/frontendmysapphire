import { useQuery } from '@tanstack/react-query';
import api from "@config/axiosConfig.js";
import Notify from "@helpers/toastNotifications.js";
import { useMemo } from "react";
const buildQueryString = (filters) => {
    let queryString = '';

    Object.entries(filters).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            // If the value is an array, append each element with the 'key[]' syntax
            value.forEach(item => {
                queryString += `${key}[]=${encodeURIComponent(item)}&`;
            });
        } else {
            // If the value is not an array, append normally
            queryString += `${key}=${encodeURIComponent(value)}&`;
        }
    });

    // Remove the trailing '&' if any
    return queryString ? queryString.slice(0, -1) : '';
};

const cleanFilters = (filters) => {
    const cleanedFilters = { ...filters };

    // Iterate over each entry and split comma-separated values into arrays if needed
    Object.entries(cleanedFilters).forEach(([key, value]) => {
        if (typeof value === 'string' && value.includes(',')) {
            cleanedFilters[key] = value.split(',').map(item => item.trim());
        }
    });

    // Remove invalid filters (undefined, null, or empty string)
    return Object.fromEntries(
        Object.entries(cleanedFilters).filter(([_, value]) => value !== undefined && value !== null && value !== '')
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
        const queryString = buildQueryString(cleanedFilters);  // Use the manual query string builder
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
