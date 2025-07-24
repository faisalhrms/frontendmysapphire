import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import debounce from 'lodash.debounce';
import qs from 'qs';
import { fetchData } from "@services/dataTableService.js";

export const useDataTable = (apiUrl, pageSize, filter = null, enableAdvancedFilters = false) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const [page, setPage] = useState(() => {
        const urlPage = searchParams.get('page');
        return urlPage ? parseInt(urlPage, 10) : 1;
    });

    const [size, setSize] = useState(() => {
        const urlSize = searchParams.get('size');
        return urlSize ? parseInt(urlSize, 10) : pageSize;
    });

    const [search, setSearch] = useState(() => {
        return searchParams.get('s') || '';
    });

    const [sortField, setSortField] = useState(() => {
        return searchParams.get('sort_field') || null;
    });

    const [sortDirection, setSortDirection] = useState(() => {
        return searchParams.get('sort_dir') || null;
    });

    const [advancedFilters, setAdvancedFilters] = useState(() => {
        if (!enableAdvancedFilters) return {};

        const queryString = searchParams.toString();
        const allParams = qs.parse(queryString, {
            ignoreQueryPrefix: true,
            depth: 5,
            allowDots: true
        });

        const { page: _, size: __, s: ___, sort_field: ____, sort_dir: _____, ...filters } = allParams;
        return filters;
    });

    const combinedFilters = {
        ...filter,
        ...advancedFilters,
    };

    const updateURL = useCallback((updates = {}) => {
        const currentParams = {
            page: updates.page !== undefined ? updates.page : page,
            size: updates.size !== undefined ? updates.size : size,
            s: updates.search !== undefined ? updates.search : search,
            sort_field: updates.sortField !== undefined ? updates.sortField : sortField,
            sort_dir: updates.sortDirection !== undefined ? updates.sortDirection : sortDirection,
            ...advancedFilters,
            ...(updates.advancedFilters !== undefined ? updates.advancedFilters : {})
        };

        const cleanParams = Object.entries(currentParams).reduce((acc, [key, value]) => {
            if (value !== null && value !== undefined && value !== '' &&
                !(Array.isArray(value) && value.length === 0) &&
                !(typeof value === 'object' && Object.keys(value).length === 0)) {
                acc[key] = value;
            }
            return acc;
        }, {});

        if (cleanParams.page === 1) {
            delete cleanParams.page;
        }

        if (cleanParams.size === pageSize) {
            delete cleanParams.size;
        }

        const queryString = qs.stringify(cleanParams, {
            encode: false,
            allowDots: true,
            arrayFormat: "brackets",
            skipNulls: true
        });

        setSearchParams(queryString);
    }, [page, size, search, sortField, sortDirection, advancedFilters, pageSize, setSearchParams]);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: [apiUrl, page, size, search, combinedFilters, sortField, sortDirection, enableAdvancedFilters],
        queryFn: fetchData,
        keepPreviousData: true,
        staleTime: 0,
        refetchOnWindowFocus: true,
        refetchOnReconnect: false,
    });

    const debouncedSearch = useCallback(
        debounce((value) => {
            setSearch(value);
            setPage(1);
            updateURL({ search: value, page: 1 });
        }, 200),
        [updateURL]
    );

    const debouncedFilterChange = useCallback(
        debounce((filters) => {
            setAdvancedFilters(filters);
            setPage(1);
            updateURL({ advancedFilters: filters, page: 1 });
        }, 300),
        [updateURL]
    );

    const handleSearch = useCallback(
        (e) => {
            debouncedSearch(e.target.value);
        },
        [debouncedSearch]
    );

    const handlePageChange = useCallback((newPage) => {
        setPage(newPage);
        updateURL({ page: newPage });
    }, [updateURL]);

    const handleSizeChange = useCallback((e) => {
        const newSize = Number(e.target.value);
        setSize(newSize);
        setPage(1);
        updateURL({ size: newSize, page: 1 });
    }, [updateURL]);

    const handleSortChange = useCallback((field, direction) => {
        setSortField(field);
        setSortDirection(direction);
        setPage(1);
        updateURL({ sortField: field, sortDirection: direction, page: 1 });
    }, [updateURL]);

    const handleFilterChange = useCallback((filters) => {
        debouncedFilterChange(filters);
    }, [debouncedFilterChange]);

    const applyAdvancedFilters = useCallback((filters) => {
        setAdvancedFilters(filters);
        setPage(1);
        updateURL({ advancedFilters: filters, page: 1 });
    }, [updateURL]);

    const clearAdvancedFilters = useCallback(() => {
        setAdvancedFilters({});
        setPage(1);
        updateURL({ advancedFilters: {}, page: 1 });
    }, [updateURL]);

    const resetAll = useCallback(() => {
        setSearch('');
        setPage(1);
        setSize(pageSize);
        setSortField(null);
        setSortDirection(null);
        setAdvancedFilters({});
        setSearchParams('');
    }, [pageSize, setSearchParams]);

    useEffect(() => {
        const urlPage = searchParams.get('page');
        const urlSize = searchParams.get('size');
        const urlSearch = searchParams.get('s');
        const urlSortField = searchParams.get('sort_field');
        const urlSortDirection = searchParams.get('sort_dir');

        if (urlPage && parseInt(urlPage, 10) !== page) {
            setPage(parseInt(urlPage, 10));
        }

        if (urlSize && parseInt(urlSize, 10) !== size) {
            setSize(parseInt(urlSize, 10));
        }

        if ((urlSearch || '') !== search) {
            setSearch(urlSearch || '');
        }

        if (urlSortField !== sortField) {
            setSortField(urlSortField);
        }

        if (urlSortDirection !== sortDirection) {
            setSortDirection(urlSortDirection);
        }

        if (enableAdvancedFilters) {
            const queryString = searchParams.toString();
            const allParams = qs.parse(queryString, {
                ignoreQueryPrefix: true,
                depth: 5,
                allowDots: true
            });

            const { page: _, size: __, s: ___, sort_field: ____, sort_dir: _____, ...filters } = allParams;

            if (JSON.stringify(filters) !== JSON.stringify(advancedFilters)) {
                setAdvancedFilters(filters);
            }
        }
    }, [searchParams, enableAdvancedFilters]);

    return {
        data,
        isLoading,
        error,
        refetch,
        page,
        setPage: handlePageChange,
        size,
        search,
        advancedFilters,
        sortField,
        sortDirection,
        handleSearch,
        handleSizeChange,
        handleSortChange,
        handleFilterChange,
        applyAdvancedFilters,
        clearAdvancedFilters,
        resetAll,
        updateURL,
    };
};