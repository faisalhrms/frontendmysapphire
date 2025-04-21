import { useState, useCallback } from "react";
import { updateApprovalStatus } from "@modules/email-management/services/EmailManagementService.js"; // Ensure this path is correct

export const useUpdateApprovalStatus = () => {
    const [isLoading, setLoading] = useState(false);

    const handleApprovalStatus = useCallback(async (approvalId, approval_status) => {
        setLoading(true);
        try {
            return await updateApprovalStatus(approvalId, approval_status);
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { handleApprovalStatus, isLoading };
};
