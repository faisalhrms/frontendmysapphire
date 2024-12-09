import api from "@config/axiosConfig.js";
export const fetchData = async ({ queryKey }) => {
    const [apiUrl, page, size, s, filter] = queryKey;
    const { data } = await api.get(apiUrl, {
        params: {
            skip: (page - 1) * size,
            limit: size,
            s,
            ...(filter && { filter }), // Include filter if it's provided
        },
    });
    return data;
};
