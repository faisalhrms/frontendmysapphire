import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import debounce from 'lodash.debounce';
import {fetchData} from "@services/dataTableService.js";

export const useDataTable = (apiUrl, pageSize, filter = null) => {
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(pageSize);
    const [search, setSearch] = useState('');

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: [apiUrl, page, size, search, filter], // Add filter to query key
        queryFn: fetchData,
        keepPreviousData: false,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    const debouncedSearch = useCallback(debounce((value) => {
        setSearch(value);
        setPage(1);
    }, 200), []);

    const handleSearch = useCallback((e) => {
        debouncedSearch(e.target.value);
    }, [debouncedSearch]);

    const handleSizeChange = useCallback((e) => {
        setSize(Number(e.target.value));
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
        handleSearch,
        handleSizeChange,
    };
};
