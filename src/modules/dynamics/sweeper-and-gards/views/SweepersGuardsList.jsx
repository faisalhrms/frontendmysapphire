import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { BookOpenText  } from "lucide-react";
import DataTable from "@components/datatable/DataTable.jsx";
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { DYNAMICS_ROUTES } from "@modules/dynamics/routes.js";

const SweepersGuardsList = () => {
    const dataTableRef = useRef();

    const columns = [
        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,
            Cell: ({ row }) => (
                <div className="flex justify-center space-x-2">
                    <Link to={`/module/dynamics/forms/sweepers-and-guards/edit/${row.original.id}`}>
                        <button className="ti-btn ti-btn-primary ti-btn-sm">
                            <i className="ri-edit-line" />
                        </button>
                    </Link>
                </div>
            ),
        },
        {
            Header: "Store Code",
            accessor: "store.store_code",
            filterable: true,
            filterType: "text",
            filterKey: "store__store_code", // ✅ for backend filtering
        },
        {
            Header: "Store Name",
            accessor: "store.store_name",
            filterable: true,
            filterType: "text",
            filterKey: "store__store_name",
        },
        {
            Header: "Number of Guards",
            accessor: "num_of_guards",
            filterable: true,
            filterType: "number",
            filterKey: "num_of_guards",
        },
        {
            Header: "Number of Sweepers",
            accessor: "num_of_sweepers",
            filterable: true,
            filterType: "number",
            filterKey: "num_of_sweepers",
        },
        {
            Header: "Leased Area (sq ft)",
            accessor: "leased_area_total",
            filterable: true,
            filterType: "number",
            filterKey: "leased_area_total",
            Cell: ({ value }) =>
                value ? `${parseFloat(value).toLocaleString()} sq ft` : "N/A",
        },
        {
            Header: "Store Capacity",
            accessor: "store_capacity_total",
            filterable: true,
            filterType: "number",
            filterKey: "store_capacity_total",
            Cell: ({ value }) => (value ? value.toLocaleString() : "N/A"),
        },
        {
            Header: "Hanging Capacity",
            accessor: "hanging_capacity_total",
            filterable: true,
            filterType: "number",
            filterKey: "hanging_capacity_total",
            Cell: ({ value }) => (value ? value.toLocaleString() : "N/A"),

        },
        {
            Header: "Created At",
            accessor: "created_at",
            filterable: true,
            filterType: "date",
            filterKey: "created_at",
            Cell: ({ value }) =>
                value ? new Date(value).toLocaleDateString() : "N/A",
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
                heading="Sweepers and Guards Management"
                description="Manage sweepers and guards data, store details, and capacity usage."
                icon={BookOpenText }
            />
            <DataTable
                ref={dataTableRef}
                columns={columns}
                title="Sweepers & Guards Management"
                apiUrl="/dynamics/sweepers-and-guards/datatable/"
                buttons={buttons}
                needHeader={false}
                enableAdvancedFilters={true} // ✅ advanced filters enabled
            />
        </>
    );
};

export default SweepersGuardsList;
