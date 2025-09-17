import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import { BookOpenText  } from "lucide-react";
import DataTable from "@components/datatable/DataTable.jsx";
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { DYNAMICS_ROUTES } from "@modules/dynamics/routes.js";
import {formatDate} from "@helpers/dateTime.js";

const SweepersGuardsList = () => {
    const dataTableRef = useRef();

    const columns = [
        {
            Header: "Actions",
            accessor: "id",          // keep accessor for table keying
            disableSortBy: true,
            Cell: ({ row }) => {
                const parentId = row.original.sweeper_guard_id; // ✅ parent SweeperAndGuard id
                return (
                    <div className="flex justify-center space-x-2">
                        <Link
                            to={`/module/dynamics/forms/sweepers-and-guards/edit/${parentId}`}
                        >
                            <button className="ti-btn ti-btn-primary ti-btn-sm">
                                <i className="ri-edit-line" />
                            </button>
                        </Link>
                    </div>
                );
            },
        },

        {
            Header: "Store Code",
            accessor: "store.store_code",
            filterable: true,
            filterType: "text",
            filterKey: "store__store_code",
        },
        {
            Header: "Store Name",
            accessor: "store.store_name",
            filterable: true,
            filterType: "text",
            filterKey: "store__store_name",
        },
        {
            Header: "Category",
            accessor: "category",
            filterable: true,
            filterType: "number",
            filterKey: "category",
        },
        {
            Header: "Design Pieces",
            accessor: "design_pieces",
            filterable: true,
            filterType: "number",
            filterKey: "design_pieces",
            Cell: ({ value }) => (value != null ? value.toLocaleString() : "N/A"),
        },
        {
            Header: "Area (sq ft)",
            accessor: "area_sq_feet",
            filterable: true,
            filterType: "number",
            filterKey: "area_sq_feet",
            Cell: ({ value }) =>
                value ? `${parseFloat(value).toLocaleString()} sq ft` : "N/A",
        },
        {
            Header: "Hanging Capacity",
            accessor: "hanging_capacity",
            filterable: true,
            filterType: "number",
            filterKey: "hanging_capacity",
            Cell: ({ value }) =>
                value != null ? value.toLocaleString() : "N/A",
        },
        {
            Header: "Created At",
            accessor: "created_at",
            filterType: "date",
            filterable: true,
        },
        {
            Header: "Updated At",
            accessor: "updated_at",
            filterType: "date",
            filterable: true,
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
