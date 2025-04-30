import DataTable from "@components/DataTable.jsx";
import React, {useMemo} from "react";
import {Link} from "react-router-dom";
import {getEmailSetupTypeLabel} from "@modules/setup/services/emailSetupService.js";
import {toTitleCase} from "@helpers/formatters.js";
import {formatDate} from "@helpers/dateTime.js";

const EmailLog = ({isActive}) => {
    if (!isActive){
        return null
    }
    const columns = useMemo(() => [
        {
            Header: "To Emails",
            accessor: "to_users",
            Cell: ({ value }) => (
                <>
                    {value.map((user, idx) => (
                        <span
                            key={idx}
                            className="badge bg-primary/10 text-primary me-1"
                        >
                            {toTitleCase( user.email)}
                        </span>
                    ))}
                </>
            ),
        },
        {
            Header: "CC Emails",
            accessor: "cc_users",
            Cell: ({ value }) => (
                <>
                    {value.map((user, idx) => (
                        <span
                            key={idx}
                            className="badge bg-primary/10 text-primary me-1"
                        >
                            {toTitleCase( user.email)}
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
                    {(value)}
                </span>
            ),
        },
        {
            Header:"Send At",
            accessor: "sent_at",
            Cell:({ value }) => (
                formatDate(value)
            )
        }

    ], []);

    return (
        <>

            <DataTable
                columns={columns}
                title="Email Setups"
                apiUrl="/setups/email-send/datatable/"
            />
        </>
    )
}
export default EmailLog