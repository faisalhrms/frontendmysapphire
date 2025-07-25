import React, { useState } from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { formatAmountWithCommas, toTitleCase } from "@helpers/formatters.js";
import EquipmentRepairFormWrapper from "@modules/inventory/models/components/EquipmentRepairFormWrapper.jsx";
import {getBadgeClasses} from "@helpers/badges.js";

const EquipmentRepairList = ({ isActive, externalFilters = [] }) => {
    if (!isActive) return null;
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRepairId, setSelectedRepairId] = useState(null);

    const handleEditClick = (repairId) => {
        setSelectedRepairId(repairId);
        setIsFormOpen(true);
    };

    const columns = [
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    <button
                        className="ti-btn ti-btn-primary ti-btn-sm"
                        onClick={() => handleEditClick(row.original.id)}
                        title="Edit Repair"
                    >
                        <i className="ri-edit-line" />
                    </button>
                </div>
            ),
        },
        {
            Header: "Equipment Code",
            accessor: "equipment.code",
            Cell: ({ row }) => <>{row.original.equipment?.code || "N/A"}</>,
        },
        {
            Header: "Serial No",
            accessor: "equipment.serial_no",
            Cell: ({ row }) => <>{row.original.equipment?.serial_no || "N/A"}</>,
        },
        {
            Header: "Issue Description",
            accessor: "issue_description",
        },
        {
            Header: "Repair Date",
            accessor: "repair_date",
            Cell: ({ value }) =>
                value ? new Date(value).toLocaleDateString() : "N/A",
        },
        {
            Header: "Repair Cost",
            accessor: "repair_cost",
            Cell: ({ value }) =>
                value === null ? "Nill" : formatAmountWithCommas(value),
        },
        {
            Header: "PR/PO Number",
            accessor: "pr_po_number",
            Cell: ({ value }) => value || "N/A",
        },
        {
            Header: "Vendor Details",
            accessor: "vendor_details",
            Cell: ({ value }) => value || "N/A",
        },
        {
            Header: "TAT (Days)",
            accessor: "turnaround_time",
            Cell: ({ value }) => value || "N/A",
        },
        {
            Header: "Status",
            accessor: "status",
            Cell: ({ row }) => (
                <span className={getBadgeClasses(row.original.status)}>
                {toTitleCase(row.original.status)}
            </span>
            ),
        },
        {
            Header: "Created By",
            accessor: "created_by.full_name",
            Cell: ({ row }) => row.original.created_by?.full_name || "N/A",
        },
        {
            Header: "Created On",
            accessor: "created_at",
            Cell: ({ value }) =>
                value ? new Date(value).toLocaleDateString() : "N/A",
        },
    ];

    return (
        <>
            <DataTable
                columns={columns}
                title="Equipment Repairs"
                apiUrl="/equipment-repairs/datatable/"
                enableAdvancedFilters={false}
                externalFilters={externalFilters}
                hiddenParameters={['tab', 'status']}
            />

            <EquipmentRepairFormWrapper
                repairId={selectedRepairId}
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setSelectedRepairId(null);
                }}
                onSuccess={() => {
                    setIsFormOpen(false);
                    setSelectedRepairId(null);
                }}
            />
        </>
    );
};

export default EquipmentRepairList;
