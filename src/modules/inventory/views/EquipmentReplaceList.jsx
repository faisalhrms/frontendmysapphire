import React, { useState } from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import EquipmentReplaceFormWrapper from "@modules/inventory/models/components/EquipmentReplaceFormWrapper.jsx";

const EquipmentReplaceList = ({ isActive, externalFilters = [] }) => {
    if (!isActive) return null;

    const [selectedReplaceId, setSelectedReplaceId] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleEditClick = (replaceId) => {
        setSelectedReplaceId(replaceId);
        setIsFormOpen(true);
    };

    const columns = [
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex justify-center space-x-2">
                    <button
                        className="ti-btn ti-btn-primary ti-btn-sm"
                        onClick={() => handleEditClick(row.original.id)}
                        title="Edit Replacement"
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
            Header: "Replacement Date",
            accessor: "replacement_date",
            Cell: ({ value }) =>
                value ? new Date(value).toLocaleDateString() : "N/A",
        },
        {
            Header: "Maturity Date",
            accessor: "maturity_date",
            Cell: ({ value }) =>
                value ? new Date(value).toLocaleDateString() : "N/A",
        },
        {
            Header: "Replaced By",
            accessor: "replaced_by.full_name",
            Cell: ({ row }) =>
                row.original.replaced_by?.full_name || "N/A",
        },
        {
            Header: "Reason",
            accessor: "reason_for_replacement",
            Cell: ({ value }) => value || "N/A",
        },
        {
            Header: "Remarks",
            accessor: "remarks",
            Cell: ({ value }) => value || "N/A",
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
                title="Equipment Replacements"
                apiUrl="/equipment-replacements/datatable/"
                enableAdvancedFilters={false}
                externalFilters={externalFilters}
                hiddenParameters={['tab', 'status']}
            />


             <EquipmentReplaceFormWrapper
                replaceId={selectedReplaceId}
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setSelectedReplaceId(null);
                }}
                onSuccess={() => {
                    setIsFormOpen(false);
                    setSelectedReplaceId(null);
                }}
            />
        </>
    );
};

export default EquipmentReplaceList;
