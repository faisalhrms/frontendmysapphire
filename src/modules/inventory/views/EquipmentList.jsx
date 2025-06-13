import React from "react";
import {Link, useLocation} from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import {INVENTORY_ROUTES} from "@modules/inventory/routes.js";
import {toTitleCase} from "@helpers/formatters.js";
import {getBadgeClasses} from "@helpers/badges.js";
import {equipmentStatuses} from "@modules/inventory/services/inventoryService.js";

const EquipmentList = () => {
    const { search } = useLocation();
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
                </div>
            ),
        },
        { Header: "Code",
            accessor: "code",
            filterable: true,
            filterType: "number",
        },
        {
            Header:"Asset Code",accessor: "asset_code",  filterable: true,
            filterType: "text",
        },
        { Header: "Serial No", accessor: "serial_no", filterable: true,
            filterType: "text", },
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
        { Header: "Purchase Price", accessor: "purchase_price" , filterType: 'text',
            filterable: true,},
        {
            Header: "Custodian",
            accessor: "custodian",
            filterable: true,
            filterType: "text",
            filterKey: 'custodian__full_name',
        },

        { Header: "Department", accessor: "department",
            filterable: true,
            filterType: "text",
            filterKey: 'department__name'
        },

        { Header: "Asset Site", accessor: "equipment_site",
            filterable: true,
            filterType: "text",
            filterKey: 'equipment_site__name'},
        { Header: "Asset Type", accessor: "equipment_type",
            filterable: true,
            filterType: "text",
            filterKey: 'equipment_type__name'
        },
        { Header: "Location", accessor: "location",
            filterable: true,
            filterType: "text",
            filterKey: 'location__name'
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
            <PageHeader currentpage="Assets" mainpage="Assets" />

            <DataTable
                columns={columns}
                title="Assets"
                apiUrl={`/equipments/datatable/?${new URLSearchParams(queryParams).toString()}`}
                buttons={buttons}
                enableAdvancedFilters={true}
            />
        </>
    );
};

export default EquipmentList;
