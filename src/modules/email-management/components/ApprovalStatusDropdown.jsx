import React, { useEffect } from "react";
import FormSelect from "@components/form/FormSelect.jsx";
import { useForm } from "react-hook-form";
import { useUpdateApprovalStatus } from "@modules/email-management/hooks/EmailManagementHook.js"; // Ensure this hook is implemented
// Define the status options for approvals as needed
const approvalStatuses = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
];

const ApprovalStatusDropdown = ({ approval_status, approvalId, refetch }) => {

    const { handleApprovalStatus, isLoading } = useUpdateApprovalStatus();

    const {
        control,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            approval_status,
        },
    });

    useEffect(() => {
        reset({ approval_status });
    }, [approval_status, approvalId, reset]);

    const handleStatusChange = async (newStatus) => {
        // Update the status for the given approval ID using your update hook
        await handleApprovalStatus(approvalId, newStatus);
        if (refetch) {
            refetch();
        }
    };

    return (
        <FormSelect
            label={false}
            name="approval_status"
            control={control}
            errors={errors}
            options={approvalStatuses}
            placeholder="Status"
            isClearable={false}
            onSelectChange={handleStatusChange}
            className="select-sm"
        />
    );
};

export default React.memo(ApprovalStatusDropdown);
