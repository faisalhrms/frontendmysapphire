// @modules/inventory/components/EquipmentHistory.jsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import { INVENTORY_ROUTES } from "@modules/inventory/routes.js";
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";

const EquipmentHistory = () => {
    const { id } = useParams(); // Get equipment_id from URL parameters

    // Define columns for Transaction History with Old and New Data
    const columns = [
        {
            Header: "Date&Time",
            accessor: "created_at",
            Cell: ({ value }) => new Date(value).toLocaleString()
        },
        // {
        //     Header: "Changed By",
        //     accessor: "changed_by.full_name",
        //     Cell: ({ value }) => value || 'N/A'
        // },
        {
            Header: "Reason",
            accessor: "reason"
        },
        {
            Header: "Old Custodian",
            accessor: "old_custodian.full_name",
            Cell: ({ value }) => value || 'N/A'
        },
        {
            Header: "New Custodian",
            accessor: "new_custodian.full_name",
            Cell: ({ value }) => value || 'N/A'
        },
        {
            Header: "Old Department",
            accessor: "old_department.name",
            Cell: ({ value }) => value || 'N/A'
        },
        {
            Header: "New Department",
            accessor: "new_department.name",
            Cell: ({ value }) => value || 'N/A'
        },
        {
            Header: "Old Equipment Site",
            accessor: "old_equipment_site.name",
            Cell: ({ value }) => value || 'N/A'
        },
        {
            Header: "New Equipment Site",
            accessor: "new_equipment_site.name",
            Cell: ({ value }) => value || 'N/A'
        },
        {
            Header: "Old Location",
            accessor: "old_location.name",
            Cell: ({ value }) => value || 'N/A'
        },
        {
            Header: "New Location",
            accessor: "new_location.name",
            Cell: ({ value }) => value || 'N/A'
        },
        {
            Header: "Old Equipment Type",
            accessor: "old_equipment_type.name",
            Cell: ({ value }) => value || 'N/A'
        },
        {
            Header: "New Equipment Type",
            accessor: "new_equipment_type.name",
            Cell: ({ value }) => value || 'N/A'
        },
        {
            Header: "Old Status",
            accessor: "old_status",
            Cell: ({ value }) => <span className={ getBadgeClasses(value) }>{ toTitleCase(value) }</span>
        },
        {
            Header: "New Status",
            accessor: "new_status",
            Cell: ({ value }) => <span className={ getBadgeClasses(value) }>{ toTitleCase(value) }</span>
        },
    ];

    // Define buttons (e.g., back to list)


    return (
        <>
            <PageHeader currentpage="Equipment History" mainpage="Equipments" />
            <div className="grid grid-cols-1 gap-6">
                {/* Transactions DataTable */}
                <DataTable
                    columns={columns}
                    title={`Transaction History for Equipment`}
                    apiUrl={`/equipment-transactions/equipment/${id}/transactions/`}
                />
            </div>
        </>
    );
};

export default EquipmentHistory;
