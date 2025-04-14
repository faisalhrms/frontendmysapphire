import React from "react";
import { useSelector } from "react-redux";
import DataTable from "@components/DataTable.jsx";
import ApprovalStatusDropdown from "@modules/email-management/components/ApprovalStatusDropdown.jsx";

const PendingApprovalsTable = ({ refetch }) => {
    // Get the current user from Redux
    const currentUser = useSelector((state) => state.auth.user);
    console.log(`this is Edit `,currentUser)
    // Check if the user has designation.id === 15
    const canEditApproval = currentUser?.employee?.designation?.name === "Chief";
    console.log(`this is Edit `,canEditApproval)
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
                    pending: "bg-yellow text-white"
                };

                return canEditApproval ? (
                    <ApprovalStatusDropdown
                        approval_status={value}
                        approvalId={original.id}
                        refetch={refetch}
                    />
                ) : (
                    <span className={`badge me-1 ${statusColors[status] || " bg-gray-100 text-gray-700"}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
                );
            }
        }
,
        {
            Header: "Subscriptions",
            accessor: "subscriptions",
            Cell: ({ cell: { value } }) => (
                value && value.length > 0 ? (
                    value.map((sub, idx) => (
                        <span key={idx} className="badge bg-primary/10 text-primary me-1">
                            {sub.name.charAt(0).toUpperCase() + sub.name.slice(1)}
                        </span>
                    ))
                ) : (
                    <span>None</span>
                )
            )
        }
    ];

    return <DataTable columns={columns} apiUrl="/employee-details/approvals/" title="Pending Approvals" />;
};

export default PendingApprovalsTable;
