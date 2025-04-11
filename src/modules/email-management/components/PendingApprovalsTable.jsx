import React from "react";
import DataTable from "@components/DataTable.jsx";

const PendingApprovalsTable = () => {
    const columns = [
        { Header: "User Name", accessor: "user.full_name" },  // Accessing user full name from the user object
        { Header: "Email", accessor: "user.email" },  // Accessing user email from the user object
        {
            Header: "Approval Status",
            accessor: "is_approved",
            Cell: ({ cell: { value } }) => (
                value ? <span className="badge bg-success">Approved</span> :
                    <span className="badge bg-warning text-dark">Pending</span>  // If not approved, show as Pending with a warning style
            )
        },
        {
            Header: "Subscriptions",
            accessor: "subscriptions",
            Cell: ({ cell: { value } }) => (
                value && value.length > 0 ? (
                    value.map((sub, idx) => (
                        <span key={idx} className="badge bg-primary/10 text-primary me-1">
                            {sub.name.charAt(0).toUpperCase() + sub.name.slice(1)}  {/* Capitalizing first letter of the subscription name */}
                        </span>
                    ))
                ) : (
                    <span>None</span>  // If there are no subscriptions, display "None"
                )
            )
        }
    ];

    return <DataTable columns={columns} apiUrl="/employee-details/approvals/" title="Pending Approvals" />;
};

export default PendingApprovalsTable;
