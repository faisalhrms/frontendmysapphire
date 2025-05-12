import DataTable from "@components/DataTable.jsx";
import React, { useMemo } from "react";
import { getEmailSetupTypeLabel } from "@modules/setup/services/emailSetupService.js";
import { formatDate } from "@helpers/dateTime.js";

const EmailLog = ({ isActive }) => {
    if (!isActive) return null;

    const columns = useMemo(() => [
        {
            Header: "To Emails",
            accessor: "to_emails",
            Cell: ({ value }) => (
                <>
                    {value.map((email, idx) => (
                        <span key={idx} className="badge bg-primary/10 text-primary me-1">
              {email}
            </span>
                    ))}
                </>
            ),
        },
        {
            Header: "CC Emails",
            accessor: "cc_emails",
            Cell: ({ value }) => (
                <>
                    {value.map((email, idx) => (
                        <span key={idx} className="badge bg-primary/10 text-primary me-1">
              {email}
            </span>
                    ))}
                </>
            ),
        },
        {
            Header: "Type",
            accessor: "report_type",
            Cell: ({ value }) => (
                <span className="badge bg-secondary/10 text-secondary">
          {getEmailSetupTypeLabel(value)}
        </span>
            ),
        },
        {
            Header: "Status",
            accessor: "status",
            Cell: ({ value }) => (
                <span className="badge bg-secondary/10 text-secondary">
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
            ),
        },
        {
            Header: "Sent At",
            accessor: "sent_at",
            Cell: ({ value }) => formatDate(value),
        },
    ], []);

    return (
        <DataTable
            columns={columns}
            title="Email Logs"
            apiUrl="/setups/email-send/datatable/"
        />
    );
};

export default EmailLog;
