import {useQuery} from "@tanstack/react-query";
import {getTaskApprovals, updateTaskApproval} from "@modules/approvals/task/services/TaskApprovalService.js";

export const useTaskApprovals = (page = 1, size = 6) => {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['taskApprovals', page, size],
        queryFn: () => getTaskApprovals(page, size),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
    return { data, isLoading, refetch };
};

export const useTaskApprovalForm = () => {
    const handleTaskApprovalSubmit = async (id, status, comments) => {
        await updateTaskApproval(id, {
            status: status,
            comments: comments
        })
    };

    return { handleTaskApprovalSubmit };
};