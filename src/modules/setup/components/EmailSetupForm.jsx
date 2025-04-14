import React, { useState } from "react";
import DataTable from "@components/DataTable.jsx";
import FormSelect from "@components/form/FormSelect.jsx";
import { emailApprovalTypes } from "@modules/email-management/services/EmailManagementService.js"; // Assuming this is the correct import
import { updateEmployeeApprovalStatus } from "@modules/email-management/services/EmailManagementService.js"; // Import your API function
import Notify from "@helpers/toastNotifications.js";

const PendingApprovalsTable = () => {
    // State to track if the table is in edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [editedStatuses, setEditedStatuses] = useState({}); // Store edited statuses by row ID

    const columns = [
        { Header: "User Name", accessor: "user.full_name" },
        { Header: "Email", accessor: "user.email" },
        {
            Header: "Approval Status",
            accessor: "approval_status",
            Cell: ({ row }) => {
                const rowData = row.original;
                // If in editing mode, render FormSelect for status editing
                if (isEditing) {
                    return (
                        <FormSelect
                            name={`approval_status_${rowData.id}`}
                            value={editedStatuses[rowData.id] || rowData.approval_status} // Set the value to edited or current status
                            onChange={(e) => {
                                setEditedStatuses((prev) => ({
                                    ...prev,
                                    [rowData.id]: e.target.value, // Update edited status
                                }));
                            }}
                            options={emailApprovalTypes}
                        />
                    );
                }
                // If not in editing mode, render the status as a badge
                switch (rowData.approval_status) {
                    case "approved":
                        return <span className="badge bg-success">Approved</span>;
                    case "rejected":
                        return <span className="badge bg-danger">Rejected</span>;
                    case "pending":
                    default:
                        return <span className="badge bg-warning text-dark">Pending</span>;
                }
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

    const handleSaveApprovals = async () => {
        // Make the API call to update the approval status for all edited rows
        for (const [rowId, newStatus] of Object.entries(editedStatuses)) {
            const updatedData = await updateEmployeeApprovalStatus(rowId, newStatus);
            if (updatedData) {
                Notify.success("Approval status updated successfully.");
            }
        }
        // Exit edit mode and clear edited statuses
        setIsEditing(false);
        setEditedStatuses({});
    };

    return (
        <div>
            {/* Button to toggle between Edit and Save mode */}
            <button
                type="button"
                className="btn btn-primary mb-3"
                onClick={() => {
                    if (isEditing) {
                        handleSaveApprovals(); // Save changes if in edit mode
                    } else {
                        setIsEditing(true); // Enter edit mode
                    }
                }}
            >
                {isEditing ? "Save Approvals" : "Edit Approvals"}
            </button>

            {/* DataTable component */}
            <DataTable
                columns={columns}
                apiUrl="/employee-details/approvals/"
                title="Pending Approvals"
            />
        </div>
    );
};

export default PendingApprovalsTable;
