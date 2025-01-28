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
                    <Link to={`/module/equipment/edit/${row.original.id}`}>
                        <button className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-edit-line"></i>
                        </button>
                    </Link>
                    {/* Update the route if you have a dedicated laptop detail path, e.g. /module/laptop/detail/:id */}
                    <Link to={`/module/equipment/detail/${row.original.id}`}>
                        <button className="ti-btn ti-btn-info ti-btn-sm">
                            <i className="ri-eye-line"></i>
                        </button>
                    </Link>
                </div>
            ),
        },
        { Header: "Code", accessor: "code" },
        { Header: "Description", accessor: "description" },
        { Header: "Specification", accessor: "specs" },
        { Header: "Serial No", accessor: "serial_no" },
        { Header: "Custodian", accessor: "custodian" },
        { Header: "Email", accessor: "email" },
        { Header: "Grade", accessor: "grade" },
        { Header: "Purchase Date", accessor: "purchase_date" },
        { Header: "Handover Date", accessor: "handover_date" },
        { Header: "Maturity Date", accessor: "maturity_date" },
        { Header: "Asset Code", accessor: "asset_code" },
        { Header: "Site", accessor: "site" },
        { Header: "Department", accessor: "department" },
        {
            Header: "Status",
            accessor: "status",
            Cell: ({ row }) => (
                <span className={getBadgeClasses(row.original.status)}>
          {toTitleCase(row.original.status)}
        </span>
            ),
        },
        { Header: "Location", accessor: "location" },
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
