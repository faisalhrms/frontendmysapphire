// src/modules/inventory/components/EquipmentRepairListModal.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Modal from '@modules/inventory/models/components/Modal.jsx';
import DataTable from '@components/datatable/DataTable.jsx';
import EquipmentRepairFormModal from '@modules/inventory/models/EquipmentRepairFormModal.jsx'; // ✅ import
import { formatAmountWithCommas, toTitleCase } from '@helpers/formatters.js';
import { formatDate } from '@helpers/dateTime.js';
import { getBadgeClasses } from '@helpers/badges.js';
import { useEquipmentRepair } from '@modules/inventory/hooks/inventoryRepairHooks.js';
import EquipmentRepairFormWrapper from "@modules/inventory/models/components/EquipmentRepairFormWrapper.jsx"; // ✅ import

export default function EquipmentRepairListModal({ isOpen, onClose, equipmentId }) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedRepairId, setSelectedRepairId] = useState(null);

    const apiUrl = `/equipment-repairs/for-equipment/${equipmentId}/`;

    function renderAttachmentIcon(file) {
        const name = file.file_name.toLowerCase();
        const type = file.file_type.toLowerCase();
        if (type.includes("pdf") || name.endsWith(".pdf")) {
            return <i className="ri-file-pdf-line text-red-600 text-xl" />;
        }
        if (type.includes("image") || /\.(jpg|jpeg|png|gif)$/.test(name)) {
            return <i className="ri-image-line text-green-600 text-xl" />;
        }
        if (type.includes("word") || /\.(doc|docx)$/.test(name)) {
            return <i className="ri-file-word-line text-blue-600 text-xl" />;
        }
        return <i className="ti ti-file-text text-gray-600 text-xl" />;
    }

    const columns = [
        {
            Header: 'Issue',
            accessor: 'issue_description',
            Cell: ({ value }) => value || 'N/A',
            filterable: true,
            filterType: 'text'
        },
        {
            Header: 'Date',
            accessor: 'repair_date',
            Cell: ({ value }) => formatDate(value, 'yyyy-MM-dd'),
            filterable: true,
            filterType: 'date'
        },
        {
            Header: 'Cost',
            accessor: 'repair_cost',
            Cell: ({ value }) => {
                const numeric = parseFloat(value);
                return isNaN(numeric) ? 'N/A' : `PKR ${formatAmountWithCommas(numeric.toFixed(2))}`;
            },
            filterable: true,
            filterType: 'text'
        },
        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ value }) => (
                <span className={getBadgeClasses(value)}>
                    {toTitleCase(value)}
                </span>
            ),
            filterable: true,
            filterType: 'select',
            filterOptions: [
                { value: 'open', label: 'Open' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'closed', label: 'Closed' }
            ]
        },
        {
            Header: 'Attachments',
            accessor: 'attachments',
            disableSortBy: true,
            Cell: ({ row }) => {
                const atts = row.original.attachments || [];
                if (atts.length === 0) return 'N/A';
                return (
                    <div className="flex space-x-2">
                        {atts.map((att) => (
                            <Link
                                key={att.id}
                                to={att.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={att.file_name}
                                className="hover:text-primary flex items-center"
                            >
                                {renderAttachmentIcon(att)}
                            </Link>
                        ))}
                    </div>
                );
            }
        },
        {
            Header: 'Vendor',
            accessor: 'vendor_details',
            Cell: ({ value }) => value || 'N/A'
        },
        {
            Header: 'Created By',
            accessor: 'created_by.full_name',
            Cell: ({ value }) => value || 'N/A'
        },
        {
            Header: 'Created At',
            accessor: 'created_at',
            Cell: ({ value }) => value ? formatDate(value, 'MMM dd, yyyy') : 'N/A',
            filterable: true,
            filterType: 'datetime'
        },
        {
            Header: 'Actions',
            accessor: 'id',
            disableSortBy: true,
            Cell: ({ value }) => (
                <button
                    onClick={() => {
                        setSelectedRepairId(value);
                        setIsFormOpen(true);
                    }}
                    title="Edit"
                    className="ti-btn ti-btn-primary ti-btn-sm"
                >
                    <i className="ri-edit-line" />
                </button>
            )
        }
    ];

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={`Repairs for Equipment #${equipmentId}`}
                width="max-w-6xl"
            >
                <DataTable
                    columns={columns}
                    title=""
                    apiUrl={apiUrl}
                    enableAdvancedFilters={true}
                    paginationSize={10}
                />
            </Modal>

            <EquipmentRepairFormWrapper
                repairId={selectedRepairId}
                equipmentId={equipmentId}
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setSelectedRepairId(null);
                }}
                onSuccess={() => {
                    setIsFormOpen(false);
                    setSelectedRepairId(null);
                    // Optionally refresh table
                }}
            />

        </>
    );
}

EquipmentRepairListModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    equipmentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};
