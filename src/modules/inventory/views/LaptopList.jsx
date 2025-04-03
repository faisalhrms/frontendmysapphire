import React from "react";
import PageHeader from "@modules/layouts/includes/PageHeader.jsx";
import DataTable from "@components/DataTable.jsx";
import { Link } from "react-router-dom";
import { toTitleCase } from "@helpers/formatters.js";
import { getBadgeClasses } from "@helpers/badges.js";
// import { INVENTORY_ROUTES } from "@modules/inventory/routes.js"; // if you have a specific route constant

const LaptopList = () => {
    // Define columns for the Laptop table
    const columns = [
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex space-x-2">
                    {/* Update the route if you have a dedicated laptop edit path, e.g. /module/laptop/edit/:id */}
                    <Link to={`/module/asset/edit/${row.original.id}`}>
                        <button className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-edit-line"></i>
                        </button>
                    </Link>
                    {/* Update the route if you have a dedicated laptop detail path, e.g. /module/laptop/detail/:id */}
                    <Link to={`/module/asset/detail/${row.original.id}`}>
                        <button className="ti-btn ti-btn-info ti-btn-sm">
                            <i className="ri-eye-line"></i>
                        </button>
                    </Link>
                </div>
            ),
        },
        { Header: "Code", accessor: "code", Cell: ({ value }) => value ?? "N/A" },

        { Header: "Description", accessor: "description", Cell: ({ value }) => value ?? "N/A" },
        { Header: "Specification", accessor: "specs", Cell: ({ value }) => value ?? "N/A" },
        { Header: "Serial No", accessor: "serial_no", Cell: ({ value }) => value ?? "N/A" },

        { Header: "Email", accessor: "email", Cell: ({ value }) => value ?? "N/A" },
        { Header: "Custodian", accessor: "custodian", Cell: ({ value }) => value ?? "N/A" },
        { Header: "Employee Status", accessor: "emp_status", Cell: ({ value }) => value ?? "N/A" },
        {
            Header: "Laptop issued as per policy",
            accessor: "laptop_issued_as_per_policy",
            Cell: ({ value }) => value ? "Yes" : "No"
        },
        { Header: "Exception Approval granted by", accessor: "exception_approval_granted_by.full_name", Cell: ({ value }) => value ?? "N/A" },
        { Header: "Laptop Model", accessor: "laptop_model", Cell: ({ value }) => value ?? "N/A" },
        { Header: "Processor", accessor: "processor", Cell: ({ value }) => value ?? "N/A" },
        { Header: "RAM", accessor: "ram", Cell: ({ value }) => value ?? "N/A" },
        { Header: "Hard Disk", accessor: "hard_disk", Cell: ({ value }) => value ?? "N/A" },
        { Header: "Screen Size", accessor: "screen_size", Cell: ({ value }) => value ?? "N/A" },
        { Header: "Mouse", accessor: "mouse", Cell: ({ value }) => value ?? "N/A" },
        { Header: "Designation", accessor: "designation", Cell: ({ value }) => value ?? "N/A" },
        { Header: "Purchase Date", accessor: "purchase_date", Cell: ({ value }) => value ?? "N/A" },
        { Header: "Handover Date", accessor: "handover_date", Cell: ({ value }) => value ?? "N/A" },
        { Header: "Maturity Date", accessor: "maturity_date", Cell: ({ value }) => value ?? "N/A" },
        { Header: "Asset Code", accessor: "asset_code", Cell: ({ value }) => value ?? "N/A" },
        { Header: "Site", accessor: "site", Cell: ({ value }) => value ?? "N/A" },
        { Header: "Department", accessor: "department", Cell: ({ value }) => value ?? "N/A" },
        {
            Header: "Status",
            accessor: "status",
            Cell: ({ row }) => (
                <span className={getBadgeClasses(row.original.status)}>
                    {toTitleCase(row.original.status) ?? "N/A"}
                </span>
            ),
        },
        { Header: "Location", accessor: "location", Cell: ({ value }) => value ?? "N/A" },
        { Header: "Purchase Price", accessor: "purchase_price", Cell: ({ value }) => value ?? "N/A" },
        { Header: "Accessories", accessor: "accessories", Cell: ({ value }) => value ?? "N/A" },

    ];

    // Action buttons (e.g., "Add Laptop")


    return (
        <>
            <PageHeader currentpage="Laptops" mainpage="Laptops" />
            <DataTable
                columns={columns}
                title="Laptop List"
                apiUrl="/equipments/laptop-datatable/"
            />
        </>
    );
};

export default LaptopList;
