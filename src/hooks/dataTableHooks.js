import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import { fetchData } from "@services/dataTableService.js";

export const useDataTable = (apiUrl, pageSize, filter = null) => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(pageSize);
    const [search, setSearch] = useState('');

    // For server-side sorting
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState(null);

    // Query
    const { data, isLoading, error, refetch } = useQuery({
        // Note: We add sortField & sortDirection to queryKey
        queryKey: [apiUrl, page, size, search, filter, sortField, sortDirection],
        queryFn: fetchData,
        keepPreviousData: false,
        staleTime: 0,
        refetchOnWindowFocus: false,
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

    // New: handle sort changes from DataTable
    const handleSortChange = useCallback((field, direction) => {
        setSortField(field);
        setSortDirection(direction);
        setPage(1); // usually we reset to first page on new sort
    }, []);

    return {
        data,
        isLoading,
        error,
        refetch,
        page,
        setPage,
        size,
        handleSearch,
        handleSizeChange,

        // Expose the new function to DataTable
        handleSortChange,
    };
};
