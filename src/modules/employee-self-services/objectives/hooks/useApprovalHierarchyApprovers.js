import { useQuery } from '@tanstack/react-query';
import api from "@config/axiosConfig.js";

const fetchApprovers = async (userId, type) => {
    const response = await api.get(`/hrms/approval-hierarchy/approvers/`, {
        params: { user_id: userId, type }
    });

    const data = response.data;
    if (!data.status) {
        throw new Error(data.message || 'Unknown error occurred');
    }
    return data.data;
};

export const useApprovalHierarchyApprovers = (userId, type = 'objective') => {
    return useQuery({
        queryKey: ['approvalHierarchyApprovers', userId, type],
        queryFn: () => fetchApprovers(userId, type),
        enabled: !!userId, // only run when we have a userId
    });
};