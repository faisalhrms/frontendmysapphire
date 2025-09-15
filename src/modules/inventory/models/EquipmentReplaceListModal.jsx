import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Modal from '@modules/inventory/models/components/Modal.jsx';
import DataTable from '@components/datatable/DataTable.jsx';
import { formatDate } from '@helpers/dateTime.js';
import { toTitleCase } from '@helpers/formatters.js';
import EquipmentReplaceFormWrapper from '@modules/inventory/models/components/EquipmentReplaceFormWrapper.jsx';
import { Avatar } from '@mui/material';

export default function EquipmentReplaceListModal({
                                                      isOpen,
                                                      onClose,
                                                      equipmentId,
                                                      hiddenParameters = []
                                                  }) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedReplaceId, setSelectedReplaceId] = useState(null);

    const apiUrl = `/equipment-replacements/for-equipment/${equipmentId}/`;

    const columns = [
        {
            Header: 'Equipment Code',
            accessor: 'equipment.code',
            Cell: ({ value }) => value ?? 'N/A',
            filterable: true,
            filterType: 'number'
        },
        {
            Header: 'Serial No',
            accessor: 'equipment.serial_no',
            Cell: ({ value }) => value ?? 'N/A',
            filterable: true,
            filterType: 'text'
        },
        {
            Header: 'Replacement Date',
            accessor: 'replacement_date',
            Cell: ({ value }) => value ? formatDate(value, 'yyyy-MM-dd') : 'N/A',
            filterable: true,
            filterType: 'date'
        },
        {
            Header: 'Maturity Date',
            accessor: 'maturity_date',
            Cell: ({ value }) => value ? formatDate(value, 'yyyy-MM-dd') : 'N/A',
            filterable: true,
            filterType: 'date'
        },
        {
            Header: 'Reason',
            accessor: 'reason_for_replacement',
            Cell: ({ value }) => value || 'N/A',
            filterable: true,
            filterType: 'text'
        },
        {
            Header: 'Remarks',
            accessor: 'remarks',
            Cell: ({ value }) => value || 'N/A',
            filterable: true,
            filterType: 'text'
        },
        {
            Header: 'Replaced By',
            accessor: 'replaced_by.full_name',
            Cell: ({ row }) => {
                const rb = row.original.replaced_by;
                if (!rb) return 'N/A';
                return (
                    <div className="flex items-center">
                        <Avatar
                            src={rb.avatar || undefined}
                            alt={rb.full_name}
                            sx={{ width: 32, height: 32 }}
                        />
                        <div className="ml-2">
                            <p className="font-semibold mb-0">{rb.full_name}</p>
                            <p className="text-xs text-gray-500">{rb.email || 'N/A'}</p>
                        </div>
                    </div>
                );
            },
            filterable: true,
            filterType: 'text',
            filterKey: 'replaced_by__full_name'
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
                        setSelectedReplaceId(value);
                        setIsFormOpen(true);
                    }}
                    title="Edit Replacement"
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
                title={`Replacements for Equipment #${equipmentId}`}
                width="max-w-6xl"
            >
                <DataTable
                    columns={columns}
                    title=""
                    apiUrl={apiUrl}
                    enableAdvancedFilters={true}
                    paginationSize={10}
                    hiddenParameters={hiddenParameters}
                />
            </Modal>

            <EquipmentReplaceFormWrapper
                replaceId={selectedReplaceId}
                equipmentId={equipmentId}
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
}

EquipmentReplaceListModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    equipmentId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    hiddenParameters: PropTypes.array
};
