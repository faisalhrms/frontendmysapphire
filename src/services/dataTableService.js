import api from "@config/axiosConfig.js";
import {getDateRangeFromTimePeriod} from "@helpers/dateTime.js";

/**
 * Build query parameters for Django DRF backend
 * Maps frontend filter format to Django expected format
 */
/**
 * Build query parameters for Django DRF backend
 * Maps frontend filter format to Django expected format
 */
const buildDjangoFilterParams = (combinedFilters) => {
    const params = {};
    const today = new Date();

    Object.entries(combinedFilters).forEach(([key, filterConfig]) => {
        if (!filterConfig || typeof filterConfig !== 'object') {
            if (filterConfig !== null && filterConfig !== undefined && filterConfig !== '') {
                params[key] = filterConfig;
            }
            return;
        }

        const { operator, value, from, to, values, timePeriod } = filterConfig;

        if (operator === 'is_null') {
            params[`${key}__isnull`] = true;
            return;
        }
        if (operator === 'is_not_null') {
            params[`${key}__isnull`] = false;
            return;
        }
        if (operator === 'time_period' && timePeriod) {
            const range = getDateRangeFromTimePeriod(timePeriod);
            if (range) {
                params[`${key}__gte`] = range.start.split('T')[0];
                params[`${key}__lte`] = range.end.split('T')[0];
            }
        }

        switch (operator) {
            case 'contains':
                params[`${key}__icontains`] = value;
                break;
            case 'equals':
                params[`${key}__iexact`] = value;
                break;
            case 'not_equals':
                params[`${key}__ne`] = value;
                break;
            case 'starts_with':
                params[`${key}__istartswith`] = value;
                break;
            case 'ends_with':
                params[`${key}__iendswith`] = value;
                break;

            // Number/date operators
            case 'greater_than':
                params[`${key}__gt`] = value;
                break;
            case 'greater_than_equal':
                params[`${key}__gte`] = value;
                break;
            case 'less_than':
                params[`${key}__lt`] = value;
                break;
            case 'less_than_equal':
                params[`${key}__lte`] = value;
                break;
            case 'range':
                if (from !== undefined && from !== '') {
                    params[`${key}__gte`] = from;
                }
                if (to !== undefined && to !== '') {
                    params[`${key}__lte`] = to;
                }
                break;

            default:
                if (value !== undefined && value !== null && value !== '') {
                    params[`${key}__iexact`] = value;
                }
                else if (values && Array.isArray(values) && values.length > 0) {
                    params[`${key}__in`] = values.join(',');
                }
                else if (from !== undefined || to !== undefined) {
                    if (from !== undefined && from !== '') {
                        params[`${key}__gte`] = from;
                    }
                    if (to !== undefined && to !== '') {
                        params[`${key}__lte`] = to;
                    }
                }
        }
    });

    return params;
};

/**
 * Fetch data for DataTable with Django DRF backend
 */
export const fetchData = async ({ queryKey }) => {
    const [apiUrl, page, size, search, combinedFilters, sortField, sortDirection, enableAdvancedFilters] = queryKey;
    try {
        // Build base parameters matching your Django backend
        const params = {
            skip: (page - 1) * size,  // Convert page to skip
            limit: size,
        };

        // Add search parameter (matches your 's' parameter)
        if (search && search.trim()) {
            params.s = search.trim();
        }

        // Add sorting parameters (matches your order_by and order_dir)
        if (sortField && sortDirection) {
            params.order_by = sortField;
            params.order_dir = sortDirection;
        }

        // Add filter parameters
        if (combinedFilters && typeof combinedFilters === 'object') {
            const filterParams = enableAdvancedFilters ? buildDjangoFilterParams(combinedFilters) : combinedFilters;
            Object.assign(params, filterParams);
        }

        // Make the API request
        const response = await api.get(apiUrl, {
            params,
            paramsSerializer: {
                indexes: null
            }
        });

        return response.data;
    } catch (error) {
        console.error('DataTable fetch error:', error);
        throw error;
    }
};