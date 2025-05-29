import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
import { INVENTORY_ROUTES } from "@modules/inventory/routes.js";
import {equipmentStatuses} from "@modules/inventory/services/inventoryService.js"; // Assuming route constants

const LaptopList = () => {
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
        { Header: "Code", accessor: "code", filterable: true, filterType: "text" },
        { Header: "Asset Code", accessor: "asset_code", filterable: true, filterType: "text" },
        {
            Header: "Serial No",
            accessor: "serial_no",
            filterable: true,
            filterType: "text"
        },
        {
            Header: "Description",
            accessor: "description",
            filterable: true,
            filterType: "text",
            Cell: ({ value }) => value?.length > 50 ? value.slice(0, 50) + "..." : value ?? "N/A"
        },
        {
            Header: "Specification",
            accessor: "specs",
            filterable: true,
            filterType: "text",
            Cell: ({ value }) => value?.length > 40 ? value.slice(0, 40) + "..." : value ?? "N/A"
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
        { Header: "Email", accessor: "email", filterable: true, filterType: "text" },
        {
            Header: "Custodian",
            accessor: "custodian",
            filterable: true,
            filterType: "text",
            filterKey: 'custodian__full_name'
        },
        {
            Header: "Department",
            accessor: "department",
            filterable: true,
            filterType: "text",
            filterKey: 'department__name'
        },
        {
            Header: "Site",
            accessor: "site",
            filterable: true,
            filterType: "text",
            filterKey: 'equipment_site__name'
        },
        {
            Header: "Location",
            accessor: "location",
            filterable: true,
            filterType: "text",
            filterKey: 'location__name'
        },
        {
            Header: "Laptop issued as per policy",
            accessor: "laptop_issued_as_per_policy",
            Cell: ({ value }) => value ? "Yes" : "No"
        },
        {
            Header: "Exception Approval granted by",
            accessor: "exception_approval_granted_by.full_name",
            Cell: ({ value }) => value ?? "N/A"
        },
        { Header: "Laptop Model", accessor: "laptop_model" },
        { Header: "Processor", accessor: "processor" },
        { Header: "RAM", accessor: "ram" },
        { Header: "Hard Disk", accessor: "hard_disk" },
        { Header: "Screen Size", accessor: "screen_size" },
        { Header: "Mouse", accessor: "mouse" },
        { Header: "Designation", accessor: "designation" },
        { Header: "Purchase Date", accessor: "purchase_date" , filterType: 'date',
            filterable: true,},
        { Header: "Handover Date", accessor: "handover_date", filterType: 'date',
            filterable: true, },
        { Header: "Maturity Date", accessor: "maturity_date", filterType: 'date',
            filterable: true, },
        { Header: "Purchase Price", accessor: "purchase_price" , filterType: 'text',
            filterable: true,},
        { Header: "Accessories", accessor: "accessories" },
        { Header: "Employee Status", accessor: "emp_status" },
    ];

    const buttons = (
        <div className="grid grid-cols-1 sm:grid-cols-1">
            <Link
                to={INVENTORY_ROUTES.ADD.path}
                className="hs-dropdown-toggle ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
            >
                <i className="ri-add-line font-semibold align-middle"></i> Add Laptop
            </Link>
        </div>
    );

    return (
        <>
            <PageHeader currentpage="Laptops" mainpage="Laptops" />
            <DataTable
                columns={columns}
                title="Laptop List"
                apiUrl="/equipments/laptop-datatable/"
                buttons={buttons}
                enableAdvancedFilters={true}
            />
        </>
    );
};

export default LaptopList;
