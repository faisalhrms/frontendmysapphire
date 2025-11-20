import React, { useState } from "react";
import DataTable from "@components/datatable/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import EquipmentReplaceFormWrapper from "@modules/inventory/models/components/EquipmentReplaceFormWrapper.jsx";
import {Link} from "react-router-dom";

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
            Cell: ({ row }) => {
                const status = row.original.status;
                const isDisabled = status === "approved" || status === "underapproval";

                return (
                    <div className="flex justify-center space-x-2">
                        <button
                            className={`ti-btn ti-btn-primary ti-btn-sm ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                            onClick={() => !isDisabled && handleEditClick(row.original.id)}
                            title={isDisabled ? "Editing Disabled" : "Edit Replacement"}
                            disabled={isDisabled}
                        >
                            <i className="ri-edit-line" />
                        </button>
                        <Link to={`/module/asset/replace/detail/${row.original.id}`}>
                            <button className="ti-btn ti-btn-info ti-btn-sm">
                                <i className="ri-eye-line"></i>
                            </button>
                        </Link>
                    </div>
                );
            },
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
            Header: 'Status',
            accessor: 'status',
            filterable: true,
            filterType: 'select',
            filterKey: 'status',
            filterOptions: [
                { value: 'approved', label: 'Approved' },
                { value: 'under_approval', label: 'Under Approval' },
                { value: 'rejected', label: 'Rejected' },
            ],
            Cell: ({ value }) => toTitleCase(value),
            getCellProps: (cellInfo) => {
                const value = cellInfo.value;
                let bgClass = "";
                let textClass = "";

                if (value === "under_approval") {
                    bgClass = "bg-warning/30";
                    textClass = "text-warning";
                }
                else if (value === "approved") {
                    bgClass = "bg-success/30";
                    textClass = "text-success";
                }
                else if (value === "rejected") {
                    bgClass = "bg-danger/30";
                    textClass = "text-danger";
                }
                else {
                    bgClass = "bg-primary/30";
                    textClass = "text-primary";
                }

                return {
                    className: `capitalize px-2 py-1 rounded ${bgClass} ${textClass}`,
                };
            },
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
