import api from "@config/axiosConfig.js";

export const fetchData = async ({ queryKey }) => {
    const [apiUrl, page, size, s, filter, sortField, sortDirection] = queryKey;

    const params = {
        skip: (page - 1) * size,
        limit: size,
        s,
        ...(filter && typeof filter === 'object' && !Array.isArray(filter) ? filter : { filter }),
        order_by: sortField,
        order_dir: sortDirection,
    };

    const { data } = await api.get(apiUrl, { params });
    return data;
};