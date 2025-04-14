import React from "react";
import DataTable from "@components/DataTable.jsx";
import ApprovalStatusDropdown from "@modules/email-management/components/ApprovalStatusDropdown.jsx";

const PendingApprovalsTable = ({ refetch }) => {
    const columns = [
        { Header: "User Name", accessor: "user.full_name" },  // Accessing user full name from the user object
        { Header: "Email", accessor: "user.email" },           // Accessing user email from the user object
        {
            Header: "Approval Status",
            accessor: "approval_status",
            Cell: ({ cell: { value }, row: { original } }) => {
                return (
                    <ApprovalStatusDropdown
                        approval_status={value}
                        approvalId={original.id} // check if this is the correct property name
                        refetch={refetch}
                    />
                );
            }
        },
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
