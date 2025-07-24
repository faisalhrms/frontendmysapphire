import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import { fetchData } from "@services/dataTableService.js";

export const useDataTable = (apiUrl, pageSize, filter = null, enableAdvancedFilters = false) => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(pageSize);
    const [search, setSearch] = useState('');

    // For server-side sorting
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);

    // For advanced filters
    const [advancedFilters, setAdvancedFilters] = useState({});

    // Combine all filters
    const combinedFilters = {
        ...filter,
        ...advancedFilters,
    };

    // Query - now includes advancedFilters in the queryKey
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: [apiUrl, page, size, search, combinedFilters, sortField, sortDirection, enableAdvancedFilters],
        queryFn: fetchData,
        keepPreviousData: true,
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchOnReconnect: false,
    });

    // Debounce the search to avoid spamming requests
    const debouncedSearch = useCallback(
        debounce((value) => {
            setSearch(value);
            setPage(1);
        }, 200),
        []
    );

    // Debounce advanced filters to avoid spamming requests
    const debouncedFilterChange = useCallback(
        debounce((filters) => {
            setAdvancedFilters(filters);
            setPage(1); // Reset to first page when filters change
        }, 300),
        []
    );

    // Public handlers
    const handleSearch = useCallback(
        (e) => {
            debouncedSearch(e.target.value);
        },
        [debouncedSearch]
    );

    const handleSizeChange = useCallback((e) => {
        setSize(Number(e.target.value));
        setPage(1);
    }, []);

    // Handle sort changes from DataTable
    const handleSortChange = useCallback((field, direction) => {
        setSortField(field);
        setSortDirection(direction);
        setPage(1); // Reset to first page on new sort
    }, []);

    // Handle advanced filter changes
    const handleFilterChange = useCallback((filters) => {
        debouncedFilterChange(filters);
    }, [debouncedFilterChange]);

    // Clear all advanced filters
    const clearAdvancedFilters = useCallback(() => {
        setAdvancedFilters({});
        setPage(1);
    }, []);

    return {
        data,
        isLoading,
        error,
        refetch,
        page,
        setPage,
        size,
        search,
        advancedFilters,
        handleSearch,
        handleSizeChange,
        handleSortChange,
        handleFilterChange,
        clearAdvancedFilters,
    };
};