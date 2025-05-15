import React from "react";
import { useSelector } from "react-redux";
import DataTable from "@components/DataTable.jsx";
import ApprovalStatusDropdown from "@modules/email-management/components/ApprovalStatusDropdown.jsx";
import {getBadgeClasses} from "@helpers/badges.js";

const PendingApprovalsTable = ({ refetch }) => {
    // currentUser.employee.id is your own Employee PK
    const currentUser = useSelector((state) => state.auth.user);
    const myEmployeeId = currentUser?.employee?.id;

    const columns = [
        { Header: "User Name", accessor: "user.full_name" },
        { Header: "Email", accessor: "user.email" },

        {
            Header: "Email Host",
            accessor: "email_host",
            Cell: ({ cell: { value } }) => (
                <span className="badge bg-secondary/10 text-secondary">
        {value?.toUpperCase() || "—"}
      </span>
            ),
        },

        {
            Header: "ERP User",
            accessor: "erp_user",
            Cell: ({ cell: { value } }) => (
                <span

                >
        {value ? "Yes" : "No"}
      </span>
            ),
        },

        {
            Header: "OneDrive",
            accessor: "one_drive",
            Cell: ({ cell: { value } }) => (
                <span

                >
        {value ? "Yes" : "No"}
      </span>
            ),
        },

        {
            Header: "MS Teams",
            accessor: "ms_team",
            Cell: ({ cell: { value } }) => (
                <span

                >
        {value ? "Yes" : "No"}
      </span>
            ),
        },

        {
            Header: "Backup Storage",
            accessor: "backup_storage",
            Cell: ({ cell: { value } }) => (
                <span >
        {value != null ? `${value} GB` : "—"}
      </span>
            ),
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

        {
            Header: "Approval Status",
            accessor: "approval_status",
            Cell: ({ cell: { value }, row: { original } }) => {
                const status = value?.toLowerCase();
                const amIApprover = original.approver_id === myEmployeeId;

                return amIApprover ? (
                    <ApprovalStatusDropdown
                        approval_status={value}
                        approvalId={original.id}
                        refetch={refetch}
                    />
                ) : (
                    <span className={getBadgeClasses(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
                );
            },
        },
    ];


    return (
        <DataTable
            columns={columns}
            apiUrl="/employee-details/approvals/"
            title={null}
        />
    );
};

export default PendingApprovalsTable;
