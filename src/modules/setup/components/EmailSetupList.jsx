import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import { getEmailSetupTypeLabel } from "@modules/setup/services/emailSetupService.js";
import { toTitleCase } from "@helpers/formatters.js";
import { SETUP_ROUTES } from "@modules/setup/routes.js";

const EmailSetupList = ({ isActive }) => {
    if (!isActive) return null;
    const [filters, setFilters] = useState({});

    const renderEmailBadges = (emails) => {
        // Normalize: if it's a string, split by commas; if array, use directly
        const list = Array.isArray(emails)
            ? emails
            : typeof emails === "string"
                ? emails.split(",")
                : [];

        return list.map((email, idx) => {
            const trimmed = email?.trim();
            if (!trimmed) return null;
            return (
                <span key={idx} className="badge bg-primary/10 text-primary me-1">
          {toTitleCase(trimmed)}
        </span>
            );
        });
    };

    const columns = useMemo(
        () => [
            {
                Header: "Actions",
                accessor: "id",
                disableSortBy: true,
                Cell: ({ row }) => (
                    <Link to={`/module/email-setup/edit/${row.original.id}`}>
                        <button className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-edit-line"></i>
                        </button>
                    </Link>
                ),
            },
            {
                Header: "Type",
                accessor: "type",
                Cell: ({ value }) => (
                    <span className="badge bg-secondary/10 text-secondary">
            {getEmailSetupTypeLabel(value)}
          </span>
                ),
            },
            {
                Header: "To Emails",
                accessor: "to_emails",  // your backend now returns a JS array here
                Cell: ({ value }) => renderEmailBadges(value),
            },
            {
                Header: "CC Emails",
                accessor: "cc_emails",
                Cell: ({ value }) => renderEmailBadges(value),
            },
        ],
        []
    );

    const buttons = (
        <Link
            to={SETUP_ROUTES.EMAIL.ADD.path}
            className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
        >
            <i className="ri-add-line font-semibold align-middle" /> Add New Setup
        </Link>
    );

    return (
        <DataTable
            columns={columns}
            title="Email Setups"
            apiUrl="/setups/email-setups/datatable/"
            buttons={buttons}
            filter={filters}
        />
    );
};

export default EmailSetupList;
