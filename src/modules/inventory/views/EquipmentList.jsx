import React, {useState} from "react";
import {Link, useLocation} from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/datatable/DataTable.jsx";
import {INVENTORY_ROUTES} from "@modules/inventory/routes.js";
import {formatAmountWithCommas, toTitleCase} from "@helpers/formatters.js";
import {getBadgeClasses} from "@helpers/badges.js";
import {equipmentStatuses} from "@modules/inventory/services/inventoryService.js";
import EquipmentRepairListModal from "@modules/inventory/models/EquipmentRepairListModal.jsx";
import EquipmentRepairFormModal from "@modules/inventory/models/EquipmentRepairFormModal.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";

import { HardDrive, Wrench } from "lucide-react";

const EquipmentList = ({ isActive }) => {
    if (!isActive) return null;
    const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
    const [showRepairForm, setShowRepairForm] = useState(false);
    const [showRepairList, setShowRepairList] = useState(false);
    const { search } = useLocation();
    const openRepairForm = (id) => {
        setSelectedEquipmentId(id);
        setShowRepairForm(true);
    };

    const openRepairList = (id) => {
        setSelectedEquipmentId(id);
        setShowRepairList(true);
    };
    const params = new URLSearchParams(search);
    const queryParams = {};
    [
        'status',
        'company_id',
        'department_id',
        'location_id',
        'equipment_site_id',
        'equipment_type_id',
        'custodian_id'
    ].forEach(param => {
        if (params.get(param)) queryParams[param] = params.get(param);
    });


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
            accessor: "verified_by",
            filterable: true,
            filterType: "text",
            Cell: ({ value }) => value || "Not Verified",
        },
        {
            Header: "Verified On",
            accessor: "verified_on",
            filterable: true,
            filterType: "date",
            Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : "N/A",
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
                columns={columns}
                title="Assets"
                apiUrl={`/equipments/datatable/?${new URLSearchParams(queryParams).toString()}`}
                buttons={buttons}
                enableAdvancedFilters={true}
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
                />
            )}
        </>
    );
};

export default EquipmentList;