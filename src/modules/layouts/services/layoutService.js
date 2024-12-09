import {useQuery} from "@tanstack/react-query";
import api from "@config/axiosConfig.js";

const fetchSidebarData = async () => {
    const { data } = await api.get('/sidebar');
    return data.data;
};

export const useSidebarData = () => {
    return useQuery({
        queryKey: ['sidebarData'],
        queryFn: fetchSidebarData,
        staleTime: 60000, // Data is fresh for 60 seconds
        cacheTime: 300000, // Cache the data for 5 minutes
        refetchOnWindowFocus: false, // Don't refetch on window focus
    });
}