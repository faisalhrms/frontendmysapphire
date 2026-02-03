import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash.debounce";
import qs from "qs";
import { fetchData } from "@services/dataTableService.js";

export const useDataTable = (
    apiUrl,
    pageSize,
    filter = null,
    enableAdvancedFilters = false,
    externalFilters = [],
    columns = [],
    hiddenParameters = [],
    hideUrlParams = false
) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // helpers: when hideUrlParams=true => ignore URL reads/writes
    const safeGet = useCallback(
        (key) => (hideUrlParams ? null : searchParams.get(key)),
        [hideUrlParams, searchParams]
    );

    const safeSet = useCallback(
        (queryString) => {
            if (!hideUrlParams) setSearchParams(queryString);
        },
        [hideUrlParams, setSearchParams]
    );

    const [page, setPage] = useState(() => {
        const urlPage = safeGet("page");
        return urlPage ? parseInt(urlPage, 10) : 1;
    });

    const [size, setSize] = useState(() => {
        const urlSize = safeGet("size");
        return urlSize ? parseInt(urlSize, 10) : pageSize;
    });

    const [search, setSearch] = useState(() => safeGet("s") || "");

    const [sortField, setSortField] = useState(() => safeGet("sort_field") || null);

    const [sortDirection, setSortDirection] = useState(() => safeGet("sort_dir") || null);

    // Get valid filterable column keys
    const getValidFilterKeys = useCallback(() => {
        return (columns || [])
            .filter((col) => col.filterable)
            .map((col) => col.filterKey || col.id || col.accessor)
            .filter(Boolean);
    }, [columns]);

    // Extract external filters from URL (ignored when hideUrlParams=true)
    const getExternalFiltersFromURL = useCallback(() => {
        if (hideUrlParams) return {};
        const externalFiltersFromURL = {};
        (externalFilters || []).forEach((key) => {
            const value = searchParams.get(key);
            if (value !== null && value !== undefined && value !== "") {
                externalFiltersFromURL[key] = value;
            }
        });
        return externalFiltersFromURL;
    }, [searchParams, externalFilters, hideUrlParams]);

    // Extract hidden params from URL (ignored when hideUrlParams=true)
    const getHiddenParamsFromURL = useCallback(() => {
        if (hideUrlParams) return {};
        const hidden = {};
        (hiddenParameters || []).forEach((key) => {
            const value = searchParams.get(key);
            if (value !== null && value !== undefined && value !== "") {
                hidden[key] = value;
            }
        });
        return hidden;
    }, [searchParams, hiddenParameters, hideUrlParams]);

    const [advancedFilters, setAdvancedFilters] = useState(() => {
        if (!enableAdvancedFilters) return {};
        if (hideUrlParams) return {}; // ✅ do not read from URL

        const queryString = searchParams.toString();
        const allParams = qs.parse(queryString, {
            ignoreQueryPrefix: true,
            depth: 5,
            allowDots: true,
        });

        const validFilterKeys = getValidFilterKeys();

        return Object.entries(allParams).reduce((acc, [key, value]) => {
            if (validFilterKeys.includes(key)) {
                acc[key] = value;
            }
            return acc;
        }, {});
    });

    const urlExternalFilters = getExternalFiltersFromURL();
    const hiddenParams = getHiddenParamsFromURL();

    const filterOutHiddenParams = useCallback(
        (filtersObj) => {
            if (!filtersObj) return {};
            return Object.keys(filtersObj).reduce((acc, key) => {
                if (!hiddenParameters.includes(key)) {
                    acc[key] = filtersObj[key];
                }
                return acc;
            }, {});
        },
        [hiddenParameters]
    );

    // Combine all filters for API call
    const combinedFilters = {
        ...filterOutHiddenParams(filter),
        ...filterOutHiddenParams(urlExternalFilters),
        ...filterOutHiddenParams(advancedFilters),
    };

    const updateURL = useCallback(
        (updates = {}) => {
            if (hideUrlParams) return; // ✅ no-op

            let currentParams = {
                page: updates.page !== undefined ? updates.page : page,
                size: updates.size !== undefined ? updates.size : size,
                s: updates.search !== undefined ? updates.search : search,
                sort_field: updates.sortField !== undefined ? updates.sortField : sortField,
                sort_dir:
                    updates.sortDirection !== undefined ? updates.sortDirection : sortDirection,
                ...urlExternalFilters,
                ...hiddenParams,
            };

            let newAdvancedFilters =
                updates.advancedFilters !== undefined ? updates.advancedFilters : advancedFilters;

            if (Object.keys(newAdvancedFilters).length === 0) {
                const validFilterKeys = getValidFilterKeys();
                validFilterKeys.forEach((key) => {
                    if (currentParams.hasOwnProperty(key)) {
                        delete currentParams[key];
                    }
                });
            } else {
                currentParams = { ...currentParams, ...newAdvancedFilters };
            }

            const cleanParams = Object.entries(currentParams).reduce((acc, [key, value]) => {
                if (
                    value !== null &&
                    value !== undefined &&
                    value !== "" &&
                    !(Array.isArray(value) && value.length === 0) &&
                    !(typeof value === "object" && Object.keys(value).length === 0)
                ) {
                    acc[key] = value;
                }
                return acc;
            }, {});

            if (cleanParams.page === 1) delete cleanParams.page;
            if (cleanParams.size === pageSize) delete cleanParams.size;

            const queryString = qs.stringify(cleanParams, {
                encode: false,
                allowDots: true,
                arrayFormat: "brackets",
                skipNulls: true,
            });

            safeSet(queryString);
        },
        [
            hideUrlParams,
            page,
            size,
            search,
            sortField,
            sortDirection,
            advancedFilters,
            urlExternalFilters,
            hiddenParams,
            pageSize,
            safeSet,
            getValidFilterKeys,
        ]
    );

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: [
            apiUrl,
            page,
            size,
            search,
            combinedFilters,
            sortField,
            sortDirection,
            enableAdvancedFilters,
            hideUrlParams, // harmless, ensures isolation if needed
        ],
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

    const handlePageChange = useCallback(
        (newPage) => {
            setPage(newPage);
            updateURL({ page: newPage });
        },
        [updateURL]
    );

    const handleSizeChange = useCallback(
        (e) => {
            const newSize = Number(e.target.value);
            setSize(newSize);
            setPage(1);
            updateURL({ size: newSize, page: 1 });
        },
        [updateURL]
    );

    const handleSortChange = useCallback(
        (field, direction) => {
            setSortField(field);
            setSortDirection(direction);
            setPage(1);
            updateURL({ sortField: field, sortDirection: direction, page: 1 });
        },
        [updateURL]
    );

    const handleFilterChange = useCallback(
        (filters) => {
            debouncedFilterChange(filters);
        },
        [debouncedFilterChange]
    );

    const applyAdvancedFilters = useCallback(
        (filters) => {
            setAdvancedFilters(filters);
            setPage(1);
            updateURL({ advancedFilters: filters, page: 1 });
        },
        [updateURL]
    );

    const clearAdvancedFilters = useCallback(() => {
        setAdvancedFilters({});
        setPage(1);
        updateURL({ advancedFilters: {}, page: 1 });
    }, [updateURL]);

    const resetAll = useCallback(() => {
        setSearch("");
        setPage(1);
        setSize(pageSize);
        setSortField(null);
        setSortDirection(null);
        setAdvancedFilters({});

        if (hideUrlParams) return; // ✅ don't touch URL

        // Keep external filters in URL when resetting
        const externalFiltersParams = {};
        (externalFilters || []).forEach((key) => {
            const value = searchParams.get(key);
            if (value !== null && value !== undefined && value !== "") {
                externalFiltersParams[key] = value;
            }
        });

        const queryString = qs.stringify(externalFiltersParams, {
            encode: false,
            allowDots: true,
            arrayFormat: "brackets",
            skipNulls: true,
        });

        safeSet(queryString);
    }, [pageSize, hideUrlParams, externalFilters, searchParams, safeSet]);

    // sync from URL -> state (disabled when hideUrlParams=true)
    useEffect(() => {
        if (hideUrlParams) return;

        const urlPage = searchParams.get("page");
        const urlSize = searchParams.get("size");
        const urlSearch = searchParams.get("s");
        const urlSortField = searchParams.get("sort_field");
        const urlSortDirection = searchParams.get("sort_dir");

        if (urlPage && parseInt(urlPage, 10) !== page) setPage(parseInt(urlPage, 10));
        if (urlSize && parseInt(urlSize, 10) !== size) setSize(parseInt(urlSize, 10));
        if ((urlSearch || "") !== search) setSearch(urlSearch || "");
        if (urlSortField !== sortField) setSortField(urlSortField);
        if (urlSortDirection !== sortDirection) setSortDirection(urlSortDirection);

        if (enableAdvancedFilters) {
            const queryString = searchParams.toString();
            const allParams = qs.parse(queryString, {
                ignoreQueryPrefix: true,
                depth: 5,
                allowDots: true,
            });

            const validFilterKeys = getValidFilterKeys();

            const filters = Object.entries(allParams).reduce((acc, [key, value]) => {
                if (validFilterKeys.includes(key)) acc[key] = value;
                return acc;
            }, {});

            if (JSON.stringify(filters) !== JSON.stringify(advancedFilters)) {
                setAdvancedFilters(filters);
            }
        }
    }, [
        hideUrlParams,
        searchParams,
        enableAdvancedFilters,
        page,
        size,
        search,
        sortField,
        sortDirection,
        advancedFilters,
        getValidFilterKeys,
    ]);

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
