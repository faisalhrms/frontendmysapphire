import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import { getEmailSetupTypeLabel } from "@modules/setup/services/emailSetupService.js";
import { toTitleCase } from "@helpers/formatters.js";
import {INVENTORY_ROUTES} from "@modules/inventory/routes.js";
import {SETUP_ROUTES} from "@modules/setup/routes.js";
import LoadingSpinner from "@components/LoadingSpinner.jsx";

const EmailSetupList = ({isActive}) => {
    if (!isActive){
        return null
    }

    const [filters, setFilters] = useState({});

    const columns = useMemo(() => [
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Link to={`/module/email-setup/edit/${row.original.id}`}>
                        <button className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-edit-line"></i>
                        </button>
                    </Link>
                </div>
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
    ], []);

    const buttons = (
        <div className="grid grid-cols-1 sm:grid-cols-1">
            <Link
                to={SETUP_ROUTES.EMAIL.ADD.path}
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i> Add New Setup
            </Link>
        </div>
    );

    return (
        <>

            <DataTable
                columns={columns}
                title="Email Setups"
                apiUrl="/setups/email-setups/datatable/"
                buttons={buttons}
                filter={filters}
            />
        </>
    );
};

export default EmailSetupList;


