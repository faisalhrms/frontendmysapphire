import React, {useRef, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import DataTable from "@components/datatable/DataTable.jsx";
import {INVENTORY_ROUTES} from "@modules/inventory/routes.js";
import {formatAmountWithCommas, toTitleCase} from "@helpers/formatters.js";
import {getBadgeClasses} from "@helpers/badges.js";
import {deleteEquipment, equipmentStatuses} from "@modules/inventory/services/inventoryService.js";
import EquipmentRepairListModal from "@modules/inventory/models/EquipmentRepairListModal.jsx";
import EquipmentRepairFormModal from "@modules/inventory/models/EquipmentRepairFormModal.jsx";
import {Avatar} from "@mui/material";
import { ShieldCheck } from "lucide-react";
import EquipmentDeleteConfirmModal from "@modules/inventory/models/EquipmentDeleteConfirmModal.jsx";
import EquipmentReplaceFormModal from "@modules/inventory/models/EquipmentReplaceFormModal.jsx";
import EquipmentReplaceListModal from "@modules/inventory/models/EquipmentReplaceListModal.jsx";
const EquipmentList = ({ isActive, externalFilters = [] }) => {
    if (!isActive) return null;
    const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
    const [showRepairForm, setShowRepairForm] = useState(false);
    const [showRepairList, setShowRepairList] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showReplaceForm, setShowReplaceForm] = useState(false);
    const [showReplaceList, setShowReplaceList] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const tableRef = useRef(null);
    const openDeleteModal = (id) => {
        setDeletingId(id);
        setShowDeleteModal(true);
    };
    const openRepairForm = (id) => {
        setSelectedEquipmentId(id);
        setShowRepairForm(true);
    };

    const openRepairList = (id) => {
        setSelectedEquipmentId(id);
        setShowRepairList(true);
    };
    const openReplaceForm = (id) => {
        setSelectedEquipmentId(id);
        setShowReplaceForm(true);
    };
    const openReplaceList = (id) => {
        setSelectedEquipmentId(id);
        setShowReplaceList(true);
    };
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteEquipment(deletingId);

            setShowDeleteModal(false);
            setDeletingId(null);

            tableRef.current?.refetch();
        } catch (error) {
            console.error("Delete failed:", error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const isSystemVerified = (row) =>
        row?.original?.verified === true && !row?.original?.latest_verification;

    const pickVerifiedOn = (row) => {
        const latest = row?.original?.latest_verification;
        return latest?.verified_on ?? row?.original?.system_verified_on ?? null;
    };
    const formatDateTime = (iso) => {
        if (!iso) return null;
        // Date-only:
        return new Date(iso).toLocaleDateString();
        // If you want date+time instead, use:
        // return new Date(iso).toLocaleString();
    };

    const columns = [
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Link to={`/module/asset/edit/${row.original.id}`}>
                        <button className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-edit-line"></i>
                        </button>
                    </Link>
                    <Link to={`/module/asset/detail/${row.original.id}`}>
                        <button className="ti-btn ti-btn-info ti-btn-sm">
                            <i className="ri-eye-line"></i>
                        </button>
                    </Link>
                    <button
                        className="ti-btn ti-btn-warning ti-btn-sm"
                        onClick={() => openRepairForm(row.original.id)}
                        title="Add Repair"
                    >
                        <i className="ri-tools-line"></i>
                    </button>
                    <button
                        className="ti-btn ti-btn-secondary ti-btn-sm"
                        onClick={() => openRepairList(row.original.id)}
                        title="View Repairs"
                    >
                        <i className="ri-list-settings-line"></i>
                    </button>
                    <button
                        className="ti-btn ti-btn-success ti-btn-sm"
                        onClick={() => openReplaceForm(row.original.id)}
                        title="Add Replacement"
                    >
                        <i className="ri-refresh-line"></i>
                    </button>
                    <button
                        className="ti-btn ti-btn-info ti-btn-sm"
                        onClick={() => openReplaceList(row.original.id)}
                        title="View Replacements"
                    >
                        <i className="ri-list-check"></i>
                    </button>
                    <button
                        className="ti-btn ti-btn-danger ti-btn-sm"
                        onClick={() => openDeleteModal(row.original.id)}
                        title="Delete"
                    >
                        <i className="ri-delete-bin-line"></i>
                    </button>
                </div>
            ),
        },
        {
            Header: "Code",
            accessor: "code",
            filterable: true,
            filterType: "number",
        },
        {
            Header: "Asset Code",
            accessor: "asset_code",
            filterable: true,
            filterType: "text",
        },

        {
            Header: "Serial No",
            accessor: "serial_no",
            filterable: true,
            filterType: "text",
        },

        {
            Header: "Description",
            accessor: "description",
            filterable: true,
            filterType: "text",
            Cell: ({ row }) => (
                <span>
                {row.original.description?.length > 50
                    ? row.original.description.slice(0, 50) + "..."
                    : row.original.description}
            </span>
            ),
        },
        {
            Header: "Specification",
            accessor: "specs",
            filterable: true,
            filterType: "text",
            Cell: ({ row }) => (
                <span>
                {row.original.specs?.length > 40
                    ? row.original.specs.slice(0, 40) + "..."
                    : row.original.specs}
            </span>
            ),
        },
        {
            Header: "Status",
            accessor: "status",
            filterType: 'select',
            filterable: true,
            filterOptions: equipmentStatuses,
            Cell: ({ row }) => (
                <span className={getBadgeClasses(row.original.status)}>
                {toTitleCase(row.original.status)}
            </span>
            ),
        },
        {
            Header: "Asset Tag",
            accessor: "asset_tag_available",
            filterable: true,
            filterType: 'boolean',
            Cell: ({ value }) => (
                <span className={value ? "badge bg-success/20 text-success rounded-sm py-1" : "badge bg-danger/20 text-danger rounded-sm py-1"}>
                {value ? "Available" : "Not Available"}
            </span>
            ),
        },
        {
            Header: "Purchase Price",
            accessor: "purchase_price",
            filterable: true,
            filterType: 'text',
            Cell: ({ value }) =>
                value === null ? "Nill" : formatAmountWithCommas(value),
        },
        {
            Header: "Custodian",
            accessor: "custodian",
            filterable: true,
            filterType: "text",
            filterKey: 'custodian__full_name',
        },
        {
            Header: "Department",
            accessor: "department",
            filterable: true,
            filterType: "text",
            filterKey: 'department__name'
        },
        {
            Header: "Asset Site",
            accessor: "equipment_site",
            filterable: true,
            filterType: "text",
            filterKey: 'equipment_site__name'
        },
        {
            Header: "Asset Type",
            accessor: "equipment_type",
            filterable: true,
            filterType: "text",
            filterKey: 'equipment_type__name'
        },
        {
            Header: "Location",
            accessor: "location",
            filterable: true,
            filterType: "text",
            filterKey: 'location__name'
        },
        {
            Header: "Remarks",
            accessor: "remarks",
            filterable: true,
            filterType: "text",
            Cell: ({ value }) => (value ? value : "N/A"),
        },
        {
            Header: "POS ID",
            accessor: "pos_id",
            filterable: true,
            filterType: "text",
            Cell: ({ value }) => value || "N/A",
        },
        {
            Header: "MAC Address",
            accessor: "mac",
            filterable: true,
            filterType: "text",
            Cell: ({ value }) => value || "N/A",
        },
        {
            Header: "IP Address",
            accessor: "ip",
            filterable: true,
            filterType: "text",
            Cell: ({ value }) => value || "N/A",
        },
        {
            Header: "Verified By",
            accessor: "latest_verification.verified_by",
            filterable: true,
            filterType: "text",
            filterKey: "latest_verification__verified_by__full_name",
            Cell: ({ row }) => {
                const latest = row.original.latest_verification;

                // ✅ System Verified (no human verifier, but verified flag is true)
                if (isSystemVerified(row)) {
                    return (
                        <div className="flex items-center">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                                <ShieldCheck className="text-primary" size={16} title="Verified" />
                            </div>
                            <div className="ms-2">
                                <p className="font-semibold mb-0 flex items-center">
                                    System Verified
                                    <ShieldCheck className="ml-1 text-primary" size={14} title="Verified" />
                                </p>
                                <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                                    Auto-verified via audit
                                </p>
                            </div>
                        </div>
                    );
                }

                // ❌ Not Verified
                if (!latest || !latest.verified_by) return "Not Verified";

                // 👤 Human verified
                const { full_name, email, avatar } = latest.verified_by;
                return (
                    <div className="flex items-center">
                        {/* If this Avatar is your own component, keep as-is.
           If it's MUI Avatar, use <Avatar src={avatar?.url} alt={full_name} /> */}
                        <Avatar
                            avatar={avatar ? latest.verified_by : null}
                            full_name={full_name || "N/A"}
                            size="md"
                            parentClasses="dark:text-gray-200 dark:bg-bodybg"
                        />
                        <div className="ms-2">
                            <p className="font-semibold mb-0 flex items-center">
                                {full_name || "N/A"}
                                <ShieldCheck className="ml-1 text-primary" size={14} title="Verified" />
                            </p>
                            <p className="mb-0 text-[#8c9097] dark:text-white/50 text-[0.75rem]">
                                {email || "N/A"}
                            </p>
                        </div>
                    </div>
                );
            },
        },
        {
            Header: "Verified On",
            accessor: "latest_verification.verified_on",
            filterable: true,
            filterType: "date",
            // optional: if your server can filter by a single field, you can set a filterKey (e.g. system_verified_on),
            // but since we’re showing a computed fallback value, many backends won’t support union filters.
            // filterKey: "system_verified_on",
            Cell: ({ row }) => {
                const iso = pickVerifiedOn(row); // latest_verification.verified_on OR system_verified_on
                return iso ? formatDateTime(iso) : "N/A";
            },
        },

        {
            Header: "Company",
            accessor: "company.name",
            filterable: false,
            Cell: ({ row }) => <span>{row.original.company?.name || "-"}</span>,
        },
    ];

    const buttons = (
        <div className="grid grid-cols-1 sm:grid-cols-1">
            <Link
                to={INVENTORY_ROUTES.ADD.path}
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i> Add Asset
            </Link>
        </div>
    );

    return (
        <>

            <DataTable
                ref={tableRef}
                columns={columns}
                title="Assets"
                apiUrl={`/equipments/datatable/`}
                buttons={buttons}
                enableAdvancedFilters={true}
                externalFilters={externalFilters}
                hiddenParameters={['tab']}
            />
            {showRepairForm && (
                <EquipmentRepairFormModal
                    isOpen={showRepairForm}
                    onClose={() => setShowRepairForm(false)}
                    equipmentId={selectedEquipmentId}
                />
            )}

            {showRepairList && (
                <EquipmentRepairListModal
                    isOpen={showRepairList}
                    onClose={() => setShowRepairList(false)}
                    equipmentId={selectedEquipmentId}
                    hiddenParameters={externalFilters}
                />
            )}

            {showReplaceForm && (
                <EquipmentReplaceFormModal
                    isOpen={showReplaceForm}
                    onClose={() => setShowReplaceForm(false)}
                    equipmentId={selectedEquipmentId}
                />
            )}
            {showReplaceList && (
                <EquipmentReplaceListModal
                    isOpen={showReplaceList}
                    onClose={() => setShowReplaceList(false)}
                    equipmentId={selectedEquipmentId}
                    hiddenParameters={externalFilters}
                />
            )}

            {showDeleteModal && (
                <EquipmentDeleteConfirmModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleConfirmDelete}
                    isSubmitting={isDeleting}
                />

            )}

        </>
    );
};

export default EquipmentList;