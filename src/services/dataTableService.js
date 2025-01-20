import api from "@config/axiosConfig.js";

export const fetchData = async ({ queryKey }) => {
    // We added sortField and sortDirection to queryKey
    const [apiUrl, page, size, s, filter, sortField, sortDirection] = queryKey;

    const { data } = await api.get(apiUrl, {
        params: {
            skip: (page - 1) * size,
            limit: size,
            s,
            ...(filter && { filter }),
            // The new sorting parameters:
            sortField,
            sortDirection,
        },
    });
    return data;
};
