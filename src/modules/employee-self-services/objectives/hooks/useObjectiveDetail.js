import { useQuery } from '@tanstack/react-query';
import api from "@config/axiosConfig.js";

const fetchObjectiveDetail = async (slug) => {
    const response = await api.get(`/hrms/objectives/${slug}/`);
    const data = response.data;
    if (!data.status){
        throw new Error(data.message || 'Unknown error occurred');
    }
    return data.data
};

export const useObjectiveDetail = (slug, options = {}) => {
    return useQuery({
        queryKey: ['objectiveDetail', slug],
        queryFn: () => fetchObjectiveDetail(slug),
        enabled: !!slug,
        ...options,
    });
};
