import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { Shield } from "lucide-react";
import DataTable from "@components/datatable/DataTable.jsx";
import React from "react";
import { Link } from "react-router-dom";
import { DYNAMICS_ROUTES } from "@modules/dynamics/routes.js";

const SweepersGuardsList = () => {
    const columns = [
        {
            Header: "Store",
            accessor: "store",
            filterable: true,
            filterType: "text",
        },
        {
            Header: "Number of Guards",
            accessor: "num_of_guards",
            filterable: true,
            filterType: "number",
        },
        {
            Header: "Number of Sweepers",
            accessor: "num_of_sweepers",
            filterable: true,
            filterType: "number",
        },
        {
            Header: "Leased Area (sq ft)",
            accessor: "leased_area_total",
            filterable: true,
            filterType: "number",
            Cell: ({ value }) => (value ? `${parseFloat(value).toLocaleString()} sq ft` : "N/A"),
        },
        {
            Header: "Store Capacity",
            accessor: "store_capacity_total",
            filterable: true,
            filterType: "number",
            Cell: ({ value }) => (value ? value.toLocaleString() : "N/A"),
        },
        {
            Header: "Created At",
            accessor: "created_at",
            filterable: true,
            filterType: "date",
            Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : "N/A"),
        },
    ];

    const buttons = (
        <Link
            to={DYNAMICS_ROUTES.ADD.path}
            className="whitespace-nowrap ti-btn ti-btn-primary-full !py-1 !px-2 !text-[0.75rem]"
        >
            <i className="ri-add-line font-semibold align-middle"></i> Add New Entry
        </Link>
    );

    return (
        <>
            <IconPageHeader
                heading="Sweepers and Gards Management"
                description="Manage sweepers and guards data, store details, and capacity usage."
                icon={Shield}
            />
            <DataTable
                columns={columns}
                title="Sweepers & Gards Management"
                apiUrl="/dynamics/sweepers-and-guards/datatable/"
                buttons={buttons}
                needHeader={false}
                enableAdvancedFilters={false}
            />
        </>
    );
};

export default SweepersGuardsList;
