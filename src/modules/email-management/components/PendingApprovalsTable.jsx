import React from "react";
import { useSelector } from "react-redux";
import DataTable from "@components/DataTable.jsx";
import ApprovalStatusDropdown from "@modules/email-management/components/ApprovalStatusDropdown.jsx";

const PendingApprovalsTable = ({ refetch }) => {
    // currentUser.employee.id is your own Employee PK
    const currentUser = useSelector((state) => state.auth.user);
    const myEmployeeId = currentUser?.employee?.id;

    const columns = [
        { Header: "User Name", accessor: "user.full_name" },
        { Header: "Email", accessor: "user.email" },
        {
            Header: "Approval Status",
            accessor: "approval_status",
            Cell: ({ cell: { value }, row: { original } }) => {
                const status = value?.toLowerCase();
                const statusColors = {
                    approved: "bg-green text-white",
                    rejected: "bg-red text-white",
                    pending: "bg-yellow text-white",
                };

                // Show dropdown only if this row’s approver_id === your employee.id
                const amIApprover = original.approver_id === myEmployeeId;

                return amIApprover ? (
                    <ApprovalStatusDropdown
                        approval_status={value}
                        approvalId={original.id}
                        refetch={refetch}
                    />
                ) : (
                    <span
                        className={`badge me-1 ${
                            statusColors[status] || "bg-gray-100 text-gray-700"
                        }`}
                    >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
                );
            },
        },
        {
            Header: "Subscriptions",
            accessor: "subscriptions",
            Cell: ({ cell: { value } }) =>
                value && value.length > 0 ? (
                    value.map((sub, idx) => (
                        <span key={idx} className="badge bg-primary/10 text-primary me-1">
              {sub.name.charAt(0).toUpperCase() + sub.name.slice(1)}
            </span>
                    ))
                ) : (
                    <span>None</span>
                ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            apiUrl="/employee-details/approvals/"
            title="Pending Approvals"
        />
    );
};

export default PendingApprovalsTable;
