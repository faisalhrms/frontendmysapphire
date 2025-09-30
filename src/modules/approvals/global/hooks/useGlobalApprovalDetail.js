import { useQuery } from '@tanstack/react-query';
import api from "@config/axiosConfig.js";

const fetchApprovalDetail = async (id) => {
    const response = await api.get(`/approvals/request/${id}/`);
    const data = response.data;
    if (!data.status){
        throw new Error(data.message || 'Unknown error occurred');
    }
    return data.data
};

export const useGlobalApprovalDetail = (id, options = {}) => {
    return useQuery({
        queryKey: ['globalApprovalDetail', id],
        queryFn: () => fetchApprovalDetail(id),
        enabled: !!id,
        ...options,
    });
};
